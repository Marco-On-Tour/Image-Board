
Vue.component("image-modal", {
    template: "#image-modal",
    props: ["id"],
    methods: {
      showModal: function () {
        var self = this;
        axios
          .get("/image-modal", { params: { id: this.id } })
          .then(function (response) {
            response.data.data;
          });
      },
    },
  
    mounted: function () {
      this.showModal();
    },
  });
  
  new Vue({
    el: "#main",
    data: {
      url: "",
      title: "",
      desc: "",
      username: "",
      created_at: "",
      images: [],
      file: null,
      clickedImageId: null,
    },
  
    mounted: function () {
      var self = this;
      axios.get("/images").then(function (res) {
        var images = res.data;
        self.images = images;
        console.log(images);
      });
    },
  
    methods: {
      submit: function () {
        console.log(this.title, this.file);
  
        var fd = new FormData();
        fd.append("title", this.title);
        fd.append("desc", this.desc);
        fd.append("username", this.username);
        fd.append("file", this.file);
  
        var self = this;
        axios.post("/upload", fd).then(function (res) {
          self.images.unshift(res.data[0]);
          self.title = "";
          self.desc = "";
          self.username = "";
          self.file = "";
        });
      },
      fileSelected: function (e) {
        console.log(e.target.files[0]);
        this.file = e.target.files[0];
      },
      showModal: function (id) {
        this.clickedImageId = id;
        console.log("imageclicked", this.clickedImageId);
      },
    },
  });