import { Component, Fragment } from 'react';
import { bool, arrayOf, shape, string } from 'prop-types';

import { logout } from '../services/auth';
import { clearStorage } from '../utils/auth';

const isLogout = module => module === 'logout';

// Constants
const APPS = [
  {
    image: 'email',
    name: 'Email',
    color: '#5983B7',
    module: 'webmailApp'
  },
  {
    image: 'marca',
    name: 'Marca',
    color: '#44A5AE',
    module: 'mercadosApp'
  },
  {
    image: 'admin',
    name: 'Admin',
    color: '#888A8B',
    module: 'adminApp'
  },
  {
    image: 'universo',
    name: 'Universo',
    color: '#82A893',
    module: 'universosApp'
  },
  {
    image: 'sistema',
    name: 'Sistema',
    color: '#6A8C92',
    module: 'systemApp',
    current: true
  },
  {
    image: 'site',
    name: 'Site',
    color: '#ACA483',
    module: 'siteApp'
  },
  {
    image: 'logout',
    name: 'Sair',
    color: '#BC6A6A',
    module: 'logout',
    always: true
  }
];

function redirectToApp(products, app, token) {
  const product = products.find(p => p.appModule === app);
  let { url, hasContract } = product;

  if (token) {
    url += `?token=${token}`;
  }

  if (!hasContract) {
    return window.open(url);
  }

  window.location = url;
}

async function logoutAction(loginUrl) {
  await logout();

  clearStorage();

  window.location = `${loginUrl}?callbackurl=${window.location.href}`;

  return;
}

class Apps extends Component {
  constructor(props) {
    super(props);

    this.renderApps = this.renderApps.bind(this);
  }

  renderApps() {
    const appsPerLine = 4;
    const appsList = [[]];
    let lineIndex = 0;

    APPS.forEach(app => {
      if (appsList[lineIndex].length === appsPerLine) {
        appsList.push([]);
        lineIndex++;
      }

      const module = this.props.products.find(p => p.appModule === app.module);

      if (!app.always && !module) {
        return;
      }

      function clickHandler(module) {
        if (isLogout(module)) {
          return logoutAction(this.props.loginUrl);
        }

        redirectToApp(this.props.products, module, this.props.token);
      }

      appsList[lineIndex].push(
        <div onClick={ () => !app.current && clickHandler.call(this, app.module) }
          className={ `app${app.current ? ' disabled' : ''}` }>
          <img width="50" height="50" src={ `/static/icons/${app.image}.png` } />
          <span className="app-title" style={{ color: app.color }}>{ app.name }</span>
        </div>
      );
    });

    if (appsList[lineIndex].length < appsPerLine) {
      for (let index = appsList[lineIndex].length; index < appsPerLine; index++) {
        appsList[lineIndex].push(<div className="app"></div>);
      }
    }

    return appsList.map((app, index) => (
      <div className="apps" key={ `apps_${index}` }>
        {
          app.map((a, i) => (
            <Fragment key={ `app_${i}` }>
              { a }
            </Fragment>
          ))
        }
      </div>
    ));
  }

  render() {
    return (
      <div className="app-launcher">
        { this.renderApps() }

        <style jsx global>{`
          .app-launcher {
            background: #fff;
            color: #000;
            padding: 5px;
            position: fixed;
            right: 24px;
            top: 64px;
            transition: all 0.1s ease-in-out;
            width: 330px;
            min-height: 50px;
            box-shadow: 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12);
            z-index: 10;
          }
          .app-launcher::before {
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-bottom: 8px solid #fff;
            content: "";
            height: 0;
            position: absolute;
            right: 52px;
            top: -8px;
            width: 0;
          }
          .apps {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            flex-wrap: wrap;
          }
          .apps::after {
            content: "";
            flex: 1;
          }
          .app {
            min-width: 80px;
            min-height: 36px;
            margin: 6px 0;
            padding: 10px 0;
            user-select: none;
            cursor: pointer;
            text-align: center;
          }
          .app-title {
            display: block;
            font-size: 12px;
            font-weight: normal;
            text-transform: none;
            font-weight: bold;
            padding-top: 5px;
          }
          .loader-button {
            border: 2.5px solid transparent;
            border-radius: 50%;
            border-top: 2.5px solid #1e88e5;
            width: 40px;
            height: 40px;
            animation: spin .8s linear infinite;
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            margin: auto;
          }
          .disabled {
            cursor: default;
            opacity: .3;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @media screen and (max-width: 767px) {
            .app-launcher {
              left: 0;
              right: 0;
              width: auto;
            }
            .app-launcher::before {
              right: 24px;
            }
            .apps {
              flex-wrap: nowrap;
              justify-content: space-between;
            }
            .apps::after {
              display: none;
            }
            .app {
              margin: 6px 0;
              min-width: auto;
              flex: 1;
            }
          }
        `}</style>
      </div>
    );
  }
}

Apps.propTypes = {
  products: arrayOf(shape({
    id: string,
    url: string.isRequired,
    name: string,
    appModule: string.isRequired,
    hasContract: bool.isRequired
  })).isRequired,
  loginUrl: string.isRequired,
  token: string
};

export default Apps;
