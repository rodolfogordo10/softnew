import { string, func, bool, node } from 'prop-types';

/**
 * @function Button
 * @param  {Any} children     Things to be rendered inside the button
 * @param  {String} color     Background color
 * @param  {String} textColor Text color
 * @param  {Boolean} disabled Button needs to be disabled or not
 * @param  {Function} onClick Click callback event
 */
const Button = ({ children, color, textColor, disabled, onClick, href, download, title, rel, target }) => (
  <a className="link-button"
    disabled={ disabled }
    onClick={ ev => !disabled && onClick && onClick(ev) }
    href={ href }
    download={ download }
    title={ title }
    rel={ rel }
    target={ target }
  >
    {children}

    {/* Style of this specific component */}
    <style jsx>{`
      .link-button {
        background: ${color};
        color: ${textColor};
        display: inline-block;
        border: none;
        border-radius: 2px;
        box-shadow: 0 1px 5px rgba(0, 0, 0, .2), 0 2px 2px rgba(0, 0, 0, .14), 0 3px 1px -2px rgba(0, 0, 0, .12);
        cursor: pointer;
        font-size: 17px;
        font-weight: 700;
        line-height: 1.2;
        padding: 17px 20px;
        margin: 5px;
        width: 100%;
        max-width: 190px;
        min-height: 54px;
        max-height: 54px;
        outline: none;
        text-align: center;
        text-decoration: none;
        transition: all .4s ease .1s;
        user-select: none;
        vertical-align: middle;

      }

      .link-button:hover {
        opacity: 0.6;
        outline: none;
        text-decoration: none;
        user-select: none;
      }

      .link-button[disabled] {
        background: #d5d5d5 !important;
        box-shadow: none;
        color: rgba(0, 0, 0, .26) !important;
        cursor: default;
      }

      .link-button[disabled]:hover {
        opacity: 1;
      }

      @media screen and (max-width: 960px) {
        .link-button {
          margin: 5px 0;
          max-width: 100%;
          max-height: 55px;
          width: 100% !important;
        }
        .link-button:hover {
          opacity: 1;

        }
      }
    `}</style>
  </a>
);

Button.propTypes = {
  color: string.isRequired,
  textColor: string.isRequired,
  disabled: bool,
  onClick: func,
  children: node.isRequired,
  download: string,
  href: string,
  title: string,
  rel: string,
  target: string
};

// Default values
Button.defaultProps = {
  color: '#d5d5d5',
  textColor: '#000',
  disabled: false
};

export default Button;
