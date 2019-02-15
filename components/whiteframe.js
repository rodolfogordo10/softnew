import { node } from 'prop-types';

/**
 * @description Whiteframe – Box with a shadow in the desktop viewport
 */
const Whiteframe = ({ children }) => (
  <div className="whiteframe">
    { children }

    <style jsx global>{`
      .whiteframe {
        box-shadow: 0 1px 5px rgba(0,0,0,.2), 0 2px 2px rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12);
        background: #fff;
        margin: 0 auto;
        max-width: 960px;
        padding: 0;
        width: 100%;
      }

      @media (max-width: 768px) {
        .whiteframe {
          box-shadow: none;
        }
      }
    `}</style>
  </div>
);

Whiteframe.propTypes = {
  children: node.isRequired
};

export default Whiteframe;
