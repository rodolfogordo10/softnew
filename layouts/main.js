import 'core-js';

import { Component } from 'react';
import RenderIf from '../components/renderif';
import { node, object, string } from 'prop-types';
import Mobile from '../services/mobile';
import Nav from '../components/nav';
import Apps from '../components/apps';
import Head from 'next/head';
import Sidenav from '../components/sidenav';
import dynamic from 'next/dynamic';
import Router from 'next/router';
import NProgress from 'nprogress';

const EmptyDiv = () => <div></div>;

const SidenavContentDynamic = dynamic(import('../components/sidenav-content'), {
  ssr: false,
  loading: EmptyDiv
});

const getFirstLetter = fullname => {
  if (!fullname) {
    return '';
  }

  return fullname[0].toUpperCase();
};

class MainLayout extends Component {
  constructor(props) {
    super(props);

    this.setRouterEvents = this.setRouterEvents.bind(this);
    this.onHamburgerButtonClick = this.onHamburgerButtonClick.bind(this);
    this.onAppsButtonClick = this.onAppsButtonClick.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.hideSidenav = this.hideSidenav.bind(this);
  }

  state = {
    isAppsOpen: false,
    isSidenavOpen: false,
    isSearchOpen: false,
    isMobile: true,
    appTitle: 'Sistema',
    editPage: false
  }

  titleByRoute = {
    'contatos' : 'Contatos'
  };

  componentDidMount() {
    const isMobile = Mobile.isMobile();
    const newPage = Router.asPath.split('/')[1];

    this.setState({
      isSidenavOpen: !isMobile,
      isMobile,
      appTitle: this.titleByRoute[newPage] || 'Sistema',
    });

    if (Router.asPath.split('/')[2])
      this.setState({ editPage : true });

    this.setRouterEvents();

    if (/([7-9]|10)_.*mac/i.test(navigator.appVersion) || /samsung/i.test(navigator.appVersion)) {
      document.getElementsByClassName('general-content')[0].style.display = 'block';
    }

    // Event to close the apps list
    document.addEventListener('click', event => {
      if (!this.state.isAppsOpen) {
        return;
      }

      if (!event.target.closest('.apps')) {
        event.stopImmediatePropagation();

        return this.setState({
          isAppsOpen: false
        });
      }
    }, true);
  }

  setRouterEvents() {
    Router.onRouteChangeStart = () => {
      NProgress.start();

      if (this.state.isMobile) {
        this.hideSidenav();
      }
    };

    Router.onRouteChangeComplete = url => {
      NProgress.done();

      // Change app title in the navbar
      const newPage = url !== undefined ? url.split('/')[1] : '...';

      return this.setState({
        appTitle: this.titleByRoute[newPage],
      });
    };

    Router.onRouteChangeError = () => NProgress.done();
  }

  hideSidenav() {
    this.setState({ isSidenavOpen: false });

    window.localStorage.setItem('side-nav-is-open', false);
  }

  onHamburgerButtonClick() {
    const isOpen = !this.state.isSidenavOpen;

    if (this.state.isMobile) {
      this.setState({ isSidenavOpen: isOpen, isAppsOpen: isOpen === true ? false : this.state.isAppsOpen });
    } else {
      this.setState({ isSidenavOpen: isOpen });
    }

    window.localStorage.setItem('side-nav-is-open', isOpen);
  }

  onAppsButtonClick() {
    const isOpen = !this.state.isAppsOpen;
    if (this.state.isMobile) {
      this.setState({
        isAppsOpen: isOpen,
        isSidenavOpen: isOpen === true ? false : this.state.isSidenavOpen,
      });
    } else {
      this.setState({ isAppsOpen: isOpen });
    }
  }

  onSearch(value) {
    this.setState({ isSearchOpen: value });
  }

  render() {
    const { user } = this.props;
    let avatarFirstLetter = '';
    let avatarUrl = '';

    if (user && user.credential) {
      avatarFirstLetter = getFirstLetter(user.credential.username);
      avatarUrl = user.credential.avatarUrl;
    }

    const { appTitle, isMobile, isAppsOpen, isSearchOpen, editPage } = this.state;
    const sidenavContent = <SidenavContentDynamic appTitle={ appTitle } />;

    return (
      <div >
        <Head>
          <title>{ appTitle ? appTitle : 'Sistema' }</title>
        </Head>

        <RenderIf condition={ !isSearchOpen }>
          <Sidenav sidenavContent={ sidenavContent }
            isOpen={ this.state.isSidenavOpen }
            onSetOpen={ this.onHamburgerButtonClick }>
            <div className="general-content">
              <div className="main-content">
                { this.props.children }
              </div>
            </div>
          </Sidenav>
        </RenderIf>

        <Nav appTitle={ appTitle }
          isMobile={ isMobile }
          editPage={ editPage }
          isSearchOpen={ isSearchOpen }
          navbarColor="#6A8C92"
          onAppsButtonClick={ this.onAppsButtonClick }
          isOpen={ this.state.isSidenavOpen }
          onHamburgerButtonClick={ this.onHamburgerButtonClick }
          imageUrl={ avatarUrl }
          avatarFirstLetter={ avatarFirstLetter }
          onSearch={ this.onSearch } />
        {
          isAppsOpen && (
            <Apps products={ this.props.user.products }
              loginUrl={ this.props.user.loginUrl }
              token={ this.props.token } />
          )
        }

        <div id="snackbar"></div>
        <div id="modal" />

        <style jsx global>{`
          .general-content {
            width: 100%;
            display: flex;
            position: relative;
            flex-direction: column;
            overflow: hidden;
            background-color: #f2f2f2;
          }
          .action-buttons {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
          }
          .main-content {
            padding: 20px;
            position: relative;
            width: 70%;
          }
          @media (min-width: 1025px){
            .general-content {
              top: 70px;
            }
            .main-content {
              vertical-align: middle;
              text-align: center;
              width: 100%;
            }
          }

          @media (min-width: 1600px){
            .general-content {
              top: 70px;
            }
            .main-content {
              vertical-align: middle;
              margin: auto;
              text-align: center;
              width: 1200px;
            }
          }

          @media (max-width: 1600px) {
            .general-content {
              padding-left: ${this.state.isSidenavOpen && !this.state.isMobile ? '78px' : '0'};
              padding-right: ${this.state.isSidenavOpen && !this.state.isMobile ? '78px' : '0'};
            }
          }

          @media (min-width: 1024px) and (max-width: 1600px) {
            .general-content {
              padding-left: ${this.state.isSidenavOpen && !this.state.isMobile ? '215px' : '0'};
              padding-right: ${this.state.isSidenavOpen && !this.state.isMobile ? '215px' : '0'};
            }
          }

          @media (max-width: 1024px) {
            .general-content {
              top: 62px;
            }
            .main-content {
              vertical-align: middle;
              width: 62%;
              margin: auto;
              text-align: center;
            }
          }
          @media (max-width: 768px) {
            .general-content {
              top: 62px;
            }
            .main-content {
              vertical-align: middle;
              width: 100%;
              margin: auto;
              padding: 0;
              text-align: center;
            }
          }
          @media (max-width: 600px) {
            .general-content {
              top: 62px;
            }
            .main-content {
              text-align: left;
              width: 100%;
              margin: unset;
            }
          }
          #snackbar {
            position: fixed;
            z-index: 9999;
            bottom: 20px;
            left: 20px;
            right: 20px;
          }
        `}</style>
      </div>
    );
  }
}

MainLayout.propTypes = {
  children: node.isRequired,
  user: object,
  token: string
};

export default MainLayout;
