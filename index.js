const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json());


app.listen(3001, () => {
    console.log("server has started on port 3001");
})