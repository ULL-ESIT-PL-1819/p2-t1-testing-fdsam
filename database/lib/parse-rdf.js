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
 
return book;
};

