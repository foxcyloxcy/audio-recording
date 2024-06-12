<script setup>
import api from "../../api/api";
import Swal from "sweetalert2";
</script>

<template>
  <v-table fixed-header height="100vh">
    <div class="body-container">
      <div>
        <div class="row">
          <label for="" class="label">Email</label>
          <div class="input-container">
            <input
              class="text-input"
              type="text"
              v-model="userData.email"
              readonly="true"
            />
          </div>
        </div>

        <div class="row">
          <label for="" class="label">Name</label>
          <div class="input-container">
            <input class="text-input" type="text" v-model="userData.name" />
          </div>
        </div>

        <div class="row">
          <label for="" class="label">Current Password</label>
          <div class="input-container">
            <input class="text-input" type="password" v-model="current_password" />
          </div>
        </div>

        <div class="row">
          <label for="" class="label">New Password</label>
          <div class="input-container">
            <input class="text-input" type="password" v-model="new_password" />
          </div>
        </div>

        <div class="row">
          <label for="" class="label">Confirm Password</label>
          <div class="input-container">
            <input class="text-input" type="password" v-model="confirm_password" />
          </div>
        </div>

        <!-- Save Button -->
        <div class="row">
          <div class="input-container">
            <button class="save-button" @click="saveData" @keyup.enter="login">
              Save
            </button>
            <button
              ref="cancelButton"
              class="cancel-button"
              @click="cancelData"
              :disabled="isCancelButtonDisabled"
              :style="{ backgroundColor: isCancelButtonDisabled ? '#bfbfbf' : '' }"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </v-table>
</template>

<script>
export default {
  props: ["userId"],
  data: () => ({
    userData: {},
    current_password: "",
    confirm_password: "",
    new_password: "",
    originalName: "",
  }),

  computed: {
    // Computed property to determine the disabled state of the Cancel button
    isCancelButtonDisabled() {
      return (
        this.userData.name === this.originalName &&
        this.current_password === "" &&
        this.new_password === "" &&
        this.confirm_password === ""
      );
    },
  },

  async mounted() {
    await this.handleQuery();
    this.originalName = this.userData.name;
  },

  watch: {
    // Watch for changes in the textboxes and update the computed property accordingly
    userData: {
      handler() {
        this.$nextTick(() => {
          this.updateCancelButtonState();
        });
      },
      deep: true,
    },
    current_password() {
      this.updateCancelButtonState();
    },
    new_password() {
      this.updateCancelButtonState();
    },
    confirm_password() {
      this.updateCancelButtonState();
    },
  },

  methods: {
    updateCancelButtonState() {
      this.$nextTick(() => {
        const isDisabled =
          this.userData.name === this.originalName &&
          this.current_password === "" &&
          this.new_password === "" &&
          this.confirm_password === "";
        this.$refs.cancelButton.disabled = isDisabled;
      });
    },

    cancelData() {
      // Revert the "Name" field to its original value
      this.userData.name = this.originalName;

      // Clear the password textboxes
      this.current_password = "";
      this.new_password = "";
      this.confirm_password = "";
    },

    async saveData() {
      console.log("save data");

      // Check if new_password or confirm_password is blank
      if (!this.new_password.trim() || !this.confirm_password.trim()) {
        this.showSweetAlert("Both New Password and Confirm Password are required.");
        return;
      }

      await api
        .post("login-credentials", {
          email: this.userData.email,
          password: this.current_password,
        })
        .then((result) => {
          console.log(result.data);
          if (result.data.status === 1) {
            // Update the originalName when changes are saved
            this.originalName = this.userData.name;

            this.updateUser(
              this.userData.email,
              this.userData.ind_id,
              this.userData.role,
              this.userData.name,
              this.new_password,
              this.userData.confirm_password
            );
            console.log("save data 92");
          } else {
            this.showSweetAlert("Incorrect Current Password");
            console.log("save data 94");
            // Only update confirm_password when passwords match
            this.confirm_password = this.new_password;
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
      if (this.new_password !== this.confirm_password) {
        Swal.fire({
          text: "Password is not the same as confirm password.",
          icon: "warning",
          confirmButtonText: "Ok",
          confirmButtonColor: "#A4CB37",
          cancelButtonColor: "#A4CB37",
        });
      } else if (this.new_password === this.confirm_password) {
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
                confirm_password: this.confirm_password, // Use this.confirm_password here
                created_by: this.userId,
                modified_by: this.userId,
              })
              .then((res) => {
                console.log(res);

                // Update userData.password with the new password
                this.userData.password = this.new_password;

                Swal.fire({
                  title: "Saved!",
                  text: `User ${userEmail} account details have been successfully changed.`,
                  icon: "success",
                  confirmButtonText: "Ok",
                  confirmButtonColor: "#A4CB37",
                });

                // Update the UI with the new data
                this.handleQuery();
              });
          }
        });
      }
    },

    async showSweetAlert(message) {
      Swal.fire({
        text: message,
        icon: "warning",
        showCancelButton: false,
        confirmButtonColor: "#A4CB37",
        confirmButtonText: "Ok",
      }).then((result) => {
        if (result.isConfirmed) {
        }
      });
    },

    async handleQuery() {
      try {
        const result = await api.post("get-individual-by-email", {
          email: sessionStorage.getItem("loggedEmail"),
        });
        console.log("API Response:", result);
        console.log("session email:", sessionStorage.getItem("loggedEmail"));

        this.userData = result.data[0];
        console.log("this.userData:", this.userData);
      } catch (error) {
        console.error("API Error:", error);
      }
    },
  },
};
</script>

<style scoped>
.body-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.disabled-button {
  background-color: gray;
  color: #555;
  cursor: not-allowed;
}
.row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.label {
  text-align: right;
  margin-right: 10px;
  width: 150px;
  font-size: 18px;
}

.text-input {
  height: 40px;
  font-size: 20px;
  padding: 8px 5px;
  width: 40%;
  box-sizing: border-box;
  border: 2px solid #7e7878;
  border-radius: 5px;
  border-style: solid;
  outline: none;
  min-width: 500px;
}

.save-button,
.cancel-button {
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-left: 160px;
  margin-right: -150px;
  background-color: #a4cb37;
  font-weight: bold;
  outline: none;
  width: 77px;
  height: 37px;
}
</style>
