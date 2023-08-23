const express = require("express");
const router = express.Router();
const pool = require("../db");
router.get(`/mangas`, async (req, res) => {
    try{
        let query = 'select manga.*, c.type_id from manga inner join collection c on c.id = manga.collection_id inner join type t on t.id = c.type_id;';
        pool.query(query, (error, result) => {
            if(error) throw error;
            let allResult = result.rows.map(row => ({...row, type: 'Manga'}));
            let mangas = CollectionParameter(req.query, allResult);
            let mangaPage = GeneralParameter(req.query, mangas);
            res.send({nbMangas: mangas.length, data: mangaPage});
        })
    }catch (error){
        console.log(error);
    }
})

router.get(`/mangas/:mangaID`, async (req, res) => {
    const mangaID = parseInt(req.params.mangaID);
    if(isNaN(mangaID)){
        res.status(400).send({error: 'the parameter must be an integer'});
        return;
    }
    try{
        let query = `select * from manga where id=$1`;
        pool.query(query, [mangaID], (error, result) => {
            if (error) throw error;
            if(result.rowCount > 0){
                let allResult = result.rows.map(row => ({...row, type: 'Manga'}));
                res.send({data: allResult});
            }else{
                res.status(404).send({error: "Manga does not exist"})
            }
        })
    }catch (error){
        console.log(error);
    }
})



module.exports = router;