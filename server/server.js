const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5501
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://anthony:Pole13579@cluster1.bvl6p.mongodb.net/shopify2022?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

const inventoryRouter = require("./inventoryRouter");
app.use('/inventory',inventoryRouter);

app.listen(port, ()=>{
    console.log(`lsitening on ${port}`); 
});