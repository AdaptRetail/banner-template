let mix = require( 'laravel-mix' );

/*
 * Extend Laravel Mix
 */
require( '@adapt-retail/adapt-mix-extender' ).extend( mix );

/*
 * Build script and compile sass
 * Display banner and hot reload
 */
mix.js('src/main.js', 'dist/app.js')
   .sass('src/Style/main.scss', 'dist/app.css')
   .browserSync();
