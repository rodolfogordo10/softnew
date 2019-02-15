import App, { Container } from 'next/app';
import Page from '../layouts/main';

import { isMobile as isMobileDevice } from '../utils/mobile';

import { getLoginUrl, whoami } from '../services/auth';
import * as Token from '../utils/auth';

export default class SystemApp extends App {
  constructor (props) {
    super(props);
  }

  static async getInitialProps ({ Component, ctx }) {
    const { req } = ctx;
    const isMobile = isMobileDevice(req);
    let pageProps = {
      isMobile
    };

    if (req && req.query && req.query.token) {
      ctx.token = req.query.token;
      pageProps.token = ctx.token;
    }

    ctx.isMobile = isMobile;
    pageProps.isMobile = isMobile;

    // Gets the initial data of the component
    if (Component.getInitialProps) {
      const componentProps = await Component.getInitialProps(ctx);

      pageProps = {
        ...pageProps,
        ...componentProps
      };
    }

    return { pageProps };
  }

  state = {
    isSidenavOpen: null
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.user || !props.pageProp)
      return null;

    // Update user of the state
    return {
      ...state
    };
  }

  async componentDidMount () {
    const { token } = this.props.pageProps;
    const { user } = this.state;

    if (!user) {

      // Fetchs user if it is not in the state
      const data = await whoami(token);

      this.setState({
        user: data
      });
    }

    // Token from the url
    if (token) {

      // Clear the existing token and save the new one
      Token.clearStorage();

      Token.saveToken(token);

      // Remove the token from the url
      const { href, search } = window.location;

      if (search) {
        const path = href.replace(search, '');

        window.history.pushState({}, '', path);
      }
    } else {

      // Retrieve token from storage
      const storedToken = Token.getToken();

      if (!storedToken) {

        // Redirect to login
        try {
          const loginUrl = await getLoginUrl(window.location.href);

          window.location.href = loginUrl;
        } catch (err) {
          console.error(err);
        }
      } else {
        Token.saveToken(storedToken);
      }
    }
  }

  render () {
    const { Component, pageProps } = this.props;
    const { token } = pageProps;
    const { user } = this.state;

    return (
      <Container>
        <Page user={ user } token={ token }>
          <Component { ...pageProps } />
        </Page>
      </Container>
    );
  }
}
