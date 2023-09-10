const common = require('./webpack.common.config')
const { merge } = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin')
const path = require('path')
const glob = require('glob')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')

module.exports = merge(common, {
  output: {
    filename: 'js/[name].[contenthash:12].js'
  },
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimize: true,
    minimizer: [
      `...`,
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true }
            }
          ]
        }
      }),
      new ImageMinimizerPlugin({
        minimizer: {
            implementation: ImageMinimizerPlugin.imageminMinify,
            options: {
                plugins: [
                    ['imagemin-mozjpeg', { quality: 40 }],
                    ['imagemin-pngquant', {
                        quality: [0.65, 0.90],
                        speed: 4
                    }],
                    ['imagemin-gifsicle', { interlaced: true }],
                    [
                        'imagemin-svgo',
                        {
                            plugins: [
                                {
                                    name: 'preset-default',
                                    params: {
                                        overrides: {
                                            removeViewBox: false,
                                            addAttributesToSVGElement: {
                                                params: {
                                                    attributes: [
                                                        { xmlns: 'http://www.w3.org/2000/svg' },
                                                    ],
                                                },
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                ],
            },
        }
    }),
    ],
    splitChunks: {
      chunks: 'all',
      maxSize: Infinity,
      minSize: 0,
      cacheGroups: {
        node_modules: {
          test: /[\\/]node_modules[\\/]/,
          name: 'node_modules'
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ MiniCssExtractPlugin.loader, 'css-loader' ]
      },
      {
        test: /\.scss$/,
        use: [ MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader' , 'sass-loader' ]
      },
      {
        test:/\.(png|jpg|svg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024
          }
        },
        generator: {
          filename: './images/[name].[contenthash:12][ext]'
        },
        // use: [
        //   // {
        //   //   loader: 'image-webpack-loader',
        //   //   options: {
        //   //     mozjpeg: {
        //   //       quality: 40
        //   //     },
        //   //     pngquant: {
        //   //       quality: [0.65, 0.90],
        //   //       speed: 4
        //   //     }
        //   //   }
        //   // }
        // ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:12].css'
    }),
    new PurgeCSSPlugin({
      paths: glob.sync(
        `${path.join(__dirname, '../src')}/**/*`,
        { nodir: true }
      )
    })
  ]
})