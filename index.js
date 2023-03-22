const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser');
const images = require('./routers/ImageRouter');
const authors = require('./routers/AuthorRouter');
const type = require('./routers/TypeRouter');
const collection = require('./routers/CollectionRouter');

app.use(cors());
app.use(bodyParser.json());

/* Router */
app.use(images);
app.use(authors);
app.use(type);
app.use(collection);

app.listen(3001, () => {
    console.log("server has started on port 3001");
})