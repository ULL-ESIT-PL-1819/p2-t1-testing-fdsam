var gulp = require('gulp');
var shell = require('gulp-shell');

gulp.task("c5-get-guttenberg", shell.task(
   
    'cd transforming-data-and-testing-continuously-chapter-5/data && ' +
    'curl -O https://www.gutenberg.org/cache/epub/feeds/rdf-files.tar.bz2 &&' +

    'tar -xvjf rdf-files.tar.bz2'
));