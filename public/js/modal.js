Vue.component("modal", {
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
    props: ["buttonText", "identifier"],
    methods: {
        log: function () {
            console.log(this.image);
        },
        hide: function () {
            const ele = document.getElementById(this.elementId);
            ele.style.display = "none";
            this.$emit("hidden");
        },
        show: function () {
            const ele = document.getElementById(this.elementId);
            ele.style.display = "flex";
            this.$emit("shown");
        },
    },
});
