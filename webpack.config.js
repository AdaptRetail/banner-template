var path = require('path')
var webpack = require('webpack')

const ExtractTextPlugin = require("extract-text-webpack-plugin");

// var Base64 = require( './Extensions/Sass/Base64' );
var Base64 = require( '@lassehaslev/sass-asset-inliner' );

const extractSass = new ExtractTextPlugin({
    // filename: "[name].css",
    filename: "style.css",
    // disable: process.env.NODE_ENV === "development"
});

var sassOptions = {
    functions: Base64(),
};

module.exports = {
  entry: path.resolve(process.cwd(), './src/main.js'),
  output: {
    path: path.resolve(process.cwd(), './dist'),
    // path: './dist',
    publicPath: '/dist/',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.scss$/,
        use: extractSass.extract({
            use: [{
                loader: "css-loader"
            }, 
            {
                loader: 'postcss-loader',
                options: {
                    plugins: function() {
                        return [
                            require('autoprefixer')
                        ]
                    }
                }
            },
            {
                loader: "sass-loader",
                options: sassOptions,
            }],
            // use style-loader in development
            fallback: "style-loader"
        })
      },
      {
        test: /\.html$/,
        use: [ {
            loader: 'html-loader',
            options: {
                minimize: true
            }
        }],
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map',
  plugins: [ extractSass ],
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  module.exports.resolve = {
      alias: {
        '@lassehaslev/banner-kickstarter': '@lassehaslev/banner-kickstarter/src/DataLoader/LightAdaptData.js',
      }
  };
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
