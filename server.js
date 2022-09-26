require('dotenv').config()

// Pulls port from .env gives default vaule of 4000
// Pulls MONGODB_URL from .env
const { PORT = 4000, MONGODB_URL } = process.env

///////////////////////
// DEPENDICIES
///////////////////////
// imports express
const express = require('express');
// imports mongoose
const mongoose = require('mongoose');
// Create App Obj
const app = express();
//import middleware
const cors = require("cors");
const morgan = require("morgan")

///////////////////////
// DATABASE CONNECTION
///////////////////////
// Establish Connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser:true,
})
// Connection Events
mongoose.connection
    .on("open", () => console.log("You are connected to mongoose"))
    .on("close", () => console.log("You are disconnected from mongoose"))
    .on("error", (error) => console.log(error));

///////////////////////
// MIDDLEWARES
///////////////////////
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies

///////////////////////
// MODELS
///////////////////////
const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String,
})

const Cheese = mongoose.model("Cheese", CheeseSchema);




///////////////////////
// ROUTES
///////////////////////
// Test Route
app.get("/", (req,res) => {
    res.send("Cheese Connected")
})

// Cheese Index Route
app.get("/cheese", async (req, res) => {
    try{
        //send all cheese
        res.json(await Cheese.find({}));
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
})

// Cheese Create Route
app.post("/cheese", async (req, res) => {
    try{
        //send all cheese
        res.json(await Cheese.create(req.body));
    } catch (error) {
        // send error
        res.status(400).json(error);
    }
})

// Cheese Delete Route
app.delete("/cheese/:id", async (req,res)=> {
    try{
        // send all cheese
        res.json(await Cheese.findByIdAndRemove(req.params.id));
    } catch (error) {
        // send error
        res.status(400).json(error)
    }
})

// Cheese Update Route
app.put("/cheese/:id", async (req, res) => {
    try {
      // send all cheese
      res.json(
        await Cheese.findByIdAndUpdate(req.params.id, req.body, { new: true })
      );
    } catch (error) {
      // send error
      res.status(400).json(error);
    }
  });

///////////////////////
// LISTENER
///////////////////////

app.listen(PORT, () => console.log(`listening on Port ${PORT}`))