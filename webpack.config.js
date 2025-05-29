const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const dotenv = require("dotenv");

// Load biến từ .env
const env = dotenv.config().parsed;

// Chuyển thành object mà DefinePlugin hiểu được:
const envKeys = env ? Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {}) : {};

module.exports = {
  entry: "./src/index.tsx",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader"
        ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
        include: /node_modules/, // xử lý file CSS trong thư viện
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "index.html"
    }),
    new webpack.DefinePlugin(envKeys) // 👈 THÊM DÒNG NÀY
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "dist") // <-- Sửa thành dist
    },
    port: 3000,
    historyApiFallback: true
  }
};
