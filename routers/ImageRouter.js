const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/images", async (req, res) => {
    try{
        let { name, link, type } = req.body;
        if(name.length > 1 && link.length > 1  && type.length > 1){
            if(type == 'background' || type == 'poster' || type == 'logo'){
                const insertImage = await pool.query(`insert into image(name, link, type) values($1, $2, $3)`, [name, link, type], (err, result) => {
                    if (err) throw err;
                    res.send({data: result.rows, message:'image ajouté avec succès'});
                })
            }else{
                res.send({error: 'le type de l\'image est invalide'})
            }
            
        }else{
            res.send({error: 'Il manque des parametre pour satisfaire la requete post'})
        }
        
    }catch(error){
        console.log(error)
    }
})

module.exports = router;