<script setup>
// import HelloWorld from './components/HelloWorld.vue'
import CallRecordingHistory from "./components/CallRecordingsComponent/CallRecordingHistory.vue";
import Login from "./components/LoginComponent/LoginComponent.vue";
import UserManagement from "./components/UserManagementComponent/UserManagement.vue";
import AccountSettings from "./components/AccountSettingsComponent/AccountSettings.vue";

import Swal from "sweetalert2";
import { markRaw } from "vue";
import logoPath from "./assets/call-recording.png";
</script>

<template>
  <v-container fluid>
    <v-layout v-if="loggedIn === 'no'">
      <v-main class="d-flex align-center justify-center" style="width: 100%">
        <Login @loggedIn="onLogin" />
      </v-main>
    </v-layout>

    <v-card v-if="loggedIn === 'yes'">
      <v-toolbar color="#fff">
        <div class="image-container">
          <v-img width="100" height="125" :aspect-ratio="1" :src="logoPath"></v-img>
        </div>
        <v-toolbar-title></v-toolbar-title>

        <v-spacer></v-spacer>
        <p class="user-welcome">Welcome, {{ loggedUserName }}</p>

        <template v-slot:extension>
          <v-tabs
            v-if="loggedUserRole === 1 || loggedUserRole === 2"
            v-model="tab"
            align-tabs="title"
          >
            <v-tab
              v-for="item in loggedUserRole === 1 ? items : userItems"
              :key="item.content"
              :value="item.content"
            >
              {{ item.tab }}
            </v-tab>
            <v-tab @click="showSweetAlert"> Logout </v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

      <div class="spacer-div"></div>
      <v-window v-model="tab" v-if="loggedUserRole === 1 || loggedUserRole === 2">
        <v-window-item
          v-for="item in loggedUserRole === 1 ? items : userItems"
          :key="item.content"
          :value="item.content"
        >
          <v-card flat>
            <v-card-text>
              <component v-bind:is="item.content" :userId="loggedUserId"></component>
            </v-card-text>
          </v-card>
        </v-window-item>
      </v-window>
    </v-card>
  </v-container>
</template>

<style scoped>
.v-card-text {
  padding: 10px;
}
.spacer-div {
  background-color: #e1e1e1;
  height: 4vh;
}
.v-container {
  padding: 0;
}

.v-tab {
  /*font-size: 1vw;*/
  text-transform: none !important;
  outline: none;
}
.tab-text {
  white-space: nowrap;
  font-size: 1vw;
}
.v-tabs--align-tabs-title:not(.v-slide-group--has-affixes) .v-tab:first-child {
  margin-inline-start: 0;
}

.v-tabs--align-tabs-title:not(.v-slide-group--has-affixes) .v-tab:active {
  background-color: none;
}

.v-tabs--align-tabs-title:not(.v-slide-group--has-affixes) .v-tab:focus {
  background-color: none;
}

.v-tabs--align-tabs-title:not(.v-slide-group--has-affixes) .v-tab:first-child:focus {
  background-color: none;
}
.image-container {
  margin: 0 0 0 30px;
  display: flex;
  justify-content: flex-start;
}

.user-welcome {
  padding: 100px 20px 0 0;
  white-space: nowrap;
  /*font-size: 16px; */
  font-size: 1vw;
}
</style>

<script>
export default {
  data: () => ({
    drawer: false,
    group: null,
    loggedIn: "no",
    loggedInMessage: "",
    loggedUserId: "",
    loggedUserRole: "",
    loggedUserName: "",
    tab: null,
    brandData: {
      header_text_color: "#FFFFFF",
      header_text_size: "14px",
      header_bg_color: "#fff",
      footer_text_color: "#FFFFFF",
      footer_text_size: "14px",
      footer_bg_color: "#fff",
      main_color1: "#0090D1",
      main_color2: "#0090D1",
      main_color3: "#0090D1",
      accent_color1: "#0090D1",
      button_text_color: "#FFFFFF",
      font_text_color: "#54575B",
      font: "Open Sans",
      font_title_size: "27px",
    },
    items: [
      { tab: "Call Recordings", content: markRaw(CallRecordingHistory) },
      { tab: "User Management", content: markRaw(UserManagement) },
      { tab: "Account Settings", content: markRaw(AccountSettings) },
    ],
    userItems: [{ tab: "Call Recordings", content: markRaw(CallRecordingHistory) }],
  }),

  methods: {
    showflash() {
      flashMessage(
        this.$flashMessage,
        this.brandData.accent_color1 ? this.brandData.accent_color1 : "#F47820",
        this.brandData.flash_text_color ? this.brandData.flash_text_color : "#ffffff",
        "test"
      );
    },

    showSweetAlert() {
      Swal.fire({
        text: `Are you sure you want to Logout?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#A4CB37",
        cancelButtonColor: "#A4CB37",
        confirmButtonText: "Ok",
      }).then((result) => {
        if (result.isConfirmed) {
          sessionStorage.removeItem("loggedEmail");
          this.loggedIn = "no";
          document.location.href = "/";
        }
      });
    },
    onLogin(value) {
      // console.log(value);
      this.loggedIn = value.loggedInStatus;
      this.loggedInMessage = value.loggedInMessage;
      this.loggedUserId = value.userId;
      this.loggedUserRole = value.userRole;
      this.loggedUserName = value.userName;
    },
  },

  watch: {
    group() {
      this.drawer = false;
    },
  },
};
</script>
