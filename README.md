

##Transforming Data and Testing Continuously

Los datos que usaremos provienen del Proyecto Gutenberg, contiene libros electrónicos gratuitos.
Proyecto Gutenberg produce paquetes de descarga de catálogo que contienen
archivos de Framework de Descripción de Recursos (RDF).

Para comenzar,creamos dos directorios 

* database
* data

Acceder al directorio data y luego descargamos el paquete que contiene los archivod RFD en ese mismo directorio
luego lo descomprimimos el archivo

$ cd data

$ curl -O http://www.gutenberg.org/cache/epub/feeds/rdf-files.tar.bz2

$ tar -xvjf rdf-files.tar.bz2


Las informaciones mas relevantes son 

• The Gutenberg ID (132)

• The book’s title

• The list of authors (agents)

• The list of subjects

##Behavior-Driven Development with Mocha and Chai

Analizaremos el contenido de RDF con BDD juntos con la biblioteca de Chai

$ cd databases

$ npm init -y

$ npm install --save-dev --save-exact mocha@2.4.5 chai@3.5.0

![mahua](https://github.com/ULL-ESIT-PL-1819/p2-t1-testing-fdsam/blob/master/capturas/Captura.PNG?raw=true)


luego abrimos el fichero package.json y cambiamos la parte de script 

-"test": "mocha"

luego creamos la carpera que se llama test donde hacemos todas la pruebas de BDD

$ mkdir test y luego ejecutamos con $ npm test 

Declaramos la expectativa en el Chai 

creamos un script que se llama parse-rdf-test.js dentro de la carpeta test que contiene 

```javascript
'use strict';
const fs = require('fs');
const expect = require('chai').expect;
const rdf = fs.readFileSync(`${__dirname}/pg132.rdf`);
describe('parseRDF', () => {
it('should be a function', () => {
expect(parseRDF).to.be.a('function');
});
```

A continuación, cargamos el contenido RDF de The Art of War a través de fs.readFileSync 
y copiamos  pg132.rdf en el directorio de prueba.

$ cp ../data/cache/epub/132/pg132.rdf test/


$ npm test no da fallo 

![mahua](https://github.com/ULL-ESIT-PL-1819/p2-t1-testing-fdsam/blob/master/capturas/Captasdura.PNG?raw=true)

Para poder funciona creamos otro dir que se llama /lib y dentor de ese dir
creamos un fichero parse-rdf.js

```javascript
'use strict';
module.exports = rdf => {
};
```
todo lo que hace la biblioteca es asignar una función a module.exports

![mahua](https://github.com/ULL-ESIT-PL-1819/p2-t1-testing-fdsam/blob/master/capturas/Casdaptura.PNG?raw=true)

##Habilitando las Pruebas Continuas con Mocha

EN el fichero test/parse-rdf-test.js

```javascript
it('should parse RDF content', () => {
const book = parseRDF(rdf);
expect(book).to.be.an('object');
});
```
Nos da fallo porque no nos devuelve ningun objeto entonces nos vamos a lib/parse-rdf.js


```javascript
module.exports = rdf => {
const book = {};
return book;
};
```
Para monitorear todo los archivos que termina en .js podemos usar el watch

en le package.json añadimos "test:watch": "mocha --watch --reporter min" en la parte de scripts

$ npm run test:watch 

![mahua](https://github.com/ULL-ESIT-PL-1819/p2-t1-testing-fdsam/blob/master/capturas/Captura4.PNG?raw=true)

en ese momento esta monitoreando los cambios que se produce


## Extraer datos de XML con Cheerio

Para extraer los atributos de datos que deseamos, tendremos que analizar el RDF Archivo (XML)

npm install --save --save-exact cheerio@0.22.0 

para instalar el CHeerio

$ npm run test:watch para ver si los test pasa

 y luego en el fichero test/parse-rdf-test.js añadimos 

```javascript
expect(book).to.have.a.property('title', 'The Art of War');
});
```
Nos da fallo porque nos devuelve el objeto book

luego tenemos que ir al fichero /lib/parse-rdf.js

```javascript
book.title = $('dcterms\\:title').text();
});
```
#coleccionar los valores de un array

En el fichero /test/parse-rdf-test.js

añadimos 

expect(book).to.have.a.property('authors')

.that.is.an('array').with.lengthOf(2)

.and.contains('Sunzi, active 6th century B.C.')

.and.contains('Giles, Lionel');

y en el ficheor /lib/parse-rdf.js

añadimos 

book.subjects = $('[rdf\\:resource$="/LCSH"]')

.parent().find('rdf\\:value')

.toArray().map(elem => $(elem).text());

Primero selecionamos las etiqueta que nos interesa y luego convertimos en seccion Cherrien un array.

![](https://github.com/ULL-ESIT-PL-1819/p2-t1-testing-fdsam/blob/master/capturas/Captura2.PNG?raw=true)

$ node rdf-to-json.js ../data/cache/epub/11/pg11.rdf

usamos este comando 

![](https://github.com/ULL-ESIT-PL-1819/p2-t1-testing-fdsam/blob/master/capturas/Capturaasdasd.PNG?raw=true)

#Procesar archivos de datos en secuencias

Para buscar y abrir cada uno de los archivos RDF en el directorio data / cache / epub

*npm install --save --save-exact node-dir@0.1.16

y creamos un fichero /rdf-to-bulk.js

donde contiene 

```javascript
'use strict';
const dir = require('node-dir');
const parseRDF = require('./lib/parse-rdf.js');
const dirname = process.argv[2];
const options = {
match: /\.rdf$/, // Match file names that in '.rdf'.
exclude: ['pg0.rdf'], // Ignore the template RDF file (ID = 0).
};
```

y eje cutamos $ node rdf-to-bulk.js ../data/cache/epub/ | head

![](https://github.com/ULL-ESIT-PL-1819/p2-t1-testing-fdsam/blob/master/capturas/asdCaasdptuasdra.PNG?raw=true)

#Pruebas de depuración con Chrome DevTools

En la parte de packagen.json 

```javascript
» "test:debug":
» "node --inspect node_modules/mocha/bin/_mocha --watch --no-timeouts"
};
```
y eje cutamos $ npm run test:debug

![](https://github.com/ULL-ESIT-PL-1819/p2-t1-testing-fdsam/blob/master/capturas/Capturssa.PNG?raw=true)






