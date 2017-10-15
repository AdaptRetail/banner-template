let mix = require( 'laravel-mix' );

/*
 * Extend Laravel Mix
 */
require( '@adapt-retail/adapt-mix-extender' ).extend( mix );

/**
 * Switch banner data to light mode
 * when we should publish banner to Adapt
 */
if (mix.inProduction()) {
    mix.webpackConfig({
        resolve: {
            alias: {
                '@adapt-retail/banner-data': '@adapt-retail/banner-data/dist/LightAdaptData.js',
            }
        }
    });
}

/*
 * Build script and compile sass
 * Display banner and hot reload
 */
mix.js('src/main.js', 'dist/app.js')
   .sass('src/Style/main.scss', 'dist/app.css')
   .browserSync();
