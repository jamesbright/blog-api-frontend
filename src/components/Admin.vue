<template>
  <b-container>
    <div class="text-center">
      <b-card
        v-if="user"
        bg-variant="info"
        text-variant="white"
        :header="msg"
        class="text-center col-sm-6 col-sm-offset-3 col-md-6 col-md-offset-3"
      >
        <b-card-text class="user-info">First name: {{ user.firstName }}</b-card-text>
        <b-card-text class="user-info">Last name: {{ user.lastName }}</b-card-text>
        <b-card-text class="user-info">Phone: {{ user.phoneNumber }}</b-card-text>
        <b-card-text class="user-info">Email: {{ user.email }}</b-card-text>
        {{ "roles: " }}
        <span v-for="(role, index) in user.roles" :key="index" class="user-info">
          {{ role.name }},
        </span>
      </b-card>

      <b-card
        v-else
        bg-variant="info"
        text-variant="white"
        :header="msg"
        class="text-center col-sm-6 col-sm-offset-3 col-md-6 col-md-offset-3 col-lg-6 col-lg-offset-3"
      >
        <b-card-text class="user-info">User details not found</b-card-text>
      </b-card>
    </div>
<hr>
    <div class="mt-2 col-sm-6 col-md-6 col-lg-6 col-xs-6">
      <b-input-group size="sm"  class=" mb-2 text-right">
      <b-input-group-prepend  is-text>
        <b-icon icon="search"></b-icon>
        <b-form-input
        placeholder="search"
          v-model="keyword"
          class="ml-1"
          id="search"
        > </b-form-input>
        </b-input-group-prepend>
        </b-input-group>
     </div>
  
    <b-row class="mt-2" v-if="blogs">
    
      <b-col
        v-for="(blog, index) in blogs"
        :key="index"
        class="mb-4 col-sm-4 col-md-4 col-lg-4"
      >
      
        <b-card
          :header="blog.title"
          header-bg-variant="danger"
          header-text-variant="white"
          align="center"
        >
        <b-card-img
        v-if="blog.imageURL != null"
            style="max-height: 15rem"
            :src="blog.imageURL"
            alt="Image"
            class="rounded-0"
          >
          </b-card-img>
          <b-card-img
        v-else
            style="max-height: 15rem"
            src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg"
            alt="Image"
            class="rounded-0"
          >
          </b-card-img>

          <b-card-body>
            <b-card-sub-title v-if="blog.author" class="text-left">
              {{ blog.author.firstName }} {{ blog.author.lastName }}
            </b-card-sub-title>

            <b-card-sub-title class="mb-2 text-right">{{
              formatDate(blog.createdAt)
            }}</b-card-sub-title>

            <router-link :to="{ name: 'readArticle', params: { id: blog._id } }">
              <b-button variant="primary"
                >View <b-icon icon="b-icon-eye-fill"></b-icon
              ></b-button>
            </router-link>

            <router-link :to="{ name: 'editArticle', params: { id: blog._id } }">
              <b-button variant="info"
                >Edit<b-icon icon="b-icon-pencil"></b-icon>
              </b-button>
            </router-link>
            <b-button @click="remove(blog._id, index)" variant="danger"
              >Remove <b-icon icon="b-icon-trash"></b-icon
            ></b-button>
          </b-card-body>
        </b-card>
        
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Vue from "vue";
import moment from "moment";
import { debounce } from "lodash";

export default {
  data() {
    return {
      msg: "Admin info",
      user: "",
      blogs: "",
      keyword:"",
      auth: {
        config: "",
        token: "",
      },
    };
  },
  mounted() {
    const userId = localStorage.getItem("myyin_user");
    console.log(userId);
    if (userId) {
      this.$http
        .get(`/user/get/${userId}`, {})
        .then((response) => {
          console.log(response);
          this.user = response.data.user;
        })
        .catch((error) => {
          return Vue.$toast.error(error.response.data.message);
        });
    } else {
      $router.push({ name: "login" });
    }

    this.$http
      .get("/blogs/get/", {})
      .then((response) => {
        this.loading = false;
        this.blogs = response.data.blogs;
      })
      .catch((error) => {
        console.log(error);
        return Vue.$toast.error(error.response.data.message);
      });
  },

    created() {
    this.debounceSearch = debounce(this.search, 1000);
  },
  watch: {
    keyword() {
      if (!this.keyword) return;
      this.debounceSearch();
    }
  },

  methods: {
    remove(id, index) {
         this.auth.token = localStorage.getItem("myyin_jwt");
                  if (this.auth.token != null) {
                    this.auth.config = {
                      headers: { Authorization: `Bearer ${this.auth.token}` },
                    };
                  }
      this.$http
        .delete(`/blog/delete/${id}`,this.auth.config)
        .then((response) => {
         this.blogs.splice(index,1);
          return Vue.$toast.success(response.data.message);
        })
        .catch((error) => {
          return Vue.$toast.error(error.response.data.message);
        }); 
    },

      formatDate(value) {
      if (value) {
        return moment(String(value)).format("MM-DD-YYYY");
      }
    },
      search() {
      // eslint-disable-next-line no-console
      console.log(`Checking name: ${this.keyword}`);
      this.$http
        .get("/blogs/get", {
          params: {
            search: this.keyword,
            limit:6
          }
        })
        .then(response => {
          // eslint-disable-next-line no-console
          console.log(response.data.blogs);
          this.blogs = response.data.blogs;
        })
        .catch(err => {
          // eslint-disable-next-line no-console
          console.log(err);
        });
    }

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
.user-info {
  color: white !important;
}
</style>
