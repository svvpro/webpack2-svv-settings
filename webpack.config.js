const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const webpack = require('webpack');

var isProd =  process.env.NODE === 'production';

var cssDev = ['style-loader', 'css-loader?importLoaders=1', 'postcss-loader', 'sass-loader'];

var  cssProd = ExtractTextPlugin.extract({
    fallbackLoader: "style-loader",
    loader: ['css-loader?importLoaders=1', 'postcss-loader', 'sass-loader'],
    publicPath: "./"
});

var cssConfig = isProd ? cssProd : cssDev;


const path = require("path");
const glob = require('glob');

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.join(__dirname, "dist"),
        filename: 'bundle.js'
    },
    module:{
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                use: [
                    {
                        loader: 'babel-loader',
                        options: {presets: ['es2015']}
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: cssConfig
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    'file-loader?name=[name].[ext]',
                    'image-webpack-loader?{optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}, mozjpeg: {quality: 65}}'
                ]

            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: 'styles.css',
            disable: !isProd,
            disable: true,
            allChunks: true
        }),
        new HtmlWebpackPlugin({
            title: 'Webpack test',
            filename: 'index.html',
            template: 'src/test.html',
            minify: {
                collapseWhitespace :true,
                removeEmptyAttributes: true
            },
        }),
        new PurifyCSSPlugin({
            paths: glob.sync(path.join(__dirname, 'src/*.html')),
            minimize: true
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
    ],
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 9000,
        hot: !isProd,
        stats: 'errors-only',
        open: true
    }
};