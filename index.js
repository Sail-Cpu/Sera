const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const bodyParser = require('body-parser');
const images = require('./routers/ImageRouter');

app.use(cors());
app.use(bodyParser.json());

/* Images */
app.use(images);

app.get('/images', async (req, res) => {
    try{
        const query = 'select * from image;';
        pool.query(query, (err, result) => {
            if(err) throw err;
            res.json(result.rows);
        })
    }catch(err){
        console.log(err);
    }
})

app.listen(3001, () => {
    console.log("server has started on port 3001");
})