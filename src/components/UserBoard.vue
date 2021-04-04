<template>
    <b-container>
    <div class="text-center">
        
          <b-card v-if="user" bg-variant="info" text-variant="white" :header="msg" class="text-center col-sm-6 col-sm-offset-3 col-md-6 col-md-offset-3">
        <b-card-text class="user-info">First name: {{ user.firstName}}</b-card-text>
        <b-card-text class="user-info">Last name: {{ user.lastName}}</b-card-text>
        <b-card-text class="user-info">Phone: {{ user.phoneNumber}}</b-card-text>
        <b-card-text class="user-info">Email: {{ user.email}}</b-card-text>
       {{"roles: "}} <span v-for="(role,index) in user.roles" :key="index" class="user-info"> {{ role.name }}, </span>
      </b-card>

       <b-card v-else bg-variant="info" text-variant="white" :header="msg" class=" text-center col-sm-6 col-sm-offset-3 col-md-6 col-md-offset-3 col-lg-6 col-lg-offset-3">
        <b-card-text class="user-info">User details not found</b-card-text>
      </b-card>

</div>
      
    </b-container>
</template>

<script>
    export default {
        data () {
            return {
                msg: 'User info',
                user:""

            }
        },
        mounted(){
           const userId = localStorage.getItem('myyin_user');
           console.log(userId)
            if(userId){
            this.$http.get(`/user/get/${userId}`,{})
            .then((response) =>{
                console.log(response);
            this.user = response.data.user;
            }).catch((error)=>{
                      return Vue.$toast.error(error.response.data.message);

            })
            }else{
                $router.push({name:"login"});
            }
        },
    methods:{

    }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h1, h2 {
        font-weight: normal;
    }
  .user-info{
      color:white !important;
  }
</style>