const express = require("express");
const date= require (__dirname + "/date.js");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
var items = [];
app.set('view engine', 'ejs');

app.get("/", function (req, res) {
    let day= date.getDate();
    res.render("list", { kindOfDay: day, newTodoItem: items });
});
app.post("/", function (req, res) {
    var item = req.body.newItem;
    items.push(item)
    res.redirect("/")
})

app.listen(process.env.PORT || 3000, function () {
    console.log("Server started on port 3000 successfully!")
})