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
        exclude: /(node_modules)/,
        loader: 'awesome-typescript-loader'
      }
    );

    if (options.env === 'production') {
      config.plugins = [
        ...config.plugins,
        new TypedocWebpackPlugin({
          out: './docs',
          target: 'es6',
          mode: 'file',
          exclude: '**/node_modules/**/*.*',
          experimentalDecorators: true,
          excludeExternals: true,
          includeDeclarations: false,
          ignoreCompilerErrors: true,
          excludePrivate: true
        },['./server'])
      ];
    }
    return config
  }
}