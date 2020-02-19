var path = require('path');
var webpack = require('webpack');
var CompressionPlugin = require('compression-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');


module.exports = {
  entry: ["@babel/polyfill", "./src/index.js"],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true
            },
          },
          parallel: true,
          cache: true,
        })
      ],
    },
    plugins: [
      new OptimizeCssAssetsPlugin({
        cssProcessorOptions: {
          map: {
            inline: false,
            annotation: true,
          },
        },
      }),
        new HtmlWebPackPlugin({
          template: "./public/index.html",
          filename: "./index.html",
        }),
        new CompressionPlugin({
        algorithm: "gzip",
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.8
    }),
    new webpack.EnvironmentPlugin({
      REACT_APP_LOCALHOST: true
    }),
    new CleanWebpackPlugin(),

],
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        },
        {
            test: /\.scss$/,
            use: [
              {
                loader: "style-loader" // creates style nodes from JS strings
              },
              {
                loader: "css-loader" // translates CSS into CommonJS
              },
              {
                loader: "sass-loader" // compiles Sass to CSS
              },
              { loader: 'sass-loader'}
            ]
          },
          {
            test: /\.css$/,
            use: [
                {loader: 'style-loader'},
                {
                    loader: 'css-loader',
                    options: {
                        modules: true,
                        url: false
                    }
                },
                {loader: 'sass-loader'}
            ]
        },
        {
          test: /\.(jpg|png)$/,
          use: {
            loader: 'url-loader',
          },
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader"
            }
          ]
        }
      ]
    },
    mode: 'production',
    resolve: {
      extensions: ['*', '.js']
    },
    output: {
      path: __dirname + '/build',
      publicPath: '/',
      filename: 'index.js'
    },
    devtool: 'source-map',
    devServer: {    
      historyApiFallback: true,
      contentBase: './'
    }
  };