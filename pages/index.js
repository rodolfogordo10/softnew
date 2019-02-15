import { bool } from 'prop-types';

const Index = ({ isMobile }) => (
  <h1>Testing: Is mobile? { isMobile === true ? 'Sim' : 'Não' }</h1>
);

Index.getInitialProps = context => {
  const { isMobile } = context;

  return { isMobile };
};

Index.propTypes = {
  isMobile: bool.isRequired
};

export default Index;
