import { Component } from 'react';
import { string, bool, func, node } from 'prop-types';
import Mobile from '../services/mobile';

// Default styles of the sidenav
const defaultStyles = {
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  sidebar: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    zIndex: 1,
    transition: 'transform .2s ease-out',
    WebkitTransition: '-webkit-transform .2s ease-out',
    willChange: 'transform',
    overflowY: 'auto',
  },
  content: {
    backgroundColor: '#f2f2f2',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    WebkitOverflowScrolling: 'touch',
    transition: 'left .3s ease-out, right .3s ease-out',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    zIndex: 3,
    visibility: 'hidden',
    transition: 'opacity .3s ease-out, visibility .3s ease-out',
    backgroundColor: 'rgba(0,0,0,.5)'
  }
};

/**
 * @class Sidenav
 * @description Represents our sidenav
 */
class Sidenav extends Component {
  constructor (props) {
    super(props);

    this.overlayClicked = this.overlayClicked.bind(this);
  }

  state = {
    isMobile: true
  }

  componentDidMount () {
    return this.setState({
      isMobile: Mobile.isMobile()
    });
  }

  isTouching () {
    return this.state.touchIdentifier !== null;
  }

  overlayClicked () {
    if (!this.props.isOpen) {
      return;
    }

    this.props.onSetOpen(false);
  }

  render () {
    const { isMobile } = this.state;
    const sidebarStyle = { ...defaultStyles.sidebar };
    const contentStyle = { ...defaultStyles.content };
    const overlayStyle = { ...defaultStyles.overlay };

    const rootProps = {
      style: { ...defaultStyles.root },
      role: 'navigation'
    };

    // start closed
    sidebarStyle.transform = 'translateX(-100%)';
    sidebarStyle.WebkitTransform = 'translateX(-100%)';

    if (this.props.isOpen) {
      // slide open sidebar
      sidebarStyle.transform = `translateX(0%)`;
      sidebarStyle.WebkitTransform = `translateX(0%)`;

      // show overlay only in mobile
      overlayStyle.opacity = isMobile ? 1 : 0;
      overlayStyle.visibility = isMobile ? 'visible' : 'invisible';
      overlayStyle.display = isMobile ? 'block' : 'none';
    }

    if (!isMobile) {
      sidebarStyle.top = '66px';
      sidebarStyle.boxShadow = 'none';
    } else {
      sidebarStyle.margin = '0px';
      sidebarStyle.zIndex = '4';
      sidebarStyle.height = '100vh';
    }

    return (
      <div { ...rootProps }>
        {/* sidenav content */}
        <div className={ this.props.sidebarClassName } style={ sidebarStyle }>
          { this.props.sidenavContent }
        </div>

        {/* overlay */}
        <div style={ overlayStyle } role="presentation" tabIndex="0" onClick={ this.overlayClicked } />

        {/* children content */}
        <div className={ this.props.contentClassName } style={ contentStyle }>
          { this.props.children }
        </div>
      </div>
    );
  }
}

Sidenav.propTypes = {
  // Main content to render
  children: node.isRequired,

  // Sidebar content to render
  sidenavContent: node.isRequired,

  // Boolean if sidebar should slide open
  isOpen: bool,

  // Callback called when the overlay is clicked
  onSetOpen: func,

  sidebarClassName: string,
  contentClassName: string
};

Sidenav.defaultProps = {
  isOpen: false,
  onSetOpen: () => {}
};

export default Sidenav;
