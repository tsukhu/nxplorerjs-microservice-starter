var TypedocWebpackPlugin = require('typedoc-webpack-plugin');

module.exports = {
  webpack: (config, options, webpack) => {



    config.entry.main = [
      './server/index.ts'
    ]

    config.resolve = {
      extensions: [".ts", ".js", ".json"]
    };

    config.module.rules.push(
      {
        test: /\.ts$/,
        enforce: 'pre',
        exclude: /(node_modules)/,
        loader: 'tslint-loader'
      },
      {
        test: /\.ts$/,
        exclude: /(node_modules)/,
        loader: 'awesome-typescript-loader'
      }
    );

    if (options.env === 'production') {
      config.plugins = [
        ...config.plugins,
        new TypedocWebpackPlugin({
          out: './docs',
          module: 'commonjs',
          target: 'es6',
          exclude: '**/node_modules/**/*.*',
          experimentalDecorators: true,
          excludeExternals: true
        },['./server'])
      ];
    }
    return config
  }
}