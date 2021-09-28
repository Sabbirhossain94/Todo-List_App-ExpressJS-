const e = require("express");
const express = require("express");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const nodemon = require("nodemon");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/todolistDB",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
const itemsSchema = {
    name: String
};
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your Todolist!"
});
const item2 = new Item({
    name: "Hit the + button to add new item."
});
const item3 = new Item({
    name: "<-- Hit this to delete an item."
});
const defaultItems = [item1, item2, item3]
let day = date.getDate()
app.get("/", function (req, res) {

    Item.find({}, function (err, foundItems) {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("successfully saved to DB.");
                }
            });
            res.redirect("/");
        } 
        else {
            res.render("list", { kindOfDay: day, newTodoItem: foundItems });
        };
    })
});

app.post("/", function (req, res) {
    var itemName = req.body.newItem;
    const item = new Item({
        name: itemName
    });
    item.save();
    res.redirect("/")
})
app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
    Item.findByIdAndRemove(checkedItemId, function (err) {
        if (!err) {
            console.log("successfully deleted checked item.")
            res.redirect("/");
        }
    })
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server started on port 3000 successfully!")
})