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
    <hr />
    <div class="mt-2 col-sm-6 col-md-6 col-lg-6 col-xs-6">
      <b-input-group size="sm" class="mb-2 text-right">
        <b-input-group-prepend is-text>
          <b-icon icon="search"></b-icon>
          <b-form-input placeholder="search" v-model="keyword" class="ml-1" id="search">
          </b-form-input>
        </b-input-group-prepend>
      </b-input-group>
    </div>

    <b-row class="mt-2" v-if="users">
      <b-col
        v-for="(user, index) in users"
        :key="index"
        class="mb-4 col-sm-4 col-md-4 col-lg-4"
      >
        <b-card
          :header="user.title"
          header-bg-variant="danger"
          header-text-variant="white"
          align="center"
        >
          <b-card-body>
            <b-row>
              <b-col class="mb-2 col-md-4 col-sm-4 col-lg-4">
                <b-card-sub-title class="text-left">
                  name: {{ user.firstName }} {{ user.lastName }}
                </b-card-sub-title>
              </b-col>
              <b-col class="mb-2 col-md-4 col-sm-4 col-lg-4">
                <b-card-sub-title class="text-left">
                  email: {{ user.email }}
                </b-card-sub-title>
              </b-col>
              {{ user.roles.name }}
              <b-col class="mb-2 col-md-4 col-sm-4 col-lg-4">
                <b-card-sub-title class="mb-2 text-right"
                  >joined: {{ formatDate(user.createdAt) }}</b-card-sub-title
                >
              </b-col>
            </b-row>

            <b-row>
              <b-col class="col-md-6 col-sm-6 col-lg-6">
                <router-link :to="{ name: 'editUser', params: { id: user._id } }">
                  <b-button variant="info"
                    >Edit<b-icon icon="b-icon-pencil"></b-icon>
                  </b-button>
                </router-link>
              </b-col>
              <b-col class="col-md-6 col-sm-6 col-lg-6">
                <b-button @click="activate(user._id)" variant="success"
                  >{{ user.active ? "Deactivate" : "Activate" }}
                  <b-icon v-if="!user.active" icon="b-icon-person-check"></b-icon>
                  <b-icon v-if="user.active" icon="b-icon-person-x"></b-icon>
                </b-button>
              </b-col>

              <b-col class="col-md-6 col-sm-6 col-lg-6">
                <b-button @click="remove(user._id, index)" variant="danger"
                  >Remove <b-icon icon="b-icon-trash"></b-icon
                ></b-button>
              </b-col>

              <b-col class="col-md-6 col-sm-6 col-lg-6">
                <b-dropdown id="dropdown-1" text="Assign role" class="m-md-2">
                  <b-icon icon="b-icon-person"></b-icon>
                  <b-form-select
                    @change="assignRole(user._id)"
                    multiple
                    v-model="selectedRoles"
                    :options="roles"
                    class="mb-3"
                    value-field="name"
                    text-field="name"
                    disabled-field="notEnabled"
                  ></b-form-select>
                </b-dropdown>
              </b-col>
            </b-row>
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
      msg: "superAdmin info",
      user: "",
      users: "",
      keyword: "",
      roles: [],
      selectedRoles: [],
      auth: {
        config: "",
        token: "",
      },
    };
  },
  mounted() {
    this.auth.token = localStorage.getItem("myyin_jwt");
    if (this.auth.token != null) {
      this.auth.config = {
        headers: { Authorization: `Bearer ${this.auth.token}` },
      };
    }

    this.getRoles();
    this.getUsers();
  },

  created() {
    this.debounceSearch = debounce(this.search, 1000);
  },
  watch: {
    keyword() {
      if (!this.keyword) return;
      this.debounceSearch();
    },
  },

  methods: {
    assignRole(userId) {
      console.log(this.selectedRoles);
      this.$http
        .put(
          `/user/assign-role/${userId}`,
          {
            roles: this.selectedRoles,
          },
          this.auth.config
        )
        .then((response) => {
          return Vue.$toast.success(response.data.message);
        })
        .catch((error) => {
          return Vue.$toast.error(error.response.data.message);
        });
    },
    getUsers() {
      const userId = localStorage.getItem("myyin_user");
      if (userId) {
        this.$http
          .get(`/user/get/${userId}`, {})
          .then((response) => {
            this.user = response.data.user;
          })
          .catch((error) => {
            return Vue.$toast.error(error.response.data.message);
          });
      } else {
        $router.push({ name: "login" });
      }

      this.$http
        .get("/users/get/", {
          limit: 10,
        })
        .then((response) => {
          this.loading = false;
          this.users = response.data.users;
        })
        .catch((error) => {
          console.log(error);
          return Vue.$toast.error(error.response.data.message);
        });
    },

    getRoles() {
      this.$http
        .get("/roles/get/", this.auth.config)
        .then((response) => {
          console.log(response);
          this.loading = false;
          this.roles = response.data.roles;
        })
        .catch((error) => {
          console.log(error);
          return Vue.$toast.error(error.response.data.message);
        });
    },

    remove(id, index) {
      this.$http
        .delete(`/user/delete/${id}`, this.auth.config)
        .then((response) => {
          console.log(response);
          this.users.splice(index, 1);
          return Vue.$toast.success(response.data.message);
        })
        .catch((error) => {
          return Vue.$toast.success(error.response.data.message);
        });
    },
    activate(id) {
      console.log(this.auth.config);
      this.$http
        .put(
          `/user/activate/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${this.auth.token}`,
            },
          }
        )
        .then((response) => {
          this.getUsers();
          return Vue.$toast.success(response.data.message);
        })
        .catch((error) => {
          return Vue.$toast.success(error.response.data.message);
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
        .get("/users/get", {
          params: {
            search: this.keyword,
            limit: 6,
          },
        })
        .then((response) => {
          // eslint-disable-next-line no-console
          console.log(response.data.users);
          this.users = response.data.users;
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.log(err);
        });
    },
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
