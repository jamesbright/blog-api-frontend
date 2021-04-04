<template>
  <div id="app">
    <b-container fluid>
      <b-navbar toggleable="lg" type="dark" variant="danger" class="mb-4">
       <router-link to="/"> <b-navbar-brand >MyyBlog</b-navbar-brand></router-link>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="text-light">
            <router-link class="text-light mr-2" v-if="!loggedIn" to="/register"
              >Register</router-link
            >
            <router-link class="text-light mr-2" v-if="!loggedIn" to="/login">
               Login
            </router-link>
             <router-link class="text-light mr-2" v-if="loggedIn" to="/user-dashboard">
               Dashboard
            </router-link>
            <router-link class="text-light mr-2" to="/articles">  Blog </router-link>
             <router-link
              class="text-light"
              v-if="loggedIn"
              @click.native.capture="logOut"
              to="#"
            >
               Log Out</router-link
            >
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </b-container>
    <transition
      mode="out-in"
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
    >
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {
  name: "App",

  beforeUpdate() {
    const token = localStorage.getItem("myyin_jwt");
    if (token == null) this.loggedIn = false;
    else this.loggedIn = true;
  },
  methods: {
    logOut() {
      localStorage.clear();
      this.$router.push({ name: "login" });
    },
  },
  data() {
    return {
      loggedIn: "",
    };
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap");
:root {
  --animate-delay: 1s;
}

</style>
