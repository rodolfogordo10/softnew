const express = require('express');

module.exports.getRouter = function (nextApp) {
  const router = express.Router();

  router.get(`/contatos`, (req, res) => {
    return nextApp.render(req, res, '/contacts/list', req.params);
  });

  router.get(`/contatos/:contactId`, (req, res) => {
    return nextApp.render(req, res, '/contacts/edit', req.params);
  });

  return router;
};

