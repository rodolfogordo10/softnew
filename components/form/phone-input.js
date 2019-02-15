import { Component } from 'react';
import { string, func, bool } from 'prop-types';

/**
 * Utils
 */
import { phone, cellPhone } from '../../utils/masks';
import { validatePhone } from '../../utils/validations';

/**
 * Components
 */
import Input from './input';

class PhoneInput extends Component {
  static propTypes = {
    // Identifier of the question that contains this input
    id: string.isRequired,

    // Input's value
    value: string,

    // Placeholder of the input
    placeholder: string,

    // Event when the input is blurred
    onChange: func,

    // Event when the text of the input changes, without losing focus
    onChangeText: func,

    onBlur: func,

    onFocus: func,

    // If it is disabled or not
    disabled: bool,

    // Accept only cell phone
    onlyCellPhone: bool,
  };

  static defaultProps = {
    value: '',
    disabled: false,
  };

  state = {
    isValid: true,
  };

  /**
   * @function validate
   * @description Validates the phone number
   * @param  {String} value Value of the input
   */
  validate = value => validatePhone(value, this.props.onlyCellPhone);

  /**
   * @function onFocus
   * @description Handles the focus event
   */
  onFocus = () => {
    const { onFocus } = this.props;

    return this.setState(
      {
        isValid: true,
      },
      () => onFocus && onFocus()
    );
  };

  /**
   * @function onBlur
   * @description Emits the event of blur to its parent
   * @param  {Object} event DOM event
   */
  onBlur = () => {
    const { onBlur, value } = this.props;
    const isValid = this.validate(value);

    return this.setState(
      {
        isValid,
      },
      () => onBlur && onBlur(value)
    );
  };

  /**
   * @function onChange
   * @description Handles the input value to get the cep infos
   * @param  {String} value Value of the input
   */
  onChange = async value => {
    const { onChangeText } = this.props;

    if (onChangeText) {
      onChangeText(value);
    }
  };

  getMask = val => {
    return val.replace(/\D/g, '').length <= 10 && !this.props.onlyCellPhone ? phone : cellPhone;
  };

  render() {
    const { id, value, disabled, placeholder, onlyCellPhone } = this.props;
    const { isValid } = this.state;
    const inputId = `input_${id}`;
    const showValidation = !disabled && !isValid && value !== '';

    const inputProps = {
      id: inputId,
      name: inputId,
      value: value ? value : '',
      type: 'tel',
      mask: this.getMask,
      label: placeholder,
      className: `input${showValidation ? ' invalid' : ''}`,
      disabled: disabled,
      onFocus: this.onFocus,
      onChange: this.onChange,
      onBlur: this.onBlur,
      onlyCellPhone: onlyCellPhone ? onlyCellPhone : true,
    };

    // Return input mask component
    return (
      <div className={ `input-container ${showValidation ? ' invalid' : ''}` }>
        <Input { ...inputProps } />

        {showValidation && (
          <label htmlFor={ inputId } className="input-validate">
            Número inválido
          </label>
        )}

        <style jsx>{`
          .input-container {
            position: relative;
          }

          .input-validate {
            position: absolute;
            top: 100%;
            left: 2px;
            color: #e53935;
            font-size: 11px;
            font-weight: bold;
            margin-top: 5px;
          }

          .invalid :global(input) {
            border-color: #e53935;
          }

          .input[disabled] {
            color: ${this.state.isMac ? 'black' : '#636060'};
          }

          .input-container {
            width: 100%;
            max-width: 640px;
          }

        `}</style>
      </div>
    );
  }
}

export default PhoneInput;
