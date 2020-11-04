const v = new Vue({
    el: "#main",
    data: {
        url: "",
        title: "",
        desc: "",
        username: "",
        file: null,
        images: [],
    },
    mounted: function () {
        console.log("mounted");
        var self = this;
        axios.get("/images").then((res) => {
            console.log(v.images);
            const images = res.data;
            this.images = images;
            console.log(v.images);
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
            axios.post("/upload", fd);
        },
        fileSelected: function (e) {
            console.log(e.target.files[0]);
            this.file = e.target.files[0];
        },
    },
});
