import App, { Container } from 'next/app';
import Page from '../layouts/main';

import { isMobile as isMobileDevice } from '../utils/mobile';

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
    if (!props.pageProp)
      return null;

    // Update user of the state
    return {
      ...state
    };
  }

  async componentDidMount () {
  }

  render () {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Page >
          <Component { ...pageProps } />
        </Page>
      </Container>
    );
  }
}
