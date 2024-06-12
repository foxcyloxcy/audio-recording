<script setup>
import api from "../../api/api";
import Swal from "sweetalert2";
import axios from "axios";
</script>

<template>
  <v-table fixed-header height="80vh" class="table" id="results-table">
    <thead>
      <tr>
        <th>Email</th>
        <th>Name</th>
        <th class="role-header">Role</th>
        <th class="password-header">Password</th>
        <th class="password-header">Confirm Password</th>
        <th class="action-header">Actions</th>
      </tr>
    </thead>
    <tr>
      <td>
        <input
          class="email-input"
          type="text"
          v-model="userData.email"
          required
          autocomplete="off"
        />
      </td>
      <td>
        <input
          class="name-input"
          type="text"
          v-model="userData.name"
          autocomplete="off"
        />
      </td>
      <td>
        <select name="roles" v-model="userData.role" id="select-button">
          <option selected :value="null">Select role</option>
          <option
            v-for="role in userRoles"
            v-bind:key="role.role_id"
            v-bind:value="role.role_id"
          >
            {{ role.role_name }}
          </option>
        </select>
      </td>
      <td>
        <input
          class="password-input"
          type="password"
          v-model="userData.password"
          autocomplete="off"
        />
      </td>
      <td>
        <input
          class="password-input"
          type="password"
          v-model="userData.confirm_password"
          autocomplete="off"
        />
      </td>
      <td>
        <button :class="addButtonClass" @click="createUser()" :disabled="enableAddButton">
          Add
        </button>
      </td>
    </tr>
    <tbody v-if="users.length > 0">
      <tr v-for="user in users" :key="user.email">
        <td>
          {{ user.email }}
        </td>
        <td>
          <input class="name-input" type="text" v-model="user.name" />
        </td>
        <td>
          <select name="roles" v-model="user.role" id="select-button">
            <option
              v-for="role in userRoles"
              v-bind:key="role.role_id"
              v-bind:value="role.role_id"
            >
              {{ role.role_name }}
            </option>
          </select>
        </td>
        <td>
          <input class="password-input" type="password" v-model="user.password" />
        </td>
        <td>
          <input class="password-input" type="password" v-model="user.confirm_password" />
        </td>
        <td>
          <button
            :class="{
              'save-button': isUserChanged[user.email],
              'disabled-button': !isUserChanged[user.email],
            }"
            @click="
              updateUser(
                user.email,
                user.ind_id,
                user.role,
                user.name,
                user.password,
                user.confirm_password
              )
            "
            :disabled="!isUserChanged[user.email]"
          >
            Save
          </button>

          <button class="delete-button" @click="deleteUser(user.email, user.ind_id)">
            Delete
          </button>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
export default {
  props: ["userId"],
  data: () => ({
    users: [],
    userDataChecker: [],
    userRoles: [],
    userData: {
      email: "",
      name: "",
      role: null,
      password: "",
      confirm_password: "",
    },
    userRoleData: {
      ind_id: "",
      role_id: "",
    },
    addButtonClass: "disabled-button",
    saveButtonClass: "disabled-button",
    selected_ind_id: "none",
  }),
  async mounted() {
    this.getIndividualRecords();
    this.getRoles();
    await api.get("individuals").then((result) => {
      this.userDataChecker = result.data; // Make sure result.data is the correct array of initial user data
    });
  },
  watch: {
    users: {
      handler(newVal) {
        this.$nextTick(() => {
          this.$forceUpdate();
        });
      },
      deep: true,
    },
  },
  computed: {
    enableAddButton: function () {
      if (
        this.userData.email === "" &&
        this.userData.name === "" &&
        this.userData.role === null &&
        this.userData.password === "" &&
        this.userData.confirm_password === ""
      ) {
        return true;
      } else if (
        this.userData.email &&
        this.userData.name === "" &&
        this.userData.role === null &&
        this.userData.password === "" &&
        this.userData.confirm_password === ""
      ) {
        return true;
      } else if (
        this.userData.email &&
        this.userData.name &&
        this.userData.role === null &&
        this.userData.password === "" &&
        this.userData.confirm_password === ""
      ) {
        return true;
      } else if (
        this.userData.email &&
        this.userData.name &&
        this.userData.role &&
        this.userData.password === "" &&
        this.userData.confirm_password === ""
      ) {
        return true;
      } else if (
        this.userData.email &&
        this.userData.name &&
        this.userData.role &&
        this.userData.password &&
        this.userData.confirm_password === ""
      ) {
        return true;
      } else if (
        this.userData.email &&
        this.userData.name &&
        this.userData.role &&
        this.userData.password &&
        this.userData.confirm_password
      ) {
        this.addButtonClass = "add-button";
        return false;
      }
    },

    isUserChanged() {
      const changedStatus = {};

      for (let i = 0; i < this.users.length; i++) {
        const userObj = this.userDataChecker.find(
          (obj) => obj.email === this.users[i].email
        );
        console.log("userObj:", userObj); // Debugging line

        if (!userObj) {
          changedStatus[this.users[i].email] = false;
          continue;
        }

        changedStatus[this.users[i].email] =
          this.users[i].name !== userObj.name ||
          this.users[i].password !== userObj.password ||
          this.users[i].confirm_password !== userObj.confirm_password ||
          this.users[i].role !== userObj.role;
        console.log("changedStatus:", changedStatus); // Debugging line
      }

      return changedStatus;
    },
  },
  methods: {
    async getIndividualRecords() {
      await api.get("individuals").then((result) => {
        this.users = result.data;
      });
    },

    async getIndividualRecordByEmail(email) {
      await api.post("get-individual-by-email", email).then((result) => {
        this.insertIndividualRole();
      });
    },

    async getRoles() {
      await api.get("roles").then((result) => {
        this.userRoles = result.data;
      });
    },

    async createUser() {
      await api
        .post("check-email-exist", {
          email: this.userData.email,
        })
        .then(async (result) => {
          if (result.data.status === 1) {
            Swal.fire({
              text: "Email already exists",
              icon: "warning",
              confirmButtonText: "Ok",
              confirmButtonColor: "#A4CB37",
              cancelButtonColor: "#A4CB37",
            });
          } else {
            if (this.userData.email === "") {
              Swal.fire({
                text: "Email field is required.",
                icon: "warning",
                confirmButtonText: "Ok",
                confirmButtonColor: "#A4CB37",
                cancelButtonColor: "#A4CB37",
              });
            } else if (this.userData.email && this.userData.name === "") {
              Swal.fire({
                text: "Name field is required.",
                icon: "warning",
                confirmButtonText: "Ok",
                confirmButtonColor: "#A4CB37",
                cancelButtonColor: "#A4CB37",
              });
            } else if (this.userData.email && this.userData.role === null) {
              Swal.fire({
                text: "Please select a role.",
                icon: "warning",
                confirmButtonText: "Ok",
                confirmButtonColor: "#A4CB37",
                cancelButtonColor: "#A4CB37",
              });
            } else if (
              this.userData.email &&
              this.userData.role &&
              this.userData.password === ""
            ) {
              Swal.fire({
                text: "Password field is required.",
                icon: "warning",
                confirmButtonText: "Ok",
                confirmButtonColor: "#A4CB37",
                cancelButtonColor: "#A4CB37",
              });
            } else if (
              this.userData.email &&
              this.userData.role &&
              this.userData.password !== this.userData.confirm_password
            ) {
              Swal.fire({
                text: "Password is not the same as confirm password.",
                icon: "warning",
                confirmButtonText: "Ok",
                confirmButtonColor: "#A4CB37",
                cancelButtonColor: "#A4CB37",
              });
            } else if (
              this.userData.email &&
              this.userData.role &&
              this.userData.password === this.userData.confirm_password
            ) {
              await api
                .post("individual", {
                  email: this.userData.email,
                  role: this.userData.role,
                  name: this.userData.name,
                  password: this.userData.password,
                  confirm_password: this.userData.confirm_password,
                  created_by: this.userId,
                  modified_by: this.userId,
                })
                .then(async () => {
                  // Update userDataChecker with the new user data
                  const newUserObj = {
                    email: this.userData.email,
                    name: this.userData.name,
                    role: this.userData.role,
                    password: this.userData.password,
                    confirm_password: this.userData.confirm_password,
                  };

                  this.userDataChecker.push(newUserObj);

                  // Update the users array
                  this.users.push(newUserObj);

                  await this.getIndividualRecords();

                  Swal.fire({
                    title: "Success!",
                    text: "New user successfully added.",
                    icon: "success",
                    confirmButtonText: "Ok",
                    confirmButtonColor: "#A4CB37",
                  });

                  this.userData.email = "";
                  this.userData.name = "";
                  this.userData.role = null;
                  this.userData.password = "";
                  this.userData.confirm_password = "";

                  this.addButtonClass = "disabled-button";
                });
            }
          }
        });
    },

    async deleteUser(userEmail, userIndId) {
      Swal.fire({
        title: "Delete",
        text: `Are you sure you want to delete user ${userEmail}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#A4CB37",
        cancelButtonColor: "#A4CB37",
        confirmButtonText: "Ok",
      }).then((result) => {
        if (result.isConfirmed) {
          api
            .delete(`del-ind-by-email-and-id/${userEmail}/${userIndId}`)
            .then(() => {

              Swal.fire({
                title: "Deleted!",
                text: `User ${userEmail} has been successfully deleted.`,
                icon: "success",
                confirmButtonColor: "#A4CB37",
                confirmButtonText: "Ok",
              });
              this.getIndividualRecords();
            });
        }
      });
    },

    async updateUser(
      userEmail,
      userIndId,
      userRole,
      userName,
      userPassword,
      userConfirmPassword
    ) {
      if (userPassword === "") {
        Swal.fire({
          text: "Password field is required.",
          icon: "warning",
          confirmButtonText: "Ok",
          confirmButtonColor: "#A4CB37",
          cancelButtonColor: "#A4CB37",
        });
      } else if (userPassword !== userConfirmPassword) {
        Swal.fire({
          text: "Password is not the same as confirm password.",
          icon: "warning",
          confirmButtonText: "Ok",
          confirmButtonColor: "#A4CB37",
          cancelButtonColor: "#A4CB37",
        });
      } else if (userPassword === userConfirmPassword) {
        Swal.fire({
          title: "Save",
          text: `Are you sure you want to save changes for user ${userEmail}?`,
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#A4CB37",
          cancelButtonColor: "#A4CB37",
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed) {
            api
              .put(`update-individual-by-email/${userEmail}/${userIndId}`, {
                role: userRole,
                name: userName,
                password: userPassword,
                confirm_password: userConfirmPassword,
                created_by: this.userId,
                modified_by: this.userId,
              })
              .then((res) => {
                console.log(res);
                Swal.fire({
                  title: "Saved!",
                  text: `User ${userEmail} account details has been successfully changed.`,
                  icon: "success",
                  confirmButtonText: "Ok",
                  confirmButtonColor: "#A4CB37",
                });
                this.getIndividualRecords();
                api.get("individuals").then((result) => {
                  this.userDataChecker = result.data;
                });
              });
          }
        });
      }
    },
  },
};
</script>

<style scoped>
#results-table {
  min-width: 90%;
  margin: 0 2%; /* Add margin to the table */
  border-collapse: collapse;
  table-layout: fixed;
}

#results-table tr:nth-child(even) {
  background-color: #fff;
}

#results-table tr:nth-child(odd) {
  background-color: #efecec;
}

#results-table td,
#results-table th {
  padding: 10px;
  height: auto;
  text-align: left;
  font-size: 0.9vw;
}

#results-table th {
  font-weight: bold;
  background-color: #f0f0f0;
  border: 1px solid #fff;
}
.password-header {
  width: 13%;
}

.role-header {
  width: 9%;
}
.action-header {
  width: 20%;
}

#results-table td {
  word-wrap: break-word;
  border: 1px solid #ddd;
}

select {
  width: 100%;
}
.password-input {
  width: 100%;
}
.name-input,
.email-input {
  width: 100%;
}
.add-button {
  background-color: #a4cb37;
  width: 45%;
  margin: 0 5px 0 5px;
  font-weight: bold;
  font-size: 0.9vw;
  outline: none;
}

.save-button {
  background-color: #a4cb37;
  width: 45%;
  margin: 0 5px 0 5px;
  font-weight: bold;
  font-size: 0.9vw;
  outline: none;
}

.delete-button {
  background-color: #ff0000;
  width: 45%;
  margin: 0 5px 0 5px;
  font-weight: bold;
  font-size: 0.9vw;
  outline: none;
}

.disabled-button {
  background-color: #bfbfbf;
  width: 45%;
  box-shadow: 0px 2px 10px -4px #000000;
  margin: 0 5px 0 5px;
  font-weight: bold;
  font-size: 0.9vw;
}

#select-button {
  width: 100%;
  -webkit-appearance: menulist;
  font-size: 0.9vw;
}

#results-table th,
#results-table td,
#results-table button {
  white-space: nowrap;
}
</style>
