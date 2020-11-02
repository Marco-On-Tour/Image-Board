new Vue({
    el: "#main",
    data: {
        greeting: "Hello",
        greetee: "World",
        url: "https://spiced.academy",
        cities: [
            {
                name: "Cologne",
                country: "Germany",
            },
        ],
    },
    created: function () {
        console.log("created");
    },
    mounted: function () {
        console.log("mounted");
        var self = this;
        axios.get("/cities").then(function (res) {
            var cities = res.data.cities;
            console.log(cities);
            self.cities = cities;
        });
    },
    updated: function () {
        console.log("updated");
    },
    methods: {
        clicker: function () {
            console.log("clicked!!");
            this.greetee = "Kitty";
        },
        addCologne: function () {
            this.cities.push({
                name: "Cologne",
                country: "Germany",
            });
        },
    },
});
