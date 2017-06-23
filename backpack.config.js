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

    /*    config.module.rules.preLoaders =
          [
              {
                test: /\.ts$/,
                enforce: 'pre',
                exclude: 'node_modules',
                loader: 'tslint-loader'
              }
            ];
    */
    return config
  }
}