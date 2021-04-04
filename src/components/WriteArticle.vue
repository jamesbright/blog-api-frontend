<template>
  <b-container>
    <b-card class="text-center">
      <b-card-text>Start a new Article!</b-card-text>

      <div class="text-center">
        <form class="" @submit.prevent="postBlog">
          <input
            type="file"
            ref="file"
            id="coverImage"
            class="form-control mb-3"
            v-on:change="handleFile"
          />

          <input
            type="text"
            id="text"
            class="form-control mb-3"
            placeholder="Title"
            v-model.trim="title"
            required
          />

          <ckeditor
            :editor="editor"
            v-model.trim="content"
            :config="editorConfig"
            required
          ></ckeditor>
          <center>
            <button-spinner
              :is-loading="isLoading"
              :disabled="isLoading"
              :status="status"
              class="btn btn-primary btn-block w-75 my-4"
              type="submit"
            >
              <span>{{ publish }}</span>
            </button-spinner>
          </center>
        </form>
      </div>
    </b-card>
  </b-container>
</template>

<script>
import Vue from "vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default {
  name: "Blog",

  data() {
    return {
      coverImage: "",
      title: "",
      content: "content...",
      author: "",
      isLoading: false,
      status: "",
      publish: "Publish",
      editor: ClassicEditor,
      editorData: "<p>Your Post Content</p>",
      editorConfig: {},
    };
  },
  /**
  mounted() {
    ClassicEditor.create(document.querySelector("#editor"), {
      plugins: [SimpleUploadAdapter],

      simpleUpload: {
        // The URL that the images are uploaded to.
        uploadUrl: "localhost:5000/api/file/upload",

        // Enable the XMLHttpRequest.withCredentials property.
        withCredentials: true,
      },
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        return Vue.$toast.error(error.response.data.message);
      });
  },
**/
  methods: {
    postBlog() {
      this.isLoading = true;
      this.publish = "Publishing";
      this.author = localStorage.getItem("myyin_user");
      let formData = new FormData();
      formData.append("image", this.coverImage);
      formData.append("author", this.author);
      formData.append("title", this.title);
      formData.append("content", this.content);

      this.$http
        .post("/blog/create/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          this.isLoading = false;
          this.publish = "Published";
          this.status = true; // or success
          setTimeout(() => {
            this.status = "";
          }, 2000);
          Vue.$toast.success(response.data.message);
          this.$router.push({ name: "articles" });
        })
        .catch((error) => {
          this.isLoading = false;
          this.status = false;
          this.publish = "Try again";
          return Vue.$toast.error(error.response.data.message);
        });
    },
    handleFile() {
      this.coverImage = this.$refs.file.files[0];
    },
  },
};
</script>

<style>
.ck-editor__editable {
  min-height: 400px;
}

@media only screen and (max-width: 768px) {
  .ck-editor {
    min-height: 400px;
    max-width: 300px;
  }
}
</style>
