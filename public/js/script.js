const imageCommentsComponent = Vue.component("image-comments", {
    template: `
        <section class="comment-section" v-if="image">
            <h3>{{image.desc}}</h3>
            <img :src="image.url" class="modal-image">
            <h3>leave a comment</h3>
            <div class="comment-input">
                <div class="form-input">
                    <label for="username">User Name:</label>
                    <input type="text" name="username" v-model="username" />
                </div>
                <div class="form-input">
                    <label for="comment">Your Comment:</label>
                    <textarea cols="60" rows="6" name="comment" v-model="comment"></textarea>
                </div>
                <div class="form-input">
                    <input type="submit" @click="send" name="submit" value="submit" />
                </div>
            </div>

            <div class="comments" v-if="comments">
                <h3>Here's what others had to say</h3>
                <div v-for="comment in comments">
                    <p><em>{{comment.username}}</em> said:<br>{{comment.comment}}</p>
                    <hr>
                </div>
            </div>
        </section>
    `.trim(),
    props: ["image"],
    data: function () {
        return {
            username: "",
            comment: "",
            comments: [],
        };
    },
    methods: {
        send: function () {
            const url = `/comments`;
            const data = {
                username: this.username,
                comment: this.comment,
                imageId: this.image.id,
            };
            axios.post(url, data).then((response) => {
                this.comments.push(response.data);
            });
        },
        loadComments() {
            if (this.image) {
                const url = `/images/${this.image.id}/comments`;
                return axios.get(url).then((response) => {
                    this.comments = response.data;
                });
            } else {
                return Promise.resolve();
            }
        },
    },
});

const boxedImageComponent = Vue.component("boxed-image", {
    template: ` <div class="image-box">
                    <a :href="getHref()">
                        <img :src="image.url" :alt="image.title" :width="width">
                    </a>
                </div>`.trim(),
    props: ["image", "width"],
    methods: {
        log: function () {
            console.log(this.image);
        },
        showModal: function () {
            this.$refs.modal.show();
        },
        getHref() {
            return "#" + this.image.id;
        },
    },
});

const modalComponent = Vue.component("modal", {
    template: `<div>
                   <button class="modal-open" @click="show" v-if="buttonText">
                       {{buttonText}}
                   </button> 
                   <div class="modal" :id="elementId">
                       <div class="modal-content">
                           <button class="modal-close" @click="hide">close</button>
                           <slot></slot>
                       </div>
                   </div>
               </div>`,
    computed: {
        elementId: function () {
            return "modal-" + this._uid;
        },
    },
    props: ["buttonText"],
    methods: {
        log: function () {
            console.log(this.image);
        },
        hide: function () {
            const ele = document.getElementById(this.elementId);
            ele.style.display = "none";
            clearHash();
            this.$emit("hidden", this.data);
        },
        show: function () {
            const ele = document.getElementById(this.elementId);
            ele.style.display = "flex";
            this.$emit("shown", this.data);
        },
    },
});
function clearHash() {
    window.location.hash = "";
}
const v = new Vue({
    el: "#main",
    data: {
        url: "",
        title: "An image",
        desc: "",
        username: "",
        file: null,
        images: null,
        selectedImage: document.location.hash,
        selectedImage: null,
    },

    mounted: function () {
        window.onhashchange = (evnt) => {
            const id = Number(window.location.hash.replace("#", ""));
            if (id) {
                this.imageSelected(id);
            } else {
                this.selectedImage = null;
            }
        };
        axios.get("/images").then((res) => {
            const images = res.data;
            this.images = images;
            if (window.location.hash) {
                const id = Number(window.location.hash.replace("#", ""));
                if (id) {
                    this.imageSelected(id);
                }
            }
        });
    },
    methods: {
        imageSelected: function (imageId) {
            const id = Number(imageId);
            return this.loadSingle(id).then((img) => {
                if (img) {
                    this.selectedImage = img;
                    this.$refs.comments.image = img;
                    this.$refs.comments.loadComments().then(() => {
                        this.$refs.selectedImageModal.show();
                    });
                }
            });
        },
        imageUnselected: function () {
            clearHash();
            this.selectedImage = null;
        },
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
            return axios.post("/upload", fd).then((result) => {
                if (result.data.success) {
                    this.images.push(result.data);
                } else {
                    console.error("image upload failed");
                    console.error(result.data);
                }
            });
        },
        fileSelected: function (e) {
            console.log(e.target.files[0]);
            this.file = e.target.files[0];
        },
        loadMore() {
            // https://medium.com/@vladbezden/how-to-get-min-or-max-of-an-array-in-javascript-1c264ec6e1aa
            const imageIds = this.images.map((img) => img.id);
            const minId = Math.min(...imageIds);
            return axios.get("/images?lastId=" + minId).then((response) => {
                for (let image of response.data) {
                    this.images.push(image);
                }
            });
        },
        loadSingle(id) {
            let image = this.images.find((img) => img.id == id);
            if (image) {
                return Promise.resolve(image);
            } else {
                const lastId = Number(id) + 1;
                return axios
                    .get("/images?lastId=" + lastId)
                    .then((response) => {
                        const image = response.data.find((img) => img.id == id);
                        return image;
                    });
            }
        },
    },
});
