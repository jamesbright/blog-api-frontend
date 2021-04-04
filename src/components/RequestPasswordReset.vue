<template>
  <b-container>
    <div class="text-center">
      <b-card-text>Enter your email to recieve a password reset link</b-card-text>
      <div class="row">
        <div class="col-lg-6 offset-lg-3 col-sm-10 offset-sm-1">
          <form
            class="text-center border border-primary p-5"
                        @submit.prevent="sendLink"
          >
            <input
              type="text"
              id="email"
              class="form-control mb-5"
              placeholder="Email"
              v-model="email"
            required/>
           
            <center>
               <button-spinner
                :is-loading="isLoading"
                :disabled="isLoading"
                :status="status"
                 class="btn btn-primary btn-block w-75 my-4" type="submit">
                Send reset link
              </button-spinner>
            </center>
          </form>
        </div>
      </div>
    </div>
  </b-container>
</template>

<script>
import Vue from 'vue';
export default {
  props: ["nextUrl"],
  data() {
    return {
      email: "",
      isLoading:false,
      status :"",
      
    };
  },
  methods: {
    sendLink() {
      this.isLoading = true;
        this.$http
          .post("/auth/request-password-reset", {
            email: this.email
          })
          .then((response) => {

             this.isLoading = false;
              this.status = true; // or success
              setTimeout(() => {
                this.status = "";
              }, 2000);

                     return Vue.$toast.success(response.data.message);
          })
          .catch((error) =>{
            this.isLoading = false;
            this.status = false;
            return Vue.$toast.error(error.response.data.message);
          });
      
    },
  },
};
</script>
