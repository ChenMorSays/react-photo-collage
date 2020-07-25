module.exports = {
  mode: "production",
  entry: "./src/index.tsx",
  output: {
    filename: "bundle.js",
    path: __dirname + "/dist"
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader"
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      },
      // Babel loader, will use your project’s .babelrc
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      // Other loaders that are needed for your components
      {
        test: /\.css$/,
        loader: 'postcss-loader!sass-loader!style-loader!css-loader?modules'
      },
      {
              test: /\.(jpg|png|svg)$/,
              use: {
                  loader: 'url-loader',
                  options: {
                      limit: 25000
                  }
              }
          }
    ]
  }
};
