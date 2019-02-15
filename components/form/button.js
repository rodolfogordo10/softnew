import { string, bool, func, node } from 'prop-types';

/**
 * @function Button
 * @param {Any} children     Things to be rendered inside the button
 * @param {String} color     Background color
 * @param {String} textColor Text color
 * @param {Boolean} disabled Button needs to be disabled or not
 * @param {Function} onClick Click callback event
 */
const Button = ({ children, color, textColor, disabled, onClick, loading }) => (
  <button className="button" disabled={ disabled } onClick={ onClick }>
    {children}
    {loading && <div className="loader-button" />}

    {/* Style of this specific component */}
    <style jsx>{`
      .button {
        background: ${color};
        color: ${textColor};
      }

      .loader-button {
        border: 2.5px solid transparent;
        border-radius: 50%;
        border-top: 2.5px solid #1e88e5;
        width: 35px;
        height: 35px;
        animation: spin 0.8s linear infinite;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin: auto;
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

    {/* Global styles of buttons */}
    <style jsx global>{`
      .button {
        border: none;
        border-radius: 2px;
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);
        cursor: pointer;
        font-size: 17px;
        font-weight: 700;
        line-height: 1.2;
        padding: 17px 20px;
        margin: 5px;
        width: 100%;
        max-width: 190px;
        min-height: 50px;
        max-height: 100px;
        outline: none;
        text-align: center;
        text-decoration: none;
        transition: 0.4s ease 0.1s;
        user-select: none;
        vertical-align: middle;
        position: relative;
      }

      .button:hover {
        opacity: 0.6;
        outline: none;
        text-decoration: none;
        user-select: none;
      }

      .button[disabled] {
        background: #d5d5d5 !important;
        box-shadow: none;
        color: rgba(0, 0, 0, 0.26) !important;
        cursor: default;
      }

      .button[disabled]:hover {
        opacity: 1;
      }

      @media screen and (max-width: 960px) {
        .button {
          margin: 5px 0;
          max-width: 100%;
          max-height: 55px;
          width: 100% !important;
        }

        .button:hover {
          opacity: 1;
        }
      }
    `}</style>
  </button>
);

Button.propTypes = {
  color: string.isRequired,
  textColor: string.isRequired,
  disabled: bool.isRequired,
  disableOnFinish: bool,
  onClick: func,
  loading: bool,
  children: node.isRequired,
};

// Default values
Button.defaultProps = {
  color: '#43A047',
  textColor: '#fff',
  disableOnFinish: false,
  disabled: false,
  loading: false,
};

export default Button;
