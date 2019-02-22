'use strict';
const cheerio = require('cheerio');

module.exports = rdf => {
    
    const $ = cheerio.load(rdf);
    
    const book = {};
    book.title = $('dcterms\\:title').text();
    
    book.id = +$('pgterms\\:ebook').attr('rdf:about').replace('ebooks/', '');
    
    book.authors = $('pgterms\\:agent pgterms\\:name')
.toArray().map(elem => $(elem).text());

    book.subjects = $('[rdf\\:resource$="/LCSH"]')
.parent().find('rdf\\:value')
.toArray().map(elem => $(elem).text());

    //encontrar source que termina en LCC
    // atraviesa hasta el rdf principal: descripción, luego lee
    
    book.lcc = $('[rdf\\:resource$="/LCC"]')
        .parent().find('rdf\\:value')
.toArray().map(elem => $(elem).text())[0];


book.sources =  $("pgterms\\:file").toArray().map((elem) => {
        let value = {};
        value.link = $(elem).attr("rdf:about");
        value.type = $(elem).find("rdf\\:Description").find("rdf\\:value").text();
        return value;
    });

 book.authors = $('pgterms\\:agent').toArray().map((elem) => { 
        let value = {};
        value.name = $(elem).find("pgterms\\:name").text();
        value.webpage = $(elem).find("pgterms\\:webpage").toArray().map((elem) =>{
            let value = $(elem).attr("rdf:resource");
            return value;
        });
        return value;
    });
 
return book;
};


