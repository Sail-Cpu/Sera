const BASE_LINK = 'http://localhost:3001'

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

module.export = CollectionParameter = (query, result) => {
    let res = result;
    let { name, type, collection } = query;
    if(name) res = res.filter(r => r.name.toLowerCase().includes(name.toLowerCase()));
    if(type) res = res.filter(r => r.type_id === parseInt(type));
    if(collection) res = res.filter(r => r.collection_id === parseInt(collection));
    return res;
}