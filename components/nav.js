import Head from 'next/head';
import Router from 'next/router';
import RenderIf from './renderif';
import NavAvatar from '../components/nav-avatar';
import NavClose from '../components/nav-close';

import { Component, createRef } from 'react';
import { func, node, string, bool } from 'prop-types';
import { getContactsSearch } from '../services/contacts';
import * as Token from '../utils/auth';

// Sidenav loaded event name
const SIDENAV_LOADED = 'sidenavLoaded';
const SEARCH_LOADED = 'scroll';

/**
 * @class Nav
 * @description Navbar component
 */
class Nav extends Component {
  constructor(props) {
    super(props);

    this.mySearch = createRef();

    this.updateHamburguerState = this.updateHamburguerState.bind(this);
    this.onSearchButtonClick = this.onSearchButtonClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.clearSearchTextInput = this.clearSearchTextInput.bind(this);
    this.focusSearchTextInput = this.focusSearchTextInput.bind(this);
    this.backSearchTextInput = this.backSearchTextInput.bind(this);

    this.state = {
      showHamburguer: false,
      title: '',
      description: '',
      search: '',
      navbarColor: props.navbarColor,
      isLoading: true,
      resultSearch: [],
      iconTransition: {
        height: 24,
        width: 24,
        alt: 'Menu',
        class: 'icon-hamburger',
        img: '/static/icons/hamburger-white.svg'
      }
    };
  
  }

  /**
   * @function onListItemClick
   * @description Redirects the user to the contact form
   * @param  {Object} contact contact to redirect to
   */
  onListItemClick(contact) {
    const { _id } = contact;
    const href = {
      pathname: `/contacts`,
      query: {
        contactId: _id
      }
    };

    return Router.push(href, `/contatos/${_id}`);
  }

  componentDidMount() {
    this.setState({ isLoading: false });

    document.addEventListener(SEARCH_LOADED, this.handleScroll);

    // Listen to the sidenav loaded event
    document.addEventListener(SIDENAV_LOADED, this.updateHamburguerState);
  }

  componentWillUnmount() {

    document.removeEventListener(SEARCH_LOADED, this.handleScroll);
  
    // Remove the sidenav loaded event listener
    document.removeEventListener(SIDENAV_LOADED, this.updateHamburguerState);
  }

  updateHamburguerState() {
    return this.setState({ showHamburguer: true });
  }

  handleInputChange = event => {
    const { value } = event.target;

    return this.setState({
      search: value
    }, async () => {
      const storedToken = Token.getToken();
      const skip = 0;

      const newResult = await getContactsSearch(100, skip, value, { token : storedToken });

      this.setState({
        resultSearch: newResult || []
      });
    });
  }

  clearSearchTextInput() {
    this.setState({ search: '' });

    setTimeout(function() {
      this.mySearch.current.focus();
    }.bind(this));
  }

  focusSearchTextInput() {
    this.setState({
      navbarColor: '#FFFFFF',
      searchOpen: true,
      iconTransition: {
        height: 40,
        width: 40,
        alt: 'Voltar',
        class: 'icon-back',
        img: '/static/icons/keyboard-arrow.svg'
      }
    });

    const { onSearch } = this.props;

    return onSearch(true);
  }

  backSearchTextInput() {
    const { navbarColor, onSearch } = this.props;

    this.setState({
      navbarColor: navbarColor,
      searchOpen: false,
      search : '',
      iconTransition: {
        height: 24,
        width: 24,
        alt: 'Menu',
        class: 'icon-hamburger',
        img: '/static/icons/hamburger-white.svg'
      }
    });

    return onSearch(false);
  }

  onSearchButtonClick() {
    this.setState({
      navbarColor: '#FFFFFF',
      searchOpen: true,
      iconTransition: {
        height: 40,
        width: 40,
        alt: 'Voltar',
        class: 'icon-back',
        img: '/static/icons/keyboard-arrow.svg'
      }
    });

    setTimeout(function() {
      this.mySearch.current.focus();
    }.bind(this), 1000);

    const { onSearch } = this.props;

    return onSearch(true);
  }

  render() {
    const { showHamburguer, navbarColor, searchOpen, resultSearch, search, iconTransition } = this.state;
    const { appTitle, isMobile, imageUrl, avatarFirstLetter, isOpen, isSearchOpen, editPage } = this.props;
    const arrList = resultSearch || [];

    return (
      <nav style={{ backgroundColor: navbarColor }} className={ `${searchOpen ? 'search-open' : 'search-close'}` }>
        <Head>
          <link rel="preload" href="/static/icons/hamburger.svg" as="image" />
          <meta name="theme-color" content={ navbarColor } />
        </Head>
        <RenderIf condition={ isMobile && editPage }>
          <NavClose ></NavClose>
        </RenderIf>
        <RenderIf condition={ !isMobile || !editPage }>
          <div className="hamburger-main-content">
            <div className={ `icon-content ${iconTransition.class}` } onClick={ iconTransition.alt === 'Menu' ? showHamburguer ? this.props.onHamburgerButtonClick : undefined : this.backSearchTextInput }>
              <img src={ iconTransition.img } alt={ iconTransition.alt } width={ iconTransition.width } height={ iconTransition.height } />
            </div>
            <div className={ `${searchOpen ? 'display-none' : ''} ${!isMobile ? isOpen ? 'not-mobile-left-content-sidenav' : 'not-mobile-left-content' : ''} left-content` }>
              <div className="title">
                <img className={ `${isMobile ? 'display-none' : ''}` } src="/static/icons/pling.png" title="PLING" alt="PLING" width="60" height="60" />
                <div>
                  <i className={ `${isMobile ? 'display-none' : ''} title-divider` } >|</i>
                  <span>{ appTitle }</span>
                </div>
              </div>
            </div>
            <div className={ `${isSearchOpen || !isMobile ? '' : 'display-none'} center-content` } >
              <div className="search-content">
                <div className={ `${searchOpen ? 'search-content-input-black search-content-input-height' : 'search-content-input-white'} search-content-input` } >
                  <img className={ `${isMobile || searchOpen ? 'display-none' : ''} search-icon` } src={ `${searchOpen ? '/static/icons/search-black.svg' : '/static/icons/search-white.svg'}` } alt="Pesquisar" />
                  <input ref={ this.mySearch } value={ search } onChange={ this.handleInputChange } onClick={ this.focusSearchTextInput } type="text" className="search-input" placeholder="Pesquisar"/>
                </div>
                <div className={ `search-results ${search ? '' : 'display-none'}` } >
                  <ul className="results"  >
                    {
                        arrList.map((item, index) => (
                          <li key={ index }><a href="#" onClick={ () => this.onListItemClick && this.onListItemClick(item) }><div>{ item.name }</div> <span>{ item.email } </span></a></li>
                        ))
                    }
                  </ul>
                </div>
              </div>
            </div>
            <div className={ `icon-content-clear ${searchOpen ? '' : 'display-none'}` }  onClick={ this.clearSearchTextInput } >
              <img className={ `${search ? '' : 'display-none'}` } src="../static/icons/clear.svg" alt={ iconTransition.alt } width="24" height="24" />
            </div>
            <div className={ `${!searchOpen ? '' : 'display-none'} ${isMobile ? '' : 'right-content' }` }  >
              <div className={ `${isMobile ? 'none' : 'space' }` } ></div>
              <div className={ `${isMobile && !isSearchOpen ? '' : 'display-none'} apps-content` } onClick={ this.onSearchButtonClick }>
                <img src="/static/icons/search-white.svg" alt="Pesquisar" width="24" height="24" />
              </div>
              <div className={ `${!isSearchOpen ? '' : 'display-none'} apps-content` } onClick={ this.props.onAppsButtonClick }>
                <img src={ `${searchOpen ? '/static/icons/apps-black.svg' : '/static/icons/apps-white.svg'}` } alt="Menu" width="24" height="24" />
              </div>
              <div className={ `${!isMobile && !isSearchOpen ? '' : 'display-none'} avatar-content` } >
                <NavAvatar imageUrl={ imageUrl } firstLetter={ avatarFirstLetter } fullLetter={ avatarFirstLetter }/>
              </div>
            </div>
          </div>
        </RenderIf>

        <style jsx>{`
          nav {
            position: fixed;
            width: 100%;
            height: 63px;
            z-index: 2;
            box-shadow: 0 1px 5px rgba(0,0,0,.2), 0 2px 2px rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12);
          }

          .display-none {
            display: none;
          }

          div {
            display: flex;
          }

          .none {
            display: none;
          }

          .title {
            display : flex;
            -webkit-box-align-: center;
            align-items: center;
            height: 63px;
          }

          .search-close .title {
            color: #fff;
          }

          .search-open .title {
            color: #000;
          }

          .not-mobile-left-content {
            min-width: 165px;
          }

          .left-content {
            margin: auto;
          }

          .space {
            min-width: 140px;
          }

          .not-mobile-left-content-sidenav {
            min-width: 165px;
          }

          .center-content {
            flex: 1 1 100%;
            margin: auto;
          }

          .right-content {
            min-width: 235px;
            text-align: right;
          }

          .title-divider {
            margin: 0 8px 0 5px;
            font-style: normal;
          }

          .title-sub-title {
            height: 63px;
            display: -webkit-box;
            -webkit-box-align-: center;
          }

          .title-content {
            display: flex;
            align-items: center;
          }

          .search-content {
            width: 100%;
            text-align: left;
          }

          .search-content-input {
            border-radius: 4px;
            padding: 10px;
            width: 100%;
          }

          .search-content-input-height {
            height: 63px;
            padding: 0;
          }

          .search-content-input-height .search-input {
            margin: 0;
          }

          .search-results {
            margin: auto;
            width: 100%;
            position: absolute;
            top: 65px;
            left: 0;
            right: 0;
            z-index: 10;
            background-color: transparent;
          }

          .search-results .results {
            margin: 0;
            max-height: 300px;
            overflow-x: hidden;
            overflow-y: auto;
            padding: 0;
            width: 100%;
            border-width: 1px;
            border-style: solid;
            border-color: #FFF #F2F2F2 #F2F2F2 #F2F2F2;
            border-radius: 0 0 3px 3px;
            background-color: #FFF;
            box-shadow: 0 -1px 0 #e0e0e0, 0 0 2px rgba(0,0,0,.12), 0 2px 4px rgba(0,0,0,.24);
            webkit-animation: slide-down .15s cubic-bezier(.4,0,.2,1);
            animation: slide-down .15s cubic-bezier(.4,0,.2,1);
          }

          .search-results .results li {
            display: block
          }

          .search-results .results li span { 
            color: #646464;
          }

          .search-results .results li:first-child:before {
            border-bottom: 5px solid #c4c7d7;
            top: -11px;
          }

          .search-results .results li:first-child:after {
            border-bottom: 5px solid #fdfdfd;
            top: -10px;
          }

          .search-results .results li:first-child:hover:before, .search-results .results li:first-child:hover:after { display: none }

          .search-results .results li:last-child { margin-bottom: -1px }

          .search-results .results a {
            display: block;
            position: relative;
            margin: 0 -1px;
            padding: 15px 10px;
            text-decoration: none;
            color: #000;
          }

          .search-results .results a:before {
            content: '';
            width: 18px;
            height: 18px;
            position: absolute;
            top: 50%;
            right: 10px;
            margin-top: -9px;
          }

          .search-results .results a:hover {
            text-decoration: none;
            background-color: #F2F2F2;
          }

          .search-content-input-white {
            background: rgba(255,255,255,0.15);
            color: #fff;
            -webkit-text-fill-color: #fff;
          }

          .search-content-input-black {
            background-color: #FFF;
            color: #000;
            -webkit-text-fill-color: #646464;
          }

          @media (min-width: 1024px) and (max-width: 1556px) {
            .search-content {
              margin: 0;
            }

            .search-content-input {
              margin: 0;
              width: 100%;
            }

            .search-results {
              margin: 0;
              width: 100%;
              padding: 0 234px; 
            }
          }

          @media (max-width: 600px) {
            .search-content {
              margin: 0;
            }

            .search-content-input {
              margin: 0;
              width: 90%;
            }

            .search-results {
              margin: 0;
              width: 100%;
              padding: 0;
            }
          }

          @media (min-width: 600px) and (max-width: 1024px) {
            .search-content-input {
              margin: 0;
              width: 100%;
            }

            .search-results {
              margin: 0;
              width: 100%;
              padding: 0 234px;
            }
            
          }

          @media (min-width: 1600px){
            .search-content-input {
              width: 1160px;
            }

            .search-results {
              width: 1160px;
            }
          }

          .search-icon {
            margin: 4px auto;
          }

          .search-input {
            margin: 0 12px;
            text-shadow: 0 0 0 rgba(255, 255, 255, .87);
            font-size: 16px;
            width: 100%;
            padding: 0;
            display: block;
            flex: 1;
            border: none;
            background: none;
            transition: all .4s cubic-bezier(.25,.8,.25,1);
            transition-property: font-size;
            font-family: inherit;
            line-height: 32px;
          }

          .app-title {
            padding: 20px 0 20px 0;
            font-size: 20px;
            font-weight: normal;
            letter-spacing: .01em;
            line-height: 24px;
            margin: 0;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: rgba(255, 255, 255, .87);
          }

          .hamburger-main-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            z-index: 10;
            padding: 0 0 0 4px;
          }

          .icon-content {
            cursor: pointer;
          }

          .icon-content-clear {
            cursor: pointer;
            padding: 0 20px;
          }

          .icon-hamburger {
            padding: 0 20px;
          }

          .icon-back {
            padding: 0 10px;
          }

          .icon-hamburger img {
            height: 24;
            width: 24;
            transition: all 0.30s cubic-bezier(0.55, 0.51, 0.57, 0.6);
            transform: translate3d($switch_width - $circle_size + 3, 0, 0);
            transform: rotate(0deg);
          }

          .icon-back img {
            height: 40;
            width: 40;
            transition: all 0.30s cubic-bezier(0.55, 0.51, 0.57, 0.6);
            transform: translate3d($switch_width - $circle_size + 3, 0, 0);
            transform: rotate(-90deg);
          }

          .apps-content {
            padding: ${!isMobile ? '20px 0' : ' 0 20px 0 0'};
            cursor: pointer;
          }

          .avatar-content {
            padding: 12px 16px;
            cursor: pointer;
          }

          @media (max-width: 600px) {
            .app-title {
              font-size: 17px;
            }
          }
        `}</style>
      </nav>
    );
  }
}

Nav.propTypes = {

  // Callback function of the hamburguer click
  onHamburgerButtonClick: func,

  onAppsButtonClick: func,

  imageUrl: string,

  avatarFirstLetter: string,

  navbarColor: string.isRequired,

  // Title to show in the navbar
  appTitle: string,

  isMobile: bool,

  isOpen: bool,

  children: node,

  onSearch: func,

  isSearchOpen: bool,

  editPage: bool
};

Nav.defaultProps = {
  isMobile: true
};

export default Nav;
