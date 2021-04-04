<template>
  <b-container>
    <div v-show="loading" class="text-center">
      <b-spinner variant="danger" type="grow"></b-spinner>
    </div>
    <b-row>
      <b-col class="col-sm-6 col-md-6 col-lg-6 col-xs-6">
        <b-input-group size="sm" class="mb-2 text-right">
          <b-input-group-prepend is-text>
            <b-icon icon="search"></b-icon>
            <b-form-input placeholder="search" v-model="keyword" class="ml-1" id="search">
            </b-form-input>
          </b-input-group-prepend>
        </b-input-group>
      </b-col>

      <b-col class="col-sm-6 col-md-6 col-lg-6 col-xs-6">
        <router-link class="" to="/write-article"
          ><b-button variant="white"
            ><b-icon icon="pencil-square" aria-hidden="true"></b-icon>New</b-button
          ></router-link
        >
      </b-col>
    </b-row>

    <b-skeleton-wrapper :loading="loading">
      <template #loading>
        <b-row>
          <b-col class="mb-4 col-sm-4 col-md-4 col-lg-4">
            <b-card style="height: 23rem">
              <b-skeleton width="85%" height="70%"></b-skeleton>
              <b-skeleton width="100%"></b-skeleton>
              <b-skeleton width="100%"></b-skeleton>
              <b-skeleton width="100%"></b-skeleton>
              <b-skeleton width="85%" height="10%"></b-skeleton>
            </b-card>
          </b-col>
          <b-col class="mb-4 col-sm-4 col-md-4 col-lg-4">
            <b-card style="height: 23rem">
              <b-skeleton width="85%" height="70%"></b-skeleton>
              <b-skeleton width="100%"></b-skeleton>
              <b-skeleton width="100%"></b-skeleton>
              <b-skeleton width="100%"></b-skeleton>
              <b-skeleton width="85%" height="10%"></b-skeleton>
            </b-card>
          </b-col>
          <b-col class="mb-4 col-sm-4 col-md-4 col-lg-4">
            <b-card style="height: 23rem">
              <b-skeleton width="85%" height="70%"></b-skeleton>
              <b-skeleton width="100%"></b-skeleton>
              <b-skeleton width="100%"></b-skeleton>
              <b-skeleton width="100%"></b-skeleton>
              <b-skeleton width="85%" height="10%"></b-skeleton>
            </b-card>
          </b-col>
          <b-col class="mb-4 col-sm-4 col-md-4 col-lg-4">
            <b-card style="height: 23rem">
              <b-skeleton width="85%" height="70%"></b-skeleton>
              <b-skeleton width="100%"></b-skeleton>
              <b-skeleton width="100%"></b-skeleton>
              <b-skeleton width="100%"></b-skeleton>
              <b-skeleton width="85%" height="10%"></b-skeleton>
            </b-card>
          </b-col>
          <b-col class="mb-4 col-sm-4 col-md-4 col-lg-4">
            <b-card style="height: 23rem">
              <b-skeleton width="85%" height="70%"></b-skeleton>
              <b-skeleton width="100%"></b-skeleton>
              <b-skeleton width="100%"></b-skeleton>
              <b-skeleton width="100%"></b-skeleton>
              <b-skeleton width="85%" height="10%"></b-skeleton>
            </b-card>
          </b-col>
          <b-col class="mb-4 col-sm-4 col-md-4 col-lg-4">
            <b-card style="height: 23rem">
              <b-skeleton width="85%" height="70%"></b-skeleton>
              <b-skeleton width="100%"></b-skeleton>
              <b-skeleton width="100%"></b-skeleton>
              <b-skeleton width="100%"></b-skeleton>
              <b-skeleton width="85%" height="10%"></b-skeleton>
            </b-card>
          </b-col>
          <b-col class="mb-4 col-sm-4 col-md-4 col-lg-4">
            <b-card style="height: 23rem">
              <b-skeleton width="85%" height="70%"></b-skeleton>
              <b-skeleton width="100%"></b-skeleton>
              <b-skeleton width="100%"></b-skeleton>
              <b-skeleton width="100%"></b-skeleton>
              <b-skeleton width="85%" height="10%"></b-skeleton>
            </b-card>
          </b-col>
          <b-col class="mb-4 col-sm-4 col-md-4 col-lg-4">
            <b-card style="height: 23rem">
              <b-skeleton width="85%" height="70%"></b-skeleton>
              <b-skeleton width="100%"></b-skeleton>
              <b-skeleton width="100%"></b-skeleton>
              <b-skeleton width="100%"></b-skeleton>
              <b-skeleton width="85%" height="10%"></b-skeleton>
            </b-card>
          </b-col>
          <b-col class="mb-4 col-sm-4 col-md-4 col-lg-4">
            <b-card style="height: 23rem">
              <b-skeleton width="85%" height="70%"></b-skeleton>
              <b-skeleton width="100%"></b-skeleton>
              <b-skeleton width="100%"></b-skeleton>
              <b-skeleton width="100%"></b-skeleton>
              <b-skeleton width="85%" height="10%"></b-skeleton>
            </b-card>
          </b-col>
        </b-row>
      </template>
    </b-skeleton-wrapper>

    <b-row v-if="blogs">
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
            <b-card-text class="text-justify">
              <span :inner-html.prop="blog.content | truncate(blog.content)"></span>
            </b-card-text>

            <router-link :to="{ name: 'readArticle', params: { id: blog._id } }">
              <b-button variant="primary"
                >View <b-icon icon="b-icon-eye-fill"></b-icon
              ></b-button>
            </router-link>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
    <div class="text-center">
      <b-button @click="prevPage()" :disabled="!hasPrev" variant="secondary"
        ><b-icon icon="chevron-compact-left"></b-icon
      ></b-button>

      <b-button @click="nextPage()" :disabled="!hasNext" variant="secondary"
        ><b-icon icon="chevron-compact-right"></b-icon
      ></b-button>
    </div>
  </b-container>
</template>

<script>
import Vue from "vue";
import moment from "moment";
import { debounce } from "lodash";

export default {
  name: "Blog",
  data() {
    return {
      blogs: "",
      hasNext: "",
      hasPrev: "",
      loading: true,
      keyword: "",
      limit: 6,
      page: 1,
    };
  },

  mounted() {
    this.getBlogs();
  },

  created() {
    this.debounceSearch = debounce(this.getBlogs, 1000);
  },
  watch: {
    keyword() {
      if (!this.keyword) return;
      this.debounceSearch();
    },
  },

  filters: {
    truncate(value) {
      if (value && value.length > 300) {
        value = value.substring(0, 300) + "...";
      }
      return value;
    },
  },
  methods: {
    nextPage() {
      if (this.hasNext) {
        this.page = this.page + 1;
        this.getBlogs();
      }
    },

    prevPage() {
      if (this.hasPrev) {
        this.page = this.page - 1;
        this.getBlogs();
      }
    },
    getBlogs() {
      this.$http
        .get("/blogs/get/", {
          params: {
            search: this.keyword,
            limit: this.limit,
            page: this.page,
          },
        })
        .then((response) => {
          this.loading = false;
          this.blogs = response.data.blogs;
          this.hasNext = response.data.pagination.hasNext;
          this.hasPrev = response.data.pagination.hasPrev;
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
  },
};
</script>

<style scoped></style>
