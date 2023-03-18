const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get(`/types`, async (req, res) => {
    try{
        let query = `select t.id, t.name, t.japan_name, t.description, i.link As background_image from type t join image i on t.background_id = i.id;`;
        pool.query(query, (error, result) => {
            if(error) throw error;
            res.send({data: result.rows});
        })
    }catch (error){
        console.log(error);
    }
})

router.get(`/types/:typeID`, async (req, res) => {
    const { typeID } = req.params;
    try {
        let query = `select * from type where id=$1`;
        pool.query(query, [typeID], (error, result) => {
            if(error) throw error;
            if(result.rowCount > 0){
                res.send({data: result.rows});
            }else{
                res.status(404).send({error: "Type does not exist"});
            }

        })
    }catch (error){
        console.log(error);
    }
})

module.exports = router;