const BASE_LINK = 'http://localhost:3001'
const Fuse = require('fuse.js');

module.export = GeneralParameter = (query, result) => {
    let res = result;
    let page = parseInt(query.page);
    let page_size = parseInt(query.page_size);
    if(!page && !page_size) res = res.slice(0, 20);
    if(page && page_size) res = res.slice(page*page_size, page*page_size+page_size);
    if(page && !page_size) res = res.slice(page*20, page*20+20);
    if(!page && page_size) res = res.slice(0, page_size);
    return res;
}

function moteurDeRechercheFuzzy(liste, recherche) {
    const options = {
        keys: ['name'],
        includeScore: true,
        threshold: 0.5
    };

    const fuse = new Fuse(liste, options);
    const resultats = fuse.search(recherche);

    return resultats.map(item => item.item);
}

module.export = CollectionParameter = (query, result) => {
    let res = result;
    let { type, collection, category, search, date, sort } = query;
    if(type) res = res.filter(r => r.type_id === parseInt(type));
    if(collection) res = res.filter(r => r.collection_id === parseInt(collection));
    if(category) res = res.filter(r => r.category_ids.includes(parseInt(category)));
    if(date) res = res.filter(r => new Date(r.date) >= new Date(date));
    if(sort) {
        if(sort.toLowerCase() === "name") res = res.sort((a, b) => a.name.localeCompare(b.name));
        if(sort.toLowerCase() === "date") res = res.sort((a, b) => b.date - a.date);
        if(sort.toLowerCase() === "year") res = res.sort((a, b) => b.year - a.year);
        if(sort.toLowerCase() === "critic") res = res.sort((a, b) => b.critic - a.critic);
    }
    if(search) res = moteurDeRechercheFuzzy(res, search);
    return res;
}