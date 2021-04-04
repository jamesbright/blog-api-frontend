<template>
  <b-container>
    <b-card class="text-center ">
      <b-card-text>Start a new Article!</b-card-text>
     
        <div class=" text-center">
          <form class="" @submit.prevent="updateBlog">
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
            required />

            <ckeditor
              :editor="editor"
              v-model.trim="content"
              :config="editorConfig"
            required></ckeditor>
            <center>
              <button-spinner
                :is-loading="isLoading"
                :disabled="isLoading"
                :status="status"
                class="btn btn-primary btn-block w-75 my-4"
                type="submit"
              >
                <span>{{publish}}</span>
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
  props:["id"],

  data() {
    return {
      coverImage: "",
      title: "",
      content: "content...",
      author: "",
      isLoading: false,
      status: "",
      publish:"Update",
      blog:"",
      auth: {
        token: "",
      },
      editor: ClassicEditor,
      editorData: "<p>Your Post Content</p>",
      editorConfig: {},

    };
  },

  mounted(){
      this.$http.get(`/blog/get/${this.id}`,{}).
      then((response) =>{
          console.log(response);
          this.title = response.data.blog.title;
          this.content= response.data.blog.content;
          this.author = response.data.blog.author._id;

      }).catch((error)=>{
          return Vue.$toast.error(error.response.data.message);

      })
  },

  methods: {
    updateBlog() {
      this.auth.token = localStorage.getItem("myyin_jwt");
              

      this.isLoading = true;
      this.publish = "Updating";
      let formData = new FormData();
      formData.append("image", this.coverImage);
      formData.append("author", this.author);
      formData.append("title", this.title);
      formData.append("content", this.content);

      this.$http
        .put(`/blog/update/${this.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${this.auth.token}`,
          },
        })
        .then((response) => {
          this.isLoading = false;
          this.publish = "Updated";
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
