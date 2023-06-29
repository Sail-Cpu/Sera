const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get(`/categories`, async (req, res) => {
    try{
        let query = `select * from category;`;
        pool.query(query, (error, result) => {
            if(error) throw error;
            res.send({data: result.rows});
        })
    }catch (error){
        console.log(error);
    }
})

router.get(`/categories/:categoriesID`, async (req, res) => {
    const categoriesID = parseInt(req.params.categoriesID);
    try{
        let query = `select * from category where id=$1;`;
        pool.query(query, [categoriesID], (error, result) => {
            if(error) throw error;
            res.send({data: result.rows});
        })
    }catch (error){
        console.log(error);
    }
})

module.exports = router;