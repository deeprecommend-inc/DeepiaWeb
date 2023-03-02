/** @type {import('next').NextConfig} */
const TerserPlugin = require("terser-webpack-plugin");
const isProd = process.env.NODE_ENV === "production";

module.exports = {
  reactStrictMode: true,
  // experimental: {
  //   outputStandalone: true,
  // },
  webpack: (config, options) => {
    config.optimization.minimize = isProd;
    config.optimization.minimizer = [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: isProd,
          },
        },
        extractComments: "all",
      }),
    ];
    return config;
  },
  i18n: {
    locales: ["en", "ja"],
    defaultLocale: "en",
  },
};
