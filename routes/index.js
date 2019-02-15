const express = require('express');

module.exports.getRouter = function (nextApp) {
  const router = express.Router();

  router.get(`/`, (req, res) => {
    return nextApp.render(req, res, '/list', req.params);
  });

  return router;
};

