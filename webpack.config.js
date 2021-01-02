const path = require('path');
const webpack = require('webpack');
const process = require('process');

//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    mode: 'development',
    entry: "./src/script/main.ts",
    output: {
        filename: `bundle.js`,
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
              test: /\.pegjs$/,
              use: [
                { loader: 'pegjs-loader' }
              ]
            },
            {
              test: /\.svg$/,
              use: [
                { loader: 'url-loader' }
              ]
            }
        ]
    },
    plugins: [
        // new BundleAnalyzerPlugin(),
        new HtmlWebpackPlugin(),
        new webpack.DefinePlugin({})
    ]
}
