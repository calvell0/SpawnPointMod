const path = require('path');

module.exports = {
  mode: 'development', // or 'production' for minification
  entry: './scripts/main.ts', // your entry TypeScript file
  output: {
    filename: 'main.bundle.js', // the bundled JavaScript file
    path: path.resolve(__dirname, 'build/behavior_packs/SpawnPointMod/scripts'),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  stats: 'verbose',
};