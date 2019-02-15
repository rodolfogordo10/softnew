const express = require('express');

module.exports.getRouter = function (nextApp) {
  const router = express.Router();

  router.get(`/`, (req, res) => {
    return nextApp.render(req, res, '/contacts/list', req.params);
    // return nextApp.render(req, res, '/', req.params);
  });

  return router;
};

