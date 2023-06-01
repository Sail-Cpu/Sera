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
            //authors = Parameter(authors, req.query);
            res.send({data: authors});
        })
    }catch(error){
        console.log(error);
    }
})

//Get author by id
router.get(`/authors/:authorID`, async (req, res) => {
    const authorID = parseInt(req.params.authorID);
    if(isNaN(authorID)){
        res.status(409).send({error: 'the parameter must be an integer'});
        return;
    }
    try{
        let query = `select * from author where id=$1`;
        pool.query(query, [authorID], (error, result) => {
            if (error) throw error;
            if(result.rowCount > 0){
                res.send({data: result.rows});
            }else{
                res.status(404).send({error: "Author does not exist"})
            }
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
                        res.send({data: result.rows, message: 'Author added successfully.'});
                    })
                }else{
                    res.status(400).send({error: 'The name is invalid'});
                }
            }else{
                res.status(400).send({error: 'Author already exist'});
            }
        })
    }catch(error){
        console.log(error);
    }
})

//Author delete
router.delete(`/authors/:authorId`, async (req, res) => {
    const authorID = parseInt(req.params.authorID);
    if(isNaN(authorID)){
        res.status(409).send({error: 'the parameter must be an integer'});
        return;
    }
    try{
        let update = `delete from author where id=$1 returning *`;
        pool.query(update, [authorId], (error, result) => {
            if (error) throw error;
            if(result.rowCount > 0){
                res.send({data: result.rows, message: "The author has been successfully deleted"});
            }else{
                res.status(404).send({error:"authors does not exist"});
            }

        })
    }catch(error){
        console.log(error);
    }
})

//modify author
router.patch(`/authors/:authorId`, async (req, res) => {
    const authorID = parseInt(req.params.authorID);
    if(isNaN(authorID)){
        res.status(409).send({error: 'the parameter must be an integer'});
        return;
    }
    let { name, biography } = req.body;
    try{
        let query = `select * from author where id!=$3 and (name=$1 or biography=$2)`;
        pool.query(query, [name, biography, authorId], (error, result) => {
            if (error) throw error;
            if(result.rowCount === 0){
                let update = `update author set name=$1, biography=$2 where id=$3 returning *`;
                pool.query(update, [name, biography, authorId], (error, result) => {
                    if(error) throw error;
                    res.send({data: result.rows, message: 'the author was modified successfully'});
                })
            }else{
                res.status(400).send({error: 'image already exist'});
            }
        })
    }catch(error){
        console.log(error);
    }
})


module.exports = router;