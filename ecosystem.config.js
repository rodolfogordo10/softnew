/** PM2 execution file */
module.exports = {
  apps: [
    {
      name: 'softnew',
      script: './server.js',
      watch: false,
      env: {
        NODE_ENV: 'master',
        PORT: 8103
      }
    }
  ]
};
