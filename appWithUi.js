const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config()
const app = express();
const Mongo = require('mongodb');
const MongoClient = Mongo.MongoClient;
const bodyParser = require('body-parser');
const port = process.env.PORT || 7000;
const LocalDB = process.env.LocalDB;
const swaggerUI = require('swagger-ui-express');
const package = require('./package.json');
const swaggerDocument = require('./swagger.json');

swaggerDocument.info.version = package.version;
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocument));


let db;
let col_name = "restapiUi"

// middleware
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
app.use(cors());

// Static File Path
app.use(express.static(__dirname+'/public'))

// html file path
app.set('views','./src/views');

// view engine
app.set('view engine', 'ejs');

app.get('/',(req,res) => {
    db.collection(col_name).find({}).toArray((err,result) => {
        if(err) throw err;
        res.status(200).render('index',{data:result})
    })
});

// Get Inventory list
app.get('/inventories',(req,res) => {
    db.collection(col_name).find({}).toArray((err,result) => {
        if(err) throw err;
        res.status(200).send(result);
    });
});

// Add Inventory
app.post('/addInventory',(req,res)=>{
    const data = {
        "name": req.body.name,
        "description": req.body.description,
        "price": req.body.price,
    }
    db.collection(col_name).insertOne(data,(err,result)=>{
        if (err) throw err;
        res.redirect('/')
    })
})

app.get('/new',(req,res)=>{
    res.render('Add')
})

// update Inventory
app.put('/updateInventory',(req,res)=>{
    db.collection(col_name).updateOne({_id:Mongo.ObjectId(req.body._id)},
    {
    $set:{
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
    }
},(err,result)=>{
    if(err) throw err;
    res.send("Res Updated");
}
    )
})

// Delete Inventory
app.delete('/deleteInventory',(req,res)=>{
    db.collection(col_name).deleteOne({_id:Mongo.ObjectId(req.body._id)},(err,result)=>{
        if(err) throw err;
        res.send("Res Deleted")
    })
})

// get particular Inventories based on Id
app.get('/inventories/:id',(req,res)=>{
    var id = Mongo.ObjectId(req.params.id)
    db.collection(col_name).find({_id:id}).toArray((err,result) => {
    if (err) throw err;
    res.send(result);
    })
})

// DB connection
MongoClient.connect(LocalDB,(err,client)=>{
    if(err) throw err;
    db = client.db('first');
    app.listen(port,(err)=>{
        console.log(`Server is running on port ${port}`);
    })
})
