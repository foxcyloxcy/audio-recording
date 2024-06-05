<script setup>
import api from "../../api/api.js";
import logoPath from "../../assets/credit-union-of-texas-logo.svg";
import Swal from "sweetalert2";
import axios from "axios"
</script>
<template>
  <div class="login-container">
    <div class="image-container">
      <v-img width="100" :aspect-ratio="10" :src="logoPath"></v-img>
      <v-alert
        v-if="alertText"
        class="alert-message"
        closable
        :text="alertText"
        type="error"
      ></v-alert>
    </div>
    <div class="form-container">
      <v-sheet width="80%" class="mx-auto">
        <h2 class="login-title">Call Recordings Login</h2>
        <v-form @submit.prevent="login" @keyup.enter="login">
          <div class="row">
            <label for="" class="label">Email</label>
            <div class="input-container">
              <input class="input" v-model="email" />
            </div>
          </div>

          <div class="row">
            <label class="password-label">Password</label>
            <div class="password-input">
              <input class="inputs" v-model="password" :type="type" autocomplete="off" />
              <p v-if="type === 'password'" class="show-button" @click="showPassword">
                Show
              </p>
              <p v-if="type === ''" class="hide-button" @click="hidePassword">Hide</p>
            </div>
          </div>
          <v-btn type="submit" class="login-button" @click="login">Login</v-btn>
        </v-form>
      </v-sheet>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loggedUserId: "",
      email: "",
      password: "",
      type: "password",
      loggedIn: "no",
      loggedInMessage: "",
      loggedUserRole: "",
      loggedUserName: "",
      loggedemail: "",
      alertText: "",

      logoPath: logoPath,
    };
  },
  methods: {
    async showSweetAlert(message) {
      Swal.fire({
        text: message,
        icon: "warning",
        showCancelButton: false,
        confirmButtonColor: "#A4CB37",
        confirmButtonText: "Ok",
      }).then((result) => {
        if (result.isConfirmed) {
          this.loggedIn = "no";
        }
      });
    },
    onLogin() {
      this.$emit("loggedIn", {
        loggedInStatus: this.loggedIn,
        loggedInMessage: this.loggedInMessage,
        userId: this.loggedUserId,
        userRole: this.loggedUserRole,
        userName: this.loggedUserName,
        email: this.loggedemail,
      });
    },

    async login() {
      // await api
      //   .post("login-credentials", {
      //     email: this.email,
      //     password: this.password,
      //   })
      console.log("login clicked")
      await axios.post("http://localhost:80/login-credentials", {
          email: this.email,
          password: this.password,
        })
        .then((result) => {
          console.log(result.data);
          if (result.data.status === 1) {
            this.loggedIn = "yes";
            this.loggedInMessage = result.data.message;
            this.loggedUserId = result.data.ind_id;
            this.loggedUserRole = result.data.role;
            this.loggedUserName = result.data.name;
            this.loggedemail = result.data.email;
            sessionStorage.setItem("loggedEmail", this.loggedemail);

            this.alertText = "";
            this.onLogin();
          } else {
            this.showSweetAlert(result.data.message);
          }
        });
    },

    showPassword() {
      this.type = "";
    },

    hidePassword() {
      this.type = "password";
    },
  },
};
</script>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.row {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}
.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.label,
.password-label {
  width: 80px;
  font-weight: bold;
  text-align: right;
  margin-right: 10px;
}

.input-container,
.password-input {
  flex: 1;
  position: relative;
  widows: 1000%;
}

.input,
.inputs {
  width: calc(100% - 20px);
  padding: 8px;
  box-sizing: border-box;
  border: 2px solid #100f0f;
  border-radius: 4px;
}

.show-button,
.hide-button {
  position: absolute;
  right: 30px; /* Adjust the value to move it more to the left */
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.login-container {
  width: 50%;
  align-items: center;
  margin-top: 120px;
}

.login-title {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.login-button {
  background-color: #a4cb37;
  text-transform: none !important;
  box-shadow: 0px 2px 10px -4px #b45a5a;
  border-style: none;
  font-weight: bold;
  text-align: center;
  margin: 0 auto;
  display: block;
  outline: none;
}

.image-container {
  margin: 0 0 0 0;
  display: flex;
  justify-content: center;
}
</style>
