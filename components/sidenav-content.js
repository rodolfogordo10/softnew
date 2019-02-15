import { Component } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import RenderIf from './renderif';
import Mobile from '../services/mobile';

// All default styles
const defaultStyles = {
  sidenav: {
    width: '400px',
    boxShadow: '0 8px 10px -5px rgba(0,0,0,.2), 0 16px 24px 2px rgba(0,0,0,.14), 0 6px 30px 5px rgba(0,0,0,.12)'
  },
  sidenavLink: {
    display: 'block',
    padding: '16px 0px',
    color: '#000',
    textDecoration: 'none',
  },
  divider: {
    margin: '0',
    height: 1,
    backgroundColor: '#f2f2f2',
    borderWidth: '0.7px'
  },
  content: {
    backgroundColor: '#f2f2f2',
    width: '232px'
  },
  header: {
    height: '50px',
    display: 'flex',
    alignItems: 'center'
  },
  ul: {
    listStyle: 'none',
    padding: '0',
    margin: '10px 0px 0px 6px',
    backgroundColor: '#f2f2f2'
  },
  li: {
    display: 'inline-flex',
    WebkitBoxAlign: 'center',
    alignItems: 'center',
    width: '216px',
    cursor: 'pointer',
    color: '#000',
    fontSize: '14px'
  },
  a: {
    display: 'flex',
    WebkitBoxAlign: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    textDecoration: 'none'
  },
  img: {
    marginRight: '20px',
    marginLeft: '16px'
  },
  span: {
    margin: '13px',
  },
  title: {
    display: 'flex',
    WebkitBoxAlign: 'center',
    alignItems: 'center',
    background: '#6A8C92',
    color: '#fff',
    height: '63px',
    padding: '0 0 0 16px'
  },
  titleDivider: {
    margin: '0 8px 0 5px',
    fontStyle: 'normal'
  },
  titleSubtitle: {
    height: '63px',
    display: '-webkit-box',
    WebkitBoxAlign: 'center'
  }
};

/**
 * @description Represents the content of the sidenav, its items
 */
export default class extends Component {
  state = {
    isMobile: false
  }

  componentDidMount() {
    const newState = {
      isMobile: Mobile.isMobile()
    };

    return this.setState(newState, () => {
      const event = document.createEvent("Event");
      event.initEvent("sidenavLoaded", false, true);

      // Emit an event that the sidenav content is loaded
      document.dispatchEvent(event);
    });
  }

  getMenus() {
    const menus = [
      {
        text: 'Contatos',
        image: '/static/icons/assignment.svg',
        path: 'contatos'
      }
    ];

    return menus.map(menu => {
      return {
        ...menu
      };
    });
  }

  render() {
    const contentStyle = { ...defaultStyles.content };
    const ulStyles = { ...defaultStyles.ul };
    const liStyles = { ...defaultStyles.li };
    const { isMobile } = this.state;
    const routePathname = Router.asPath;
    const menus = this.getMenus();

    if (isMobile) {
      contentStyle.height = '100vh';
      ulStyles.margin = '0';
      liStyles.width = '100%';
    }

    return (
      <div style={ contentStyle }>
        {/* sidenav list links */}
        <div>
          <ul style={ ulStyles }>
            <RenderIf condition={ isMobile }>
              <li id="header" style={ defaultStyles.title }>
                <img src="/static/icons/pling.svg" title="PLING" alt="PLING" width="60" height="60" />
                <div style={ /([78])_.*mac/i.test(isMobile) === true ? defaultStyles.titleSubtitle : null }>
                  <i style={ defaultStyles.titleDivider }>|</i>
                  <span>Sistema</span>
                </div>
              </li>
            </RenderIf>
            {
              menus.map(menu => {
                const typePath = menu.url ? menu.url : menu.path;
                const path = Array.isArray(typePath) ? typePath[0] : typePath;
                let href = {
                  pathname: `/${menu.path}`,
                  query: {}
                };

                const asPathActive = routePathname.split('/')[1];

                let isActive = asPathActive === path;

                if (Array.isArray(menu.path)) {
                  isActive = menu.path.reduce((previous, current) =>
                    previous || asPathActive === current, false);
                }

                return (
                  <li style={ liStyles } className={ `${isActive ? 'active' : ''}` } key={ path }>
                    <Link href={ href } >
                      <a style={ defaultStyles.a }>
                        <img style={ defaultStyles.img } src={ menu.image } alt={ menu.text } />
                        <span style={ defaultStyles.sidenavLink }>{menu.text}</span>
                      </a>
                    </Link>
                  </li>
                );
              })
            }
          </ul>
        </div>

        <style jsx>{`
          li:hover {
            background-color: #0000000f;
          }
          .active{
            background-color: #0000000d;
            font-weight: 600;
          }
          .active:hover {
            background-color: #00000014;
          }
          .mobile:hover {
            background-color: #FFF !important;
          }
        `}</style>
      </div>
    );
  }
}
