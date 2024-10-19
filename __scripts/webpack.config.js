const path = require("path");

module.exports = {
  entry: "./scripts-intermediate.js",
  output: {
    filename: "scripts.js",
    path: path.resolve(__dirname),
    libraryTarget: "umd",
    library: "MyLibrary",
  },
  mode: "production",
  devtool: 'source-map',
  resolve: {
    extensions: [".js", ".ts"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    {
      apply: (compiler) => {
        compiler.hooks.emit.tapAsync(
          "AddRequireJsCdn",
          (compilation, callback) => {
            // Adding dynamic script tag to load RequireJS from CDN
            const requireJsCdnScript = `
              var script = document.createElement('script');
              script.src = 'https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js';
              document.head.appendChild(script);
            `;

            const originalSource = compilation.assets["scripts.js"].source();
            compilation.assets["scripts.js"] = {
              source: () => `${requireJsCdnScript}\n\n${originalSource}`,
              size: () =>
                Buffer.byteLength(`${requireJsCdnScript}\n\n${originalSource}`),
            };
            callback();
          }
        );
      },
    },
  ],
};
