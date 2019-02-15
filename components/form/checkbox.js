import { string, func, bool } from 'prop-types';

/**
 * @function Checkbox
 * @description Returns a checkbox with its label
 * @param  {String} name       Name of the checkbox component
 * @param  {String} _id        Identifier to the label and a reference to its label
 * @param  {String} label      Text of label and value of checkbox button
 * @param  {Boolean} value      Selected value
 * @param  {Function} onChange Callback event of change
 */
const Checkbox = ({ name, _id, label, value, disabled, onChange }) => (
  <div className={ `checkbox-container ${disabled ? 'disabled' : ''} ${value ? '' : 'unchecked'}` }>
    <input
      type="checkbox"
      id={ `checkbox_${_id}` }
      name={ name }
      value={ label }
      disabled={ disabled }
      checked={ value ? value : false }
      onChange={ () => onChange(_id) }
    />
    <label htmlFor={ `checkbox_${_id}` }>{label}</label>

    <style jsx>{`
      .checkbox-container {
        padding: 0;
        margin: auto 0;
        max-width: 350px;
        overflow: auto;
        position: relative;
        text-align: left;
      }

      .checkbox-container,
      .checkbox-container > * {
        cursor: pointer;
      }

      .checkbox-container > label {
        display: inline-block;
        float: left;
        margin-top: -20px;
        padding-left: 50px;
        user-select: none;
        width: 100%;
      }

      .checkbox-container.disabled > label {
        color: #bbb;
      }

      .checkbox-container.unchecked > label {
        color: gray;
      }

      .checkbox-container > input {
        height: 18px;
        width: 18px;
      }

      @media (max-width: 768px) {
        .checkbox-container > label {
          line-height: 26px;
          margin-top: -26px;
        }
      }
    `}</style>
  </div>
);

Checkbox.propTypes = {
  name: string.isRequired,
  _id: string.isRequired,
  label: string.isRequired,
  value: bool,
  disabled: bool,
  onChange: func,
};

Checkbox.defaultProps = {
  disabled: false,
  checked: false,
};

export default Checkbox;
