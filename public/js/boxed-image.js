Vue.component("image-comments", {
    template: `
        <section class="comment-section">
            <div class="comment-input">
                <input type="text" name="username" v-model="username" />
                <textarea v-model="comment">
            </div>
            <div class="comments" v-if="comments.length > 0">
                <div class="comment" v-for="comment in comments">
                    <div class="text">
                        {{comment.comment}}
                    </div>
                    <footer>
                        {{comment.username}}
                    </footer>
                </div>
            </div>
        </section>`.trimStart(),
    props: ["image"],
    data: {
        username: "",
        comment: "",
        comments: [],
    },
    methods: {},
});

Vue.component("boxed-image", {
    template: `
                <div class="image-box">
                    <img :src="image.url" :alt="image.title" :width="width" @click="showModal">
                    <modal ref="modal">
                        <h1>AMERICA! FUCK YEA!</h1>
                    </modal>
                </div>
            `,
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
