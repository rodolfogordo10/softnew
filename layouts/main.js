import 'core-js';

import { Component } from 'react';
import { node } from 'prop-types';
import Mobile from '../services/mobile';
import Head from 'next/head';
import Router from 'next/router';
import NProgress from 'nprogress';

class MainLayout extends Component {
  constructor(props) {
    super(props);

    this.setRouterEvents = this.setRouterEvents.bind(this);
  }

  state = {
    isMobile: true,
    appTitle: 'Sistema'
  }

  componentDidMount() {
    const isMobile = Mobile.isMobile();

    this.setState({
      isMobile,
    });

    if (Router.asPath.split('/')[2])
      this.setState({ editPage : true });

    this.setRouterEvents();

    if (/([7-9]|10)_.*mac/i.test(navigator.appVersion) || /samsung/i.test(navigator.appVersion)) {
      document.getElementsByClassName('general-content')[0].style.display = 'block';
    }
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

  render() {
    const { appTitle } = this.state;

    return (
      <div >
        <Head>
          <title>{ appTitle ? appTitle : 'Sistema' }</title>
        </Head>

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
  children: node.isRequired
};

export default MainLayout;
