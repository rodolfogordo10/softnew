const envs = require('dotenv').config();
const exportEnvs = {};

Object.keys(envs.parsed).forEach(key => {
  exportEnvs[`process.env.${key}`] = envs.parsed[key];
});

module.exports = {
  presets: ['next/babel'],
  plugins: [
    ['styled-jsx/babel', { optimizeForSpeed: true }],
    ['transform-define', exportEnvs]
  ]
};
