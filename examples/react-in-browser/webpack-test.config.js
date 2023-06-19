const path = require("path");
const glob = require("glob");

module.exports = {
  entry: glob.sync("spec/**/*Spec.js?(x)"),
  output: {
    filename: "test.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [],
  resolve: {
    modules: [__dirname, "src", "node_modules"],
    extensions: ["*", ".js", ".jsx", ".tsx", ".ts"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: require.resolve("babel-loader"),
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.png|svg|jpg|gif$/,
        use: ["file-loader"],
      }, 
    ],
  },
};
