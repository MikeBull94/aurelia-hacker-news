import * as ExtractTextPlugin from 'extract-text-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as path from 'path';
import * as webpack from 'webpack';

const { AureliaPlugin } = require('aurelia-webpack-plugin');

let srcDir = path.resolve(__dirname, 'src');
let distDir = path.resolve(__dirname, 'dist');
let assetsDir = path.resolve(__dirname, 'assets');

function configure(env: any, args: any): webpack.Configuration {
    let styleLoaders: webpack.Loader[] = [
        'css-loader?sourceMap&importLoaders=1',
        'postcss-loader?sourceMap',
        'resolve-url-loader?sourceMap',
        'sass-loader?sourceMap'
    ];

    let config: webpack.Configuration = {
        entry: {
            app: 'aurelia-bootstrapper'
        },

        output: {
            path: distDir,
            filename: '[name]-[hash].js',
            chunkFilename: '[name]-[chunkhash].js'
        },

        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: 'ts-loader'
                },
                {
                    test: /\.html$/,
                    use: 'html-loader'
                },
                {
                    test: /\.scss$/,
                    use: (args.mode === 'production') ? ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: styleLoaders
                    }) : ['style-loader', ...styleLoaders]
                },
                {
                    test: /\.(png|jpg|gif)$/,
                    use: 'file-loader?name=images/[name]-[hash].[ext]'
                }
            ]
        },

        resolve: {
            extensions: [
                '.js',
                '.ts'
            ],
            modules: [
                'node_modules',
                srcDir
            ]
        },

        plugins: [
            new AureliaPlugin(),
            new HtmlWebpackPlugin({
                template: 'index.ejs',
                favicon: path.resolve(assetsDir, 'favicon.ico')
            })
        ],

        devServer: {
            stats: 'errors-only'
        }
    };

    switch (args.mode) {
        case 'development':
            config.devtool = 'inline-source-map';
            break;

        case 'production':
            config.plugins!.push(new ExtractTextPlugin('[name]-[contenthash].css'));
            break;
    }

    return config;
}

export default configure;
