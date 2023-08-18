const express = require("express");
const router = express.Router();
const pool = require("../db");
router.get(`/collections`, async (req, res) => {
    try{
        let query = `SELECT
                         collection.*,
                         COUNT(manga.id) AS nb_mangas,
                         ARRAY(SELECT DISTINCT category_id FROM collection_category WHERE collection_id = collection.id) AS category_ids
                     FROM
                         collection
                             LEFT JOIN manga ON collection.id = manga.collection_id
                     GROUP BY
                         collection.id;`;
        pool.query(query, (error, result) => {
            if (error) throw error;
            let allResult = result.rows.map(row => ({
                ...row,
                type: 'Manga',
                category_ids: row.category_ids || [] // Par défaut, définir une liste vide si aucune catégorie n'est associée
            }));
            let collections = CollectionParameter(req.query, allResult);
            let collectionPage = GeneralParameter(req.query, collections);
            res.send({ data: collectionPage });
        });
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
        let query = `select collection.*, COUNT(manga.id) as nb_mangas, ARRAY(SELECT DISTINCT category_id FROM collection_category WHERE collection_id = collection.id) AS category_ids from collection LEFT JOIN manga ON collection.id = manga.collection_id  where collection.id=$1 GROUP BY collection.id;`;
        pool.query(query, [collectionID], (error, result) => {
            if (error) throw error;
            if(result.rowCount > 0){
                let allResult = result.rows.map(row => ({...row, type: 'Manga'}));
                res.send({data: allResult});
            }else{
                res.status(404).send({error: "Collection does not exist"})
            }
        })
    }catch (error){
        console.log(error);
    }
})

module.exports = router;