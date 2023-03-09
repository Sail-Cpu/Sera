const express = require("express");
const router = express.Router();
const pool = require("../db");

//GETTORS

function Parameter(images, type, search, page, pageSize){
    if(type) images = images.filter(image => image.type === type);
    if(search) images = images.filter(image => image.name.includes(search));
    if(!page && pageSize) images = images.slice(0, pageSize);
    if(page && !pageSize) images = images.slice(page * 20, page * 20 + 20);
    if(page && pageSize) images = images.slice(page * pageSize, page * pageSize + pageSize);
    return images;
}

//Get all images
router.get(`/images`, async (req, res) => {
    try{
        let { type, search, page, page_size } = req.query;
        let query = 'select * from image;';
        pool.query(query, (err, result) => {
            if(err) throw err;
            let images = result.rows;
            images = Parameter(images, type, search, parseInt(page), parseInt(page_size));
            res.send({data: images});
        })
    }catch(err){
        console.log(err);
    }
})

//Get image by id
router.get(`/images/:imageId`, async (req, res) => {
    try{
        const imageId = req.params.imageId;
        const query = 'select * from image where id=$1';
        pool.query(query, [imageId], (err, result) => {
            if(err) throw err;
            res.send({data: result.rows});
        })
    }catch(err){
        console.log(err);
    }
})

//Post Image
router.post("/images", async (req, res) => {
    try{
        let { name, link, type } = req.body;
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
                        res.send({error: 'the type is invalid, only : background, logo or poster can be entered.'});
                    }
                }else{
                    res.send({error: 'you must enter all the following parameters: name, link and type(background, logo, poster).'});
                }
            }else{
                res.send({error: 'the image already exists.'});
            }
        })
        
    }catch(error){
        console.log(error)
    }
})

router.delete(`/images/:imageId`, async (req, res) => {
    try{
        let { imageId } = req.params;
        let update = `delete from image where id=$1 returning *`;
        pool.query(update, [imageId], async (error, result) => {
            if (error) throw error;
            res.send({data: result.rows, message: "The image has been successfully deleted"});
        });
    }catch (error){
        console.log(error);
    }
})

module.exports = router;