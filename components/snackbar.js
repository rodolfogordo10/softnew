import { Component } from 'react';
import { createPortal } from 'react-dom';
import { func, number, node } from 'prop-types';

class SnackbarWrapper extends Component {
  static propTypes = {
    children: node.isRequired,
  };

  componentDidMount() {
    this.element = document.getElementById('snackbar');
  }

  render() {
    if (this.element === undefined) {
      return null;
    }

    return createPortal(this.props.children, this.element);
  }
}

class Snackbar extends Component {
  state = {
    show: false,
    text: '',
  };

  static propTypes = {
    onFinishTimer: func,
    timeout: number,
    animationDuration: number,
  };

  static defaultProps = {
    timeout: 4000,
    animationDuration: 350,
  };

  show = text => {
    const { animationDuration, timeout, onFinishTimer } = this.props;

    this.setState(
      {
        show: true,
        text,
      },
      () => {
        setTimeout(() => {
          this.setState({ show: false }, () => {
            setTimeout(() => {
              this.setState({ text: '' });
              onFinishTimer && onFinishTimer();
            }, animationDuration);
          });
        }, timeout);
      }
    );
  };

  render() {
    const { show, text } = this.state;

    return (
      <SnackbarWrapper>
        <div className={ `snackbar ${show && text ? 'show' : ''}` }>
          {text ? text : ''}

          <style jsx>{`
            .snackbar {
              background: #323232;
              font: bold 14px/1.5 sans-serif;
              color: rgba(255, 255, 255, 0.8);
              padding: 16px;
              min-height: 48px;
              border-radius: 4px;
              box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
              position: absolute;
              bottom: 0;
              left: 0;
              min-width: 344px;
              visibility: hidden;
              transform: translate3d(0, 100%, 0);
              opacity: 0;
              transition: ${this.props.animationDuration}ms;
            }

            @media (max-width: 960px) {
              .snackbar {
                min-width: 100%;
              }
            }

            .snackbar.show {
              visibility: visible;
              transform: translate3d(0, 0, 0);
              opacity: 1;
            }
          `}</style>
        </div>
      </SnackbarWrapper>
    );
  }
}

export default Snackbar;
