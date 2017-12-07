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

/**
 * Prevent url processing
 * https://laravel.com/docs/5.5/mix#url-processing
 */
mix.options({
    processCssUrls: false
});

/*
 * Build script and compile sass
 * Display banner and hot reload
 */
mix.js('src/Script/main.js', 'dist/ad.js')
   .sass('src/Style/main.scss', 'dist/ad.css')
   .browserSync();
