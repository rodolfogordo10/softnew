import Document, { Head, Main, NextScript } from 'next/document';

/**
 * @class
 * @description Custom document of pages to include our third-parties and general styles/metas
 */
export default class extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);

    return { ...initialProps };
  }

  render() {
    return (
      <html lang="pt-br">
        <Head>
          <meta charSet="UTF-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta httpEquiv="Content-Language" content="pt-br" />
          <meta name="mobile-web-app-capable" content="yes" />
          <link rel="manifest" href="/static/manifest.json" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="Sistema" />

          <style>{`
            * {
              box-sizing: border-box;
              overflow: initial;
            }

            body {
              margin: 0;
              height: 100%;
              font-family: sans-serif, Helvetica Neue, Helvetica, Arial;
              -webkit-font-smoothing: antialiased;
              touch-action: manipulation;
              background-color: #F2F2F2;
            }

            h1 {
              line-height: 1em;
              font-family: sans-serif;
              letter-spacing: -2px;
              margin-top: 0;
              margin-bottom: 0;
            }

            p {
              color: #555;
              margin: auto;
              line-height: 1.5em;
            }

            input:focus {
              outline: none;
            }

            /* loading progress bar styles */
            #nprogress {
              pointer-events: none;
            }
            #nprogress .bar {
              background: #22BAD9;
              position: fixed;
              z-index: 1031;
              top: 0;
              left: 0;
              width: 100%;
              height: 4px;
            }
            #nprogress .peg {
              display: block;
              position: absolute;
              right: 0px;
              width: 100px;
              height: 100%;
              box-shadow: 0 0 10px #22BAD9, 0 0 5px #22BAD9;
              opacity: 1.0;
              transform: rotate(3deg) translate(0px, -4px);
            }
          `}</style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
