<template>
  <b-container>
    <div  class="text-center">
      <b-card-text>Don't have an account? Register Here!</b-card-text>
      <div class="row">
        <div class="col-lg-6 offset-lg-3 col-sm-10 offset-sm-1">
          <form
            class="text-center border border-primary p-5"
                 @submit.prevent="registerUser"
          >
            <input
              type="text"
              id="firstName"
              class="form-control mb-5"
              placeholder="First name"
              v-model="firstName"
            required />
            <input
              type="text"
              id="lastName"
              class="form-control mb-5"
              placeholder="Last name"
              v-model="lastName"
             required/>
            <input
              type="text"
              id="phone"
              class="form-control mb-5"
              placeholder="Phone number"
              v-model="phoneNumber"
             required/>
            <input
              type="text"
              id="email"
              class="form-control mb-5"
              placeholder="Email"
              v-model="email"
            required/>
            <!-- Password -->
            <input
              type="password"
              id="password"
              class="form-control mb-5"
              placeholder="Password"
              v-model="password"
             required/>
            <input
              type="password"
              id="password_confirmation"
              class="form-control mb-5"
              placeholder="confirm Password"
              v-model="passwordConfirm"
            required/>
            <p>
              Already have an account? Click
              <router-link to="/login"> here </router-link> to sign in
            </p>
            <!-- Sign in button -->
            <center>
               <button-spinner
                :is-loading="isLoading"
                :disabled="isLoading"
                :status="status"
                class="btn btn-primary btn-block w-75 my-4" type="submit">
                Sign up
              </button-spinner>
            </center>
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
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
      passwordConfirm: "",
      isLoading: false,
      status: "",
    };
  },
  methods: {
    registerUser() {
      this.isLoading = true;
      if (this.password === this.passwordConfirm && this.password.length >= 8) {
        this.$http
          .post("/auth/register", {
            firstName: this.firstName,
            lastName: this.lastName,
            phoneNumber: this.phoneNumber,
            email: this.email,
            password: this.password,
          })
          .then((response) => {
            if (response.data.code == 201) {
              this.isLoading = false;
              this.status = true; // or success
              setTimeout(() => {
                this.status = "";
              }, 2000);

              if (this.$route.params.nextUrl != null) {
                this.$router.push(this.$route.params.nextUrl);
              } else {
                Vue.$toast.open("Successfully registered, you can now login");
                this.$router.push({ name: "login" });
              }
            }
          })
          .catch((error) => {
            console.error(error.response);
            return Vue.$toast.error(error.response.data.message);
          });
      } else {
        if (this.password.length < 8) {
          this.isLoading = false;
          this.status = false;
          return Vue.$toast.error("Password must be 8 or more characters long");
        } else if (this.password !== this.passwordConfirm) {
          this.isLoading = false;
          this.status = false;
          return Vue.$toast.error("Passwords do not match");
        }
      }
    },
  },
};
</script>
