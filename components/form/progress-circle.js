import { Component } from 'react';
import { number, string } from 'prop-types';

import Spinner from '../loader';

export default class Loader extends Component {
  static propTypes = {
    progress: number,
    backgroundColor: string,
    borderColor: string,
    size: number
  };

  static defaultProps = {
    backgroundColor: '#e0e0e0',
    borderColor: '#1e88e5',
  };

  render() {
    const { progress, backgroundColor, borderColor, size } = this.props;
    const isDone = progress === 100 || progress === undefined;
    const DEG = 90;
    const HALF_PERCENT = 50;
    const PERCENT_ANGLE = 3.6;

    let backgroundImage = null;

    if (progress < HALF_PERCENT) {
      const nextdeg = DEG + PERCENT_ANGLE * progress;

      backgroundImage = `
          linear-gradient(90deg, ${backgroundColor} 50%, transparent 50%, transparent),
          linear-gradient(${nextdeg}deg, ${borderColor} 50%, ${backgroundColor} 50%, ${backgroundColor})
        `;
    } else {
      const nextdeg = -DEG + PERCENT_ANGLE * (progress - HALF_PERCENT);

      backgroundImage = `
          linear-gradient(${nextdeg}deg, ${borderColor} 50%, transparent 50%, transparent),
          linear-gradient(270deg, ${borderColor} 50%, ${backgroundColor} 50%, ${backgroundColor})
        `;
    }

    return (
      <div className={ `loader ${isDone ? 'done' : ''}` } style={{ backgroundColor, backgroundImage }}>
        {isDone ? <Spinner color={ borderColor } size={ size ? size : 40 } /> : <div className="inner" style={{ backgroundColor }} />}

        <style jsx>{`
          .loader {
            border-radius: 50%;
            {/* width: 40px;
            height: 40px; */}
          }

          .inner {
            content: '';
            border-radius: 50%;
            position: absolute;
            top: 4px;
            right: 4px;
            bottom: 4px;
            left: 4px;
            outline: 1px solid transparent;
          }

          .done {
            background-image: none !important;
          }

          @media (max-width: 768px) {
            .loader {
              {/* height: 32px;
              width: 32px; */}
            }
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }

            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }
}
