const express = require("express");
const router = express.Router();
const pool = require("../db");
const Parameter = require("../Parameter");

//Get all images
router.get(`/images`, async (req, res) => {
    try{
        let query = 'select * from image;';
        pool.query(query, (err, result) => {
            if(err) throw err;
            res.send({data: result.rows});
        })
    }catch(error){
        console.log(error);
    }
})

//Get image by id
router.get(`/images/:imageId`, async (req, res) => {
    const imageId = parseInt(req.params.imageId);
    if(isNaN(imageId)){
        res.status(400).send({error: 'the parameter must be an integer'});
        return;
    }
    try{
        const query = 'select * from image where id=$1';
        pool.query(query, [imageId], (err, result) => {
            if(err) throw err;
            if(result.rowCount > 0){
                res.send({data: result.rows});
            }else{
                res.status(404).send({error: "Image does not exist"});
            }
        })
    }catch(err){
        console.log(err);
    }
})

//Post image
router.post("/images", async (req, res) => {
    let { name, link, type } = req.body;
    try{
        const query = 'select * from image where name=$1 or link=$2';
        pool.query(query, [name, link], async (err, result) => {
            if(err) throw err;
            if(result.rowCount === 0){
                if(name.length > 0 && link.length > 0){
                    if(type === 'background' || type === 'poster' || type === 'logo'){
                        await pool.query(`insert into image(name, link, type) values($1, $2, $3)`, [name, link, type], (err, result) => {
                            if (err) throw err;
                            res.send({data: result.rows, message:'image added successfully.'});
                        })
                    }else{
                        res.status(400).send({error: 'the type is invalid, only : background, logo or poster can be entered.'});
                    }
                }else{
                    res.status(400).send({error: 'you must enter all the following parameters: name, link and type(background, logo, poster).'});
                }
            }else{
                res.status(400).send({error: 'the image already exists.'});
            }
        })
        
    }catch(error){
        console.log(error)
    }
})

//Delete image
router.delete(`/images/:imageId`, async (req, res) => {
    const imageId = parseInt(req.params.imageId);
    if(isNaN(imageId)){
        res.status(409).send({error: 'the parameter must be an integer'});
        return;
    }
    try{
        let update = `delete from image where id=$1 returning *`;
        pool.query(update, [imageId], async (error, result) => {
            if (error) throw error;
            if(result.rowCount > 0){
                res.send({data: result.rows, message: "The image has been successfully deleted"});
            }else{
                res.status(404).send({error: "Image does not exist"});
            }

        });
    }catch (error){
        console.log(error);
    }
})

//modify image
router.patch(`/images/:imageId`, async (req, res) => {
    const imageId = parseInt(req.params.imageId);
    if(isNaN(imageId)){
        res.status(409).send({error: 'the parameter must be an integer'});
        return;
    }
    let {name, link, type} = req.body;
    try{
        let query = `select * from image where id!=$3 and (name=$1 or link=$2)`;
        pool.query(query, [name, link, imageId], (error, result) => {
            if (error) throw error;
            if(result.rowCount === 0){
                let update = `update image set name=$1, link=$2, type=$3 where id=$4 returning *`;
                pool.query(update, [name, link, type, imageId], (error, result) => {
                    if(error) throw error;
                    res.send({data: result.rows, message: 'the image was modified successfully'});
                })
            }else{
                res.status(400).send({error: 'image already exist'});
            }
        })

    }catch (error){
        console.log(error);
    }
})

module.exports = router;