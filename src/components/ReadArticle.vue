<template>
  <b-container>
    <div v-show="loading" class="text-center">
      <b-spinner variant="danger" type="grow"></b-spinner>
    </div>

    <b-skeleton-wrapper :loading="loading">
      <template #loading>
        <b-card style="height: 50rem">
          <b-skeleton width="50%" height="50%"></b-skeleton>
          <b-skeleton width="100%"></b-skeleton>
          <b-skeleton width="100%"></b-skeleton>
          <b-skeleton width="100%"></b-skeleton>
          <b-skeleton width="100%"></b-skeleton>
          <b-skeleton width="100%"></b-skeleton>
          <b-skeleton width="100%"></b-skeleton>
          <b-skeleton width="100%"></b-skeleton>
          <b-skeleton width="100%"></b-skeleton>
          <b-skeleton width="100%"></b-skeleton>
          <b-skeleton width="100%"></b-skeleton>
          <b-skeleton width="80%" height="5%"></b-skeleton>
        </b-card>
      </template>
    </b-skeleton-wrapper>

    <b-card class="text-center p-0" style="border: 0" v-if="blog">
      <b-card-img
        v-if="blog.imageURL != null"
        :src="blog.imageURL"
        alt="Image"
        class="rounded-0"
      >
      </b-card-img>
      <b-card-img
        v-else
        style="max-height: 40rem; max-width: 40rem"
        src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg"
        alt="Image"
        class="rounded-0"
      >
      </b-card-img>

      <h2>{{ blog.title }}</h2>

      <b-card-body class="p-0">
        <b-card-text class="text-justify">
          <span v-html="blog.content"></span>
        </b-card-text>

        <b-card-sub-title v-if="blog.author" class="text-left"
          >{{ blog.author.firstName }} {{ blog.author.lastName }}</b-card-sub-title
        >

        <b-card-sub-title class="text-right">{{
          formatDate(blog.createdAt)
        }}</b-card-sub-title>

        <b-card-footer class="p-0">
          <b-icon
            aria-hidden="true"
            @click="like"
            :class="likeBtn"
            icon="hand-thumbs-up"
          ></b-icon>
          {{ likeCount }}
          <b-card-text
            :class="commentVisible ? null : 'collapsed'"
            :aria-expanded="commentVisible ? 'true' : 'false'"
            aria-controls="collapse-4"
            @click="commentVisible = !commentVisible"
          >
            <b-button variant="white">
              Comments on this <b-icon icon="chat-left-text"></b-icon>
            </b-button>
          </b-card-text>
          <b-collapse id="collapse-4" v-model="commentVisible" class="mt-2">
            <b-card class="col-xs-12">
              <form class="text-center border border-primary" @submit.prevent="comment">
                <textarea
                  type="text"
                  id="comment"
                  class="form-control mb-5"
                  placeholder="Comment"
                  v-model="commentValue"
                ></textarea>

                <button class="text-right btn btn-primary" type="submit">
                  Comment <b-icon icon="chat-square-text"></b-icon>
                </button>
              </form>
            </b-card>
            <transition-group
              tag="b-card"
              enter-active-class="animate__animated animate__bounceIn"
              leave-active-class="animate__animated animate__bounceOut"
            >
              <b-card
                v-for="(comment, index) in blogComments"
                :key="index"
                class="mb-1 mt-1"
                border-variant="primary"
              >
                <b-card-sub-title class="text-left mb-2" v-if="comment.user"
                  >{{ comment.user.firstName }}
                  {{ comment.user.lastName }}</b-card-sub-title
                >

                <b-card-text class="text-justify">
                  {{ comment.content }}
                </b-card-text>

                <b-card-sub-title class="text-right mt-2">{{
                  formatDate(comment.createdAt)
                }}</b-card-sub-title>
              </b-card>
            </transition-group>
          </b-collapse>
        </b-card-footer>
      </b-card-body>
    </b-card>
  </b-container>
</template>

<script>
import Vue from "vue";
import moment from "moment";

export default {
  props: ["id"],
  name: "Blog",
  data() {
    return {
      blog: "",
      commentVisible: false,
      commentValue: "",
      blogComments: "",
      likes: "",
      liked: "",
      likeBtn: "",
      likeCount: "",
      loading: true,
    };
  },

  mounted() {
    this.likeCount = this.likes.length;

    //increment blog views

    const userId = localStorage.getItem("myyin_user");
    this.$http
      .put(`/blog/view/${this.id}`, {
        userId: userId,
      })
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      });

    this.$http
      .get(`/blog/get/${this.id}`, {})
      .then((response) => {
        this.loading = false;
        this.blog = response.data.blog;
        this.blogComments = response.data.comments;
        this.likes = response.data.likes;
        this.likeCount = this.likes.length;
        this.likes.every((like) => {
          if (
            like.blog == this.id &&
            like.user._id == localStorage.getItem("myyin_user")
          ) {
            this.liked = true;
            this.likeBtn = "bg-primary";
            return false;
          }
        });
      })
      .catch((error) => {
        console.log(error);
        return Vue.$toast.error(error.response.data.message);
      });
  },

  methods: {
    formatDate(value) {
      if (value) {
        return moment(String(value)).format("MM-DD-YYYY");
      }
    },

    like() {
      //to do
      const userId = localStorage.getItem("myyin_user");
      this.$http
        .put(`/blog/like/${this.id}`, {
          userId: userId,
        })
        .then((response) => {
          this.likes = response.data.likes;
          this.likeCount = this.likes.length;

          if (response.data.liked == true) {
            this.liked = true;
            this.likeBtn = "bg-primary";
          } else {
            this.liked = false;
            this.likeBtn = "";
          }
        })
        .catch((error) => {
          return Vue.$toast.error(
            `${error.response.data.message}, you need to login first.`
          );
        });
    },

    comment() {
      if (this.commentValue != "") {
        const userId = localStorage.getItem("myyin_user");
        this.$http
          .put(`/blog/comment/${this.id}`, {
            content: this.commentValue,
            userId: userId,
          })
          .then((response) => {
            this.likes = response.data.likes;
            this.blogComments = response.data.comments;
          })
          .catch((error) => {
            return Vue.$toast.error(
              `${error.response.data.message}, you need to login first`
            );
          });
      } else {
        return Vue.$toast.error("Enter some text first");
      }
    },
  },
};
</script>

<style scoped></style>
