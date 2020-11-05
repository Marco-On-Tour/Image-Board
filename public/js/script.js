const v = new Vue({
    el: "#main",
    data: {
        url: "",
        title: "An image",
        desc: "",
        username: "",
        file: null,
        images: null,
    },
    computed: {
        // a computed getter
        reversedTitle: function () {
            // `this` points to the vm instance
            return this.title.split("").reverse().join("");
        },
    },
    mounted: function () {
        console.log("mounted");
        var self = this;
        axios.get("/images").then((res) => {
            const images = res.data;
            this.images = images;
        });
    },
    methods: {
        canUpload: function () {
            const isComplete =
                this.title.length > 0 &&
                this.desc.length > 0 &&
                this.username.length > 0 &&
                this.file != null;
            return isComplete;
        },
        submit: function () {
            console.log(this.title, this.file);
            var fd = new FormData();
            fd.append("title", this.title);
            fd.append("desc", this.desc);
            fd.append("username", this.username);
            fd.append("file", this.file);
            axios.post("/upload", fd).then((result) => {
                this.images.push(result.data);
            });
        },
        fileSelected: function (e) {
            console.log(e.target.files[0]);
            this.file = e.target.files[0];
        },
    },
});
