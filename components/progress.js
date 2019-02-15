import { number } from 'prop-types';

/**
 * @function Progress
 * @description Represents a progress bar
 */
const Progress = ({ value }) => (
  <div className="progress">
    <div className="progress-bar"
      role="progressbar"
      aria-valuenow={ value }
      aria-valuemin="0"
      aria-valuemax="100"
      style={{ width: `${value}%` }}>{ `${value}%` }</div>

    <style jsx global>{`
      .progress {
        background: #eee;
        margin: 0 auto;
        max-width: 400px;
        overflow: hidden;
        width: 100%;
      }

      .progress-bar {
        background: #43A047;
        text-indent: -999px;
        transition: width .3s ease-in-out, background .3s ease-in-out;
        width: 0;
      }
    `}</style>
  </div>
);

Progress.propTypes = {

  // Identify the completion percent
  value: number
};

Progress.defaultProps = {
  value: 0
};

export default Progress;
