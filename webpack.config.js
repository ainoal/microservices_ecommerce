module.exports = {
    mode: 'development',
    entry: './js/frontend.js', // replace index.js with the path to your main file
    output: {
      filename: 'bundle.js', // the name of the output file
      path: __dirname + '/js', // the path to the directory where the output file should be saved
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    }
  };
