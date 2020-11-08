Vue.component('lightbox-component', {
    props: ["id"],
    data: function() {
        return {
            heading: 'Your wonderful image',
            title: "",
            url: "",
            desc: "",
        };
    },
    mounted: function() {
            var self = this;
            console.log(this.id);
            axios.get("/images/" + this.id).then(res => {
                self.title = res.data.title;
                self.url = res.data.url;
                self.desc = res.data.description;
                console.log(res.data.title);
            });
    },
    template: '#lightbox-template',
});


new Vue({
    el: "#main",
    data: {
        greeting: "give us what you got!",
        name: "",
        title: "",
        desc: "",
        username: "",
        filename: "",
        url: "",
        file: null,
        images: null,
        clickedImageId: null,
    },
    created: function () {
        console.log("created");
    },
    mounted: function () {
        console.log("mounted");
        var self = this;
        axios.get("/images").then(res => {
            var images = res.data.rows;
            console.log("images", images);
            self.images = images;
        });
        
    },
    updated: function () {
        console.log("updated");
    },
    methods: {
        submit: function () {
            console.log(this.title, this.file);
            var self = this;
            var fd = new FormData();
            fd.append("title", this.title);
            fd.append("desc", this.desc);
            fd.append("username", this.username);
            fd.append("file", this.file);
            axios.post("/upload", fd).then(res => {
                var newImage = res.data.rows[0];
                console.log("New Image", newImage);
                self.images.unshift(newImage);
                        // 'result' should be the json object we are returning from the server
                        
                    
                
            });
        },
        selectedFile: function (e) {
            console.log(e.target.files[0]);
            this.file = e.target.files[0];
        },
        getImages() {
            var self = this;
            axios.get("/images").then(res => {
                var images = res.data.rows;
                console.log(images);
                self.images = images;
            });
        }
    },
});