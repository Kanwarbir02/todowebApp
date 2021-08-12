//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");


// All About DBs
mongoose.connect('mongodb://localhost:27017/TodoDB', {useNewUrlParser: true, useUnifiedTopology: true});

const itemsSchema = new mongoose.Schema({
  name: String
});

Item = mongoose.model("item", itemsSchema);

const item1= new Item({
  name: "Do Homework"
});

const item2= new Item({
  name: "Buy Grocery"
});

const item3= new Item({
  name: "Sleep"
});

const itemsArr= [item1, item2, item3];

// Item.insertMany(itemsArr, function(err){
//   if(err){
//     console.log(err);
//   }else{
//     console.log("Added Successfully");
//   }
// })
// The Home Page Collection Ends

// The Parameter Collection

const listSchema = new mongoose.Schema({
  name: String,
  listToShow: [itemsSchema]
})

const List = mongoose.model("List", listSchema);
//Database Shit Ends

//Creating App + Formalities
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
////////////////////////////

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];





// Get / Post Requests
app.get("/", function(req, res) {

    const day = date.getDate();

    Item.find({}, function(err, Fitems){
      if(Fitems.length === 0){

        Item.insertMany(itemsArr, function(err){
        if(err){
          console.log(err);
        }else{
          console.log("Added Sexfully");
        }
      });

        res.redirect("/");

      }else{

        res.render("list", {listTitle: day, newListItems: Fitems});
      }
      
    });
    
});



app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const TodoTaskLink= req.body.listButton;


  const itemNew = new Item({
    name : itemName
  });

  if(TodoTaskLink === date.getDate()){
    itemNew.save();

    res.redirect("/");
  }else{
    List.findOne({name: TodoTaskLink}, function(err, FList){
      if(!err){
        FList.listToShow.push(itemNew);
        FList.save();
        res.redirect("/" + TodoTaskLink);
      }else{
        console.log(err);
      }

      
    })
  }

 
});



app.get("/:x", function(req,res){

  const madeupName= req.params.x;

  List.findOne({name: madeupName}, function(err, FList){
    if(!err){
      if(!FList){
        const newListforParameter = new List({
            name: madeupName,
            listToShow: itemsArr
          })

           newListforParameter.save();

           res.redirect("/" + madeupName);
        }
        else{
            res.render("list", {listTitle: madeupName,
                       newListItems: FList.listToShow});
        }
      }

     
  });


  

 
});



app.post("/delete", function(req, res){
  const checkedItem = req.body.Checkbox;
  Item.deleteOne({_id : checkedItem}, function(err){
    if(err){
      console.log(err);
    }else{
      console.log("Deleted Succesfully");
    }
  });
  res.redirect()

})

app.get("/about", function(req, res){
  res.render("about");
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
