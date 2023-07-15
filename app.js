const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');
const { send } = require('process');
const time = require(__dirname + "/time");
const app = express();
const port = 3000;

app.use(express.static("public"), bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

console.log(time.getDate());
console.log(time.getTime());
console.log(time.getDay());


mongoose.connect('mongodb+srv://test123:test123@cluster0.c5buque.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true});

const itemSchema = mongoose.Schema({
    todo: String
})

const todoListSchema = mongoose.Schema({
    listName: String,
    items: [itemSchema]
})

const Item = mongoose.model('itemList', itemSchema);
const todoList = mongoose.model('todoList', todoListSchema);

 app.get("/", (req, res)=>{
    res.redirect("/Home");
})

app.get("/:listName", (req,res)=>{
    const listName = _.capitalize(req.params.listName);
    const renderPage = async()=>{
        //find object that has listName = param route
        await todoList.findOne({listName: listName},{listName: 1, items: 1}).then((todoObject)=>{
            if(todoObject){
                res.render("list", {time: time.getTime(), todoObject: todoObject}) //render(file, {: }) and set type to TODO
            }
            else{//if object not exist, create a todolist object with empty items array and save to db
                const list = new todoList({
                    listName: listName,
                    items: []
                })
                list.save().then(()=>res.redirect("/" + listName));
            }
        });
    }
    renderPage();
})

app.post("/", (req,res)=>{  
    if(req.body.newItem.trim() != ""){
        const listName = req.body.listName;
        const newItem = new Item({
            todo: req.body.newItem
        })
        const addNewItemToList = async()=>{
            //push newItem into items array 
            await todoList.updateOne({listName: listName}, {$push: {items: newItem}});
        }
        addNewItemToList();
        res.redirect("/"+ listName);
    }
    else{
        res.redirect("/"+ req.body.listName);
    }
})

app.post("/delete", (req, res)=>{
    const deleteItem = async()=>{
        //find items array, delete item, and update
        const listName = req.body.listName;
        const checkedItemID = req.body.id;
        //update todolist by removing/pulling element in items array that match checkedItemID
        await todoList.updateOne({listName: listName}, {$pull: {items: {_id: checkedItemID}}});
    }
    deleteItem();
    res.redirect("/"+ req.body.listName);
})

app.get("/about", (req,res)=>{
    res.render("about")
})

app.listen(process.env.PORT || 3000, () => console.log(`Example app listening on port ${port}!`))