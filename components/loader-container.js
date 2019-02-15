import { PureComponent } from 'react';
import { bool } from 'prop-types';
import Loader from './loader';

class LoaderContainer extends PureComponent {
  static propTypes = {
    loading: bool
  }

  renderWrapper() {
    return (
      <div className="wrapper">
        <Loader />

        <style jsx>{`
          .wrapper {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
          }

          :global(.loader-container) {
            align-self: center;
            margin: auto;
          }
        `}</style>
      </div>
    );
  }

  render() {
    const { loading } = this.props;

    return loading ? this.renderWrapper() : null;
  }
}

export default LoaderContainer;
