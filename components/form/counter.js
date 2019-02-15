import { number, string } from 'prop-types';

/**
 * Components
 */
import CircularProgressBar from '../progress-circle';

const Counter = ({ value, max, color = '#1e88e5' }) => {
  return (
    <div className="progress-circle">
      <span className="counter">
        {value}/{max}
      </span>

      <CircularProgressBar strokeWidth={ 3 } sqSize={ 20 } percentage={ (value / max) * 100 } color={ color } />

      <style jsx>{`
        .progress-circle {
          position: absolute;
          right: 0;
          top: 100%;
          margin-top: 5px;
          display: flex;
          align-items: center;
        }

        .counter {
          display: block;
          color: rgba(0, 0, 0, 0.4);
          margin-right: 10px;
          font-size: 80%;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

Counter.propTypes = {
  value: number.isRequired,
  max: number.isRequired,
  color: string,
};

export default Counter;
