const express = require("express");
const bodyParser = require("body-parser")
const app = express();

var items = [] // Declare a global arry

app.use(bodyParser.urlencoded({extended :true}))
app.use(express.static("public"))

app.set('view engine', 'ejs'); // important to use ejs template

app.get("/", (req, res)=>{
    var today = new Date();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    } // to display date

    var day = today.toLocaleDateString("en-US", options); // current date

    res.render("list.ejs", {kindOfDay:day, newListItems : items}) // its a key value pair for the template
})
app.post("/", (req, res)=>{
    var item = req.body.newItem  // value from the user input field
    items.push(item)  // item is pushed into the global arry
    res.redirect("/") // redirect to the home page
})

app.post("/delete", function(req, res){
    // items.splice(1,1)
    items.pop()
    res.redirect("/")
})

app.listen(process.env.PORT || 3000, ()=>{
    console.log("server is runnin on http://localhost:3000")
})