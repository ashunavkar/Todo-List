const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _ = require("lodash")

//------------ BASIC MODULES SETUP ---------
const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
app.set('view engine', 'ejs'); // important to use ejs template
//------((END)) BASIC MODULES SETUP ---------

//------------ MONGOOSE DATABASE ------------

mongoose.connect('mongodb+srv://admin-ashu:xdMqDJjBNauM7K4R@cluster0.z7r8u.mongodb.net/todolistDB?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }); 

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected to mongoDB")
});

const itemSchema = {
    name: String,
}
// ---------- DECLERATION OF NEW "Items" COLLECTION 
const Item = mongoose.model("Item", itemSchema)

//------------ THREE BASIC ELEMENTS -------------
const item1 = new Item({
    name: "Welcome to our Todo List"
});
const item2 = new Item({
    name: "Press on + button to add new item"
});
const item3 = new Item({
    name: "Press on delete to delete items"
});

// ------ ARRY OF THREE BASIC ELEMENTS -----------
const defaultItems = [item1, item2, item3];


// ------ CUSTOM LIST SCHEMA ----------
const listSchema = {
    name: String,
    items: [itemSchema]
}
// ------ DECLERATION OF NEW CUSTOM "List" COLLECTION 
const List = mongoose.model("List", listSchema)


// Item.deleteMany({}).then(function(){ 
    //     console.log("Data deleted"); // Success 
// }).catch(function(error){ 
    //     console.log(error); // Failure 
// });


//------------(( END )) MONGOOSE DATABASE ---------------------------------


//-------- /// ROOT GET REQUEST //// ------------------------------------------------
app.get("/", (req, res) => {
    

    Item.find({}, function (err, result) { //---- ROOT COLLECTION IS "Item" FINDING ALL ELEMENT

        if (result.length === 0) {      // ----- CHECK IF "Item" COLLECTION IS EMPT
            Item.insertMany(defaultItems, function (err) { // ----- IF EMPT ADDS THREE BASE ELEMENTS
                if (err) {
                    console.log(err)
                }
                else {
                    console.log("insertMany data saved")
                }
            })
            res.redirect("/")
        }
        else { //-------- ELSE RENDER WITHOUT ADDING ANYTHING 
            res.render("list", { listTitle: "Today", newListItems: result }) // its a key value pair for the template
        }
    })
})


// ---------- /// ROOT POST REQUEST ////-------------------------------------
app.post("/", (req, res) => {
    var itemName = req.body.newItem // value from the user input field
    var listName = req.body.addButton; // value of addButton which is equal to the title

    const item = new Item({ 
        name: itemName
    });
    
    if(listName === "Today"){  // if root list ("today list") insert into it 
        item.save();
        res.redirect("/")
    }
    else { // else search list and insert into it
        List.findOne({name: listName}, function(err, foundList ){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        })
    }
})

// ---------- /// CUSTOME LINK GET REQUEST ////-------------------------------------
app.get("/:customListName", (req, res) => {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName}, function(err, result){
        if(!err){
            if(!result){
                // create new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                })
            
                list.save()
                res.redirect("/" + customListName)
            }
            else {
                // show list
                res.render("list", { listTitle: result.name, newListItems: result.items })
            }
        }
    })
    
})


app.post("/delete", function (req, res) {
    checkboxId = req.body.checkbox;
    listName = req.body.listName;
    console.log(listName)
    const customListName = req.params.customListName;

    if ( listName === "Today"){

        Item.findByIdAndDelete(checkboxId, function (err) {
            console.log(err)
        });
        res.redirect("/")
    }
    else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkboxId}}}, function(err, foundList){
            if(!err){
                res.redirect("/" + listName)
            }
        });
    }
    
})




// ------------------ SERVER LISTENING ---------------------
app.listen(process.env.PORT || 3000, () => {
    console.log("server is runnin on http://localhost:3000")
})