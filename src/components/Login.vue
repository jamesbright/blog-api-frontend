<template>
  <b-container>
    <div class="text-center">
      <b-card-text>Already have an account? Login Here!</b-card-text>
      <div class="row">
        <div class="col-lg-6 offset-lg-3 col-sm-10 offset-sm-1">
          <form class="text-center border border-primary p-5" @submit.prevent="loginUser">
            <input
              type="text"
              id="email"
              class="form-control mb-5"
              placeholder="Email"
              v-model="email"
              required
            />
            <!-- Password -->
            <input
              type="password"
              id="password"
              class="form-control mb-5"
              placeholder="Password"
              v-model="password"
              required
            />
            <p>
              Dont have an account? Click
              <router-link to="/register"> here </router-link> to sign up
            </p>
            <!-- Sign in button -->
            <center>
              <button-spinner
                :is-loading="isLoading"
                :disabled="isLoading"
                :status="status"
                class="btn btn-primary btn-block w-75 my-4"
                type="submit"
              >
                Sign in
              </button-spinner>
            </center>
            <b-card-text class="">
              forgotten password? Click
              <router-link to="/request-password-reset"> here </router-link> to reset your
              password.
            </b-card-text>
          </form>
        </div>
      </div>
    </div>
  </b-container>
</template>

<script>
import Vue from "vue";
export default {
  props: ["nextUrl"],
  data() {
    return {
      email: "",
      password: "",
      url: "",
      isLoading: false,
      status: "",
    };
  },

  mounted() {
    console.log(this.$router.params.nextUrl);
  },
  methods: {
    loginUser() {
      this.isLoading = true;
      if (this.password.length > 0) {
        this.$http
          .post("/auth/login", {
            email: this.email,
            password: this.password,
          })
          .then((response) => {
            if (response.data.code == 200) {
              this.isLoading = false;
              this.status = true; // or success
              setTimeout(() => {
                this.status = "";
              }, 2000);

              const userId = response.data._id;
              const token = response.data.token;
              localStorage.setItem("myyin_user", userId);
              localStorage.setItem("myyin_jwt", token);

              if (localStorage.getItem("myyin_jwt") != null) {
                this.$emit("loggedIn");

                if (this.nextUrl) {
                  this.$router.push(this.nextUrl);
                } else {
                  this.isLoading = true;
                  this.$http
                    .get(`/user/get/${userId}`)
                    .then((response) => {
                      this.isLoading = false;
                      this.status = true; // or success
                      setTimeout(() => {
                        this.status = "";
                      }, 2000);

                      if (response.data.code == 200) {
                        let roles = [];
                        response.data.user.roles.forEach((role) => {
                          roles.push(role.name);
                        });
                        roles.sort();
                        console.log(roles);
                        roles.every((role) => {
                          if (role == "superAdmin") {
                            this.url = "superAdmin";
                            localStorage.setItem("myyin_superAdminUser", 1);
                            return false;
                          } else if (role == "admin") {
                            this.url = "admin";
                            localStorage.setItem("myyin_adminUser", 1);
                            return false;
                          } else {
                            this.url = "userboard";
                          }
                        });

                        this.$router.push({ name: this.url });
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                      this.isLoading = false;
                      this.status = false;
                      return Vue.$toast.error(error.response.data.message);
                    });
                }
              }
            }
          })
          .catch((error) => {
            this.isLoading = false;
            this.status = false;
            return Vue.$toast.error(error.response.data.message);
          });
      }
    },
  },
};
</script>
