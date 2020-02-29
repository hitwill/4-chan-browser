const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = function() {
    return {
        mode: 'development',
        entry: ['./src/index.tsx'],
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'bundle.js'
        },
        watch: true,
        watchOptions: {
            aggregateTimeout: 300, // Process all changes which happened in this time into one rebuild
            poll: 1000, // Check for changes every second,
            ignored: /node_modules/
        },
        devtool: 'source-maps',
        devServer: {
            contentBase: path.join(__dirname, 'src'),
            watchContentBase: true,
            hot: true,
            open: true,
            inline: true
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: '4Skin',
                template: path.resolve('./src/index.html')
            }),
            new webpack.HotModuleReplacementPlugin()
        ],
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'awesome-typescript-loader'
                },
                {
                    test: /\.scss$/,
                    use: ['style-loader', 'css-loader', 'sass-loader']
                },
                {
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                },
                {
                    test: /\.(jpg|jpeg|gif|png|svg|webp)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                outputPath: './images',
                                name: '[name].[ext]',
                                esModule: false
                            }
                        }
                    ]
                },
                {
                    test: /\.html$/,
                    use: {
                        loader: 'html-loader'
                    }
                }
            ]
        }
    };
};
