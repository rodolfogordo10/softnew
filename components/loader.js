import { number, string } from 'prop-types';

const Loader = ({ size, color }) => (
  <div className="loader-container">
    <svg className="spinner" width={ size } height={ size } viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <circle className="path" fill="none" cx="20" cy="20" r="18" strokeWidth="4" />
    </svg>

    <style jsx>{`
      .loader-container {
        display: inline-block;
      }

      .spinner {
        animation: rotator 1.4s linear infinite;
      }

      .path {
        animation: dash 1.4s ease-in-out infinite;
        stroke: ${color};
        stroke-dasharray: 113;
        stroke-dashoffset: 0;
        transform-origin: center;
      }

      @keyframes rotator {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(270deg);
        }
      }

      @keyframes dash {
        0% {
          stroke-dashoffset: 113;
        }
        50% {
          stroke-dashoffset: 10;
          transform: rotate(135deg);
        }
        100% {
          stroke-dashoffset: 113;
          transform: rotate(450deg);
        }
      }
    `}</style>
  </div>
);

Loader.propTypes = {
  size: number,
  color: string,
};

Loader.defaultProps = {
  size: 60,
  color: '#1e88e5',
};

export default Loader;
