const express = require("express");
const router = express.Router();
const pool = require("../db");


router.get(`/collections`, async (req, res) => {
    try{
        let query = 'select * from collection';
        pool.query(query, (error, result) => {
            if(error) throw error;
            res.send({data: result.rows});
        })
    }catch (error){
        console.log(error);
    }
})

router.get(`/collections/:collectionID`, async (req, res) => {
    const collectionID = parseInt(req.params.collectionID);
    if(isNaN(collectionID)){
        res.status(400).send({error: 'the parameter must be an integer'});
        return;
    }
    try{
        let query = `select * from collection where id=$1`;
        pool.query(query, [collectionID], (error, result) => {
            if (error) throw error;
            if(result.rowCount > 0){
                res.send({data: result.rows});
            }else{
                res.status(404).send({error: "Author does not exist"})
            }
        })
    }catch (error){
        console.log(error);
    }
})

module.exports = router;