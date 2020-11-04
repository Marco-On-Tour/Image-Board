new Vue({
    el: "#main",
    data: {
        title: "Funky Chicken",
        desc: "",
        username: "",
        file: null,
    },
    mounted: function () {
        axios.get("/images");
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