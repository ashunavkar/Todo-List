const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set('view engine', 'ejs');
var items = []
app.use(bodyParser.urlencoded({extended:true}))

app.get("/", function(req, res){
    

    res.render("listCopy.ejs", {kindOfDay:Day, newListItems : items})
})

app.post("/", function(req, res){
    var item = req.body.newItem;
    items.push(item)
    res.redirect("/")
})

app.listen(3000, function(){
    console.log("server is running on http://localhsot:3000")
}
