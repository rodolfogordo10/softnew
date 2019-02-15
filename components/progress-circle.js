import { Component } from 'react';
import { number, bool, string } from 'prop-types';

class CircularProgressBar extends Component {
  state = {};

  static propTypes = {
    sqSize: number,
    percentage: number,
    strokeWidth: number,
    showPercentage: bool,
    color: string,
  };

  static defaultProps = {
    sqSize: 200,
    percentage: 25,
    strokeWidth: 10,
    showPercentage: false,
    color: '#000',
  };

  render() {
    const { sqSize, percentage, strokeWidth, showPercentage, color } = this.props;
    const radius = (sqSize - strokeWidth) / 2;
    const viewBox = `0 0 ${sqSize} ${sqSize}`;
    const dashArray = radius * Math.PI * 2;
    const dashOffset = dashArray - (dashArray * percentage) / 100;

    return (
      <div>
        <svg width={ sqSize } height={ sqSize } viewBox={ viewBox }>
          <circle
            className="circle-background"
            cx={ sqSize / 2 }
            cy={ sqSize / 2 }
            r={ radius }
            strokeWidth={ `${strokeWidth}px` }
          />
          <circle
            className="circle-progress"
            cx={ sqSize / 2 }
            cy={ sqSize / 2 }
            r={ radius }
            strokeWidth={ `${strokeWidth}px` }
            transform={ `rotate(-90 ${sqSize / 2} ${sqSize / 2})` }
            style={{
              strokeDasharray: dashArray,
              strokeDashoffset: dashOffset,
            }}
          />
          {showPercentage && (
            <text className="circle-text" x="50%" y="50%" dy=".3em" textAnchor="middle">
              {`${percentage}%`}
            </text>
          )}
        </svg>

        <style jsx>{`
          svg {
            vertical-align: middle;
          }

          .circle-background,
          .circle-progress {
            fill: none;
          }

          .circle-background {
            stroke: #ddd;
          }

          .circle-progress {
            stroke: ${color};
          }

          .circle-text {
            font-size: 3em;
            font-weight: bold;
            fill: ${color};
          }
        `}</style>
      </div>
    );
  }
}

export default CircularProgressBar;
