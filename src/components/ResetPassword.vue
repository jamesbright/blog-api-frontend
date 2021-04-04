<template>
  <b-container>
    <div class="text-center">
      <b-card-text>Enter new password</b-card-text>
      <div class="row">
        <div class="col-lg-6 offset-lg-3 col-sm-10 offset-sm-1">
          <form
            class="text-center border border-primary p-5"
            @submit.prevent="resetPassword"
          >
            <input
              type="password"
              id="password"
              class="form-control mb-5"
              placeholder="new password"
              v-model="password"
            />
            <!-- Password -->
            <input
              type="password"
              id="passwordConfirm"
              class="form-control mb-5"
              placeholder="confirm password"
              v-model="passwordConfirm"
            />
            <p>
              Dont have an account? Click
              <router-link to="/register"> here </router-link> to sign up
            </p>
            <center>
              <button-spinner
                :is-loading="isLoading"
                :disabled="isLoading"
                :status="status"
                class="btn btn-primary btn-block w-75 my-4"
                type="submit"
              >
                Reset
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
  data() {
    return {
      password: "",
      passwordConfirm: "",
      token: "",
      userId: "",
      isLoading: false,
      status: "",
    };
  },
  mounted() {
    if (this.$route.query.token) {
      console.log(this.$route.query.token);
      this.token = this.$route.query.token;
      this.userId = this.$route.query.userId;
    } else {
      return Vue.$toast.error("Error, no token found");
    }
  },
  methods: {
    resetPassword() {
      this.isLoading = true;

      if (!this.$route.query.token) {
        this.isLoading = false;
        this.status = false;
        return Vue.$toast.error("Error, no token found");
      }
      if (this.password === this.passwordConfirm && this.password.length >= 8) {
        this.$http
          .post("/auth/reset-password", {
            password: this.password,
            token: this.token,
            userId: this.userId,
          })
          .then((response) => {
            this.isLoading = false;
            this.status = true; // or success
            setTimeout(() => {
              this.status = "";
            }, 2000);

            Vue.$toast.success(response.data.message);
            this.$router.push({ name: "login" });
          })
          .catch((error) => {
            this.isLoading = false;
            this.status = false;
            return Vue.$toast.error(error);
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
