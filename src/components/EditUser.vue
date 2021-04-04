<template>
  <b-container>
    <div class="text-center">
      <div class="row">
        <div class="col-lg-6 offset-lg-3 col-sm-10 offset-sm-1">
          <form
            class="text-center border border-primary p-5"
            @submit.prevent="updateUser"
          >
            <input
              type="text"
              id="firstName"
              class="form-control mb-5"
              placeholder="First name"
              v-model="firstName"
              required
            />
            <input
              type="text"
              id="lastName"
              class="form-control mb-5"
              placeholder="Last name"
              v-model="lastName"
              required
            />
            <input
              type="text"
              id="phone"
              class="form-control mb-5"
              placeholder="Phone number"
              v-model="phoneNumber"
              required
            />

            <!-- Sign in button -->
            <center>
              <button-spinner
                :is-loading="isLoading"
                :disabled="isLoading"
                :status="status"
                class="btn btn-primary btn-block w-75 my-4"
                type="submit"
              >
                Update
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
  props: ["id"],
  data() {
    return {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      isLoading: false,
      status: "",
      auth: {
        token: "",
      },
    };
  },

  mounted() {
    this.$http
      .get(`/user/get/${this.id}`, {})
      .then((response) => {
        console.log(response);
        this.firstName = response.data.user.firstName;
        this.lastName = response.data.user.lastName;
        this.phoneNumber = response.data.user.phoneNumber;
      })
      .catch((error) => {
        return Vue.$toast.error(error.response.data.message);
      });
  },

  methods: {
    updateUser() {
      this.auth.token = localStorage.getItem("myyin_jwt");
      this.isLoading = true;
      this.$http
        .put(
          `/user/update/${this.id}`,
          {
            firstName: this.firstName,
            lastName: this.lastName,
            phoneNumber: this.phoneNumber,
          },
          {
            headers: {
              Authorization: `Bearer ${this.auth.token}`,
            },
          }
        )
        .then((response) => {
          if (response.data.code == 200) {
            this.isLoading = false;
            this.status = true; // or success
            setTimeout(() => {
              this.status = "";
            }, 2000);

            Vue.$toast.open(response.data.message);
          }
        })
        .catch((error) => {
          this.isLoading = false;
          this.status = false;
          console.error(error.response);
          return Vue.$toast.error(error.response.data.message);
        });
    },
  },
};
</script>
