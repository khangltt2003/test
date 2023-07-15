const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const time = require(__dirname + "/time");
const app = express();
const port = 3000;

app.use(express.static("public"), bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

console.log(time.getDate());
console.log(time.getTime());
console.log(time.getDay());


mongoose.connect('mongodb://0.0.0.0:27017/todosDB', {useNewUrlParser: true});

const toDoSchema = mongoose.Schema({
    todo: String
})

const dailyTodos = mongoose.model("dailyTodos", toDoSchema);
const workToDos = mongoose.model("workTodos", toDoSchema);

// const defaultDailyItems = ["Wash dishes", "Clean room", "Do laundry", "Play games"]; // cannot assign to a new array but can use methods to change 
// const defaultWorkItems = ["Fix PC", "Install Windows", "Fix Bug"];

 app.get("/", (req, res)=>{
    const renderPage = async()=>{
        await dailyTodos.find({},{todo: 1, _id: 0}).then((newItems=>{ //return array of item
            console.log("Data items", newItems);
            res.render("list", {list: "TO DO LIST", time: time.getTime(), newItems: newItems, listName: "TODO"}) //render(file, {: }) and set type to TODO
        }));//get data from dailytodos collection
    }
    renderPage();
})

app.get("/work", (req,res)=>{
    const renderPage = async()=>{
        await workToDos.find({},{todo: 1, _id: 0}).then((newItems)=>{
            console.log("Data items", newItems);
            res.render("list", {list: "WORK LIST", time: time.getTime(), newItems: newItems, listName: "WORK"}) //render(file, {: }) and set type to TODO
        });//get data from worktodos collection
    }
    renderPage();
})

app.post("/", (req,res)=>{
    console.log("Input:", req.body);
    if(req.body.newItem.trim() != ""){
        if(req.body.listName === "WORK"){
            const newTodo = new workToDos({
                todo: req.body.newItem,
            })
            newTodo.save().then(()=>res.redirect("/work"))
        }
        else{
            const newTodo = new dailyTodos({
                todo: req.body.newItem,
            })
            newTodo.save().then(()=>res.redirect("/"));
        }
    }
    else{
        if(req.body.listName === "WORK"){
            res.redirect("/work")
        }
        else{
            res.redirect("/");
        }
    }
})

app.post("/delete", (req, res)=>{
    console.log("checkbox:", req.body);
    const deleteItem = async ()=>{
        if(req.body.hasOwnProperty("TODO")){ //check dailytodo or worktodo
            await dailyTodos.deleteOne({todo: req.body.TODO})
            res.redirect("/");
        }
        else{
            await workToDos.deleteOne({todo: req.body.WORK})
            res.redirect("/work");
        }
    }
    deleteItem();
})

app.get("/about", (req,res)=>{
    res.render("about")
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))