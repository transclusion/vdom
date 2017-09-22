"use strict";

const path = require("path");

module.exports = {
  devtool: "source-map",
  entry: {
    main: "./src/main.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: /src/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["env"],
              plugins: ["transform-react-jsx"]
            }
          }
        ]
      }
    ]
  }
};
