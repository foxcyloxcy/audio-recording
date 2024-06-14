<script setup>

</script>

<template>
    <div class="login-container">
        <h2 class="logout-question" v-if="loggedIn === 'yes'">Do you want to logout?</h2>
        <v-btn class="button" v-if="loggedIn === 'yes'" @click="logOut">
            <font-awesome-icon :icon="['fas', 'sign-out']" />
            Logout
        </v-btn>
    </div>

</template>

<script>
export default {
    data: () => ({
        loggedIn: "yes",
        loggedInMessage: "reset",
        loggedUserRole: "reset",
        loggedUserName: "reset"
    }),
    methods:{
        logOut(){
            this.loggedIn = 'no'
            document.location.href = "https://foxcyloxcy.github.io/call-recording/";
        },
    }

}
</script>

<style scoped>
.login-container{
    height: 79vh;
}

.logout-question{
    margin: 0 25px 0 25px;
}
.button{
    background-color: #A4CB37;
    width: 15%;
    box-shadow: 0px 2px 10px -4px #000000;
    margin: 20px 25px 0 25px;
    text-transform: none !important;
}
</style>