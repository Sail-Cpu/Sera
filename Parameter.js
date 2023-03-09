function Parameter(tables, param){
    let { type, search, page, page_size } = param;
    if(type) tables = tables.filter(table => table.type === type);
    if(search) tables = tables.filter(table => table.name.includes(search));
    if(!page && page_size) tables = tables.slice(0, page_size);
    if(page && !page_size) tables = tables.slice(page * 20, page * 20 + 20);
    if(page && page_size) tables = tables.slice(page * page_size, page * page_size + page_size);
    return tables;
}

module.exports = Parameter;