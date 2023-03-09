const express = require("express");
const router = express.Router();
const pool = require("../db");
const Parameter = require("../Parameter");

//Get all authors
router.get(`/authors`, async (req, res) => {
    try{
        let query = `select * from author`;
        pool.query(query, (error, result) => {
            if (error) throw error;
            let authors = result.rows;
            authors = Parameter(authors, req.query);
            res.send({data: authors});
        })
    }catch(error){
        console.log(error);
    }
})

//Get author by id
router.get(`/authors/:authorID`, async (req, res) => {
    let { authorID } = req.params;
    try{
        let query = `select * from author where id=$1`;
        pool.query(query, [authorID], (error, result) => {
            if (error) throw error;
            res.send({data: result.rows});
        })
    }catch(error){
        console.log(error);
    }
})

//Post author
router.post(`/authors`, async (req, res) => {
    let { name, biography } = req.body;
    try{
        let query = `select * from author where name=$1`;
        pool.query(query, [name], (error, result) => {
            if(error) throw error;
            if(result.rowCount === 0){
                let insert = `insert into author(name, biography) values($1, $2) returning *`;
                if(name.length >= 4){
                    pool.query(insert, [name, biography], (error, result) => {
                        if(error) throw error;
                        res.send({data: result.rows, message: 'Author added successfully.'})
                    })
                }else{
                    res.send({author: 'The name is invalid'});
                }
            }else{
                res.send({error: 'Author already exist'})
            }
        })
    }catch(error){
        console.log(error);
    }
})

router.delete(`/authors/:authorId`, async (req, res) => {
    try{
        let { authorId } = req.params;
        let update = `delete from author where id=$1 returning *`;
        pool.query(update, [authorId], (error, result) => {
            if (error) throw error;
            res.send({data: result.rows, message: "The author has been successfully deleted"})
        })
    }catch(error){
        console.log(error);
    }
})

module.exports = router;