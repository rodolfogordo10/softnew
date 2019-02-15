require('dotenv').config();

const { PORT, NODE_ENV, IS_DEVELOPMENT } = process.env;

const isDevelopment = IS_DEVELOPMENT === 'true';

const { parse } = require('url');
const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const next = require('next');

const indexRouter = require('./routes/index');

const app = next({ dev: isDevelopment });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = express();

    if (!isDevelopment) {
      server.use(compression());
    }

    server.use(cookieParser());

    const indexRouters = indexRouter.getRouter(app);

    server.use(indexRouters);

    server.get('*', (req, res) => {
      const parsedUrl = parse(req.url, true);
      const { pathname } = parsedUrl;

      if (pathname.endsWith('/')) {
        return app.render(req, res, pathname.slice(0, -1));
      }

      return handle(req, res);
    });

    server.listen(PORT, err => {
      if (err) {
        throw err;
      }

      return console.log(`> Marca Running on http://localhost:${PORT} in ${NODE_ENV}`);
    });
  });
