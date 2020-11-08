const imageCommentsComponent = Vue.component("image-comments", {
    template: `
        <section class="comment-section">
            <img :src="image.url">
            <h1>Comments</h1>
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
        </section>
    `,
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
            const fd = new FormData();
            fd.append("username", this.username);
            fd.append("comment", this.comment);
            fd.append("imageId", this.image.id);
            axios
                .post(url, {
                    username: this.username,
                    comment: this.comment,
                    imageId: this.image.id,
                })
                .then((response) => {
                    this.comments.push(response);
                });
        },
    },
    mounted: function () {
        const url = `/images/${this.image.id}/comments`;
        axios.get(url).then((response) => {
            this.comments = response.data;
        });
        //
    },
});

const boxedImageComponent = Vue.component("boxed-image", {
    template: ` <div class="image-box">
                    <img :src="image.url" :alt="image.title" :width="width" @click="showModal">
                    <modal ref="modal">
                        <image-comments :image="image"></image-comments>
                    </modal>
                </div>`.trim(),
    props: ["image", "width"],
    methods: {
        log: function () {
            console.log(this.image);
        },
        showModal: function () {
            this.$refs.modal.show();
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
                           <hr style="clear:both; margin:1em">
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
            this.$emit("hidden", this.data);
        },
        show: function () {
            const ele = document.getElementById(this.elementId);
            ele.style.display = "flex";
            this.$emit("shown", this.data);
        },
    },
});

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
    mounted: function () {
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
    },
});
