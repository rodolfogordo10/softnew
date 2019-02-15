import { Component } from 'react';
import { string, func, bool, array, oneOfType } from 'prop-types';
import MaskedInput, { conformToMask } from 'react-text-mask';

/**
 * Components
 */
import Label from './label';
import Counter from './counter';
import Loader from '../loader';

export default class InputText extends Component {
  static propTypes = {
    id: string.isRequired,
    type: string,
    value: string,
    label: string,
    placeholder: string,
    onChange: func,
    onBlur: func,
    onFocus: func,
    onClick: func,
    invalid: bool,
    invalidMsg: string,
    disabled: bool,
    mask: oneOfType([func, array]),
    maxLength: string,
    minLength: string,
    minLengthValidation: func,
    showCounter: bool,
    showCounterOnFocusOnly: bool,
    loading: bool,
  };

  static defaultProps = {
    type: 'text',
    invalid: false,
    showCounterOnFocusOnly: true,
  };

  state = {
    focused: false,
    invalidMsg: this.props.invalidMsg,
    invalid: this.props.invalid,
  };

  setFocus = () => {
    const { onFocus } = this.props;
    return this.setState(
      {
        focused: true,
      },
      () => onFocus && onFocus()
    );
  };

  setBlur = () => {
    const { onBlur } = this.props;
    return this.setState(
      {
        focused: false,
      },
      () => onBlur && onBlur(this.state.invalid)
    );
  };

  isValid = text => {
    const { minLength, invalid, minLengthValidation } = this.props;

    let componentInvalid = invalid;
    if (minLength && text.length < minLength) {
      componentInvalid = true;
    }
    return this.setState(
      {
        invalid: componentInvalid,
      },
      () => minLengthValidation && minLengthValidation(componentInvalid)
    );
  };

  onChange = event => {
    const { onChange, minLengthValidation } = this.props;

    if (!onChange) {
      return;
    }

    const { value } = event.target;

    if (minLengthValidation) {
      this.isValid(value);
    }

    return onChange(value);
  };

  onClick = event => {
    const { onClick } = this.props;
    if (!onClick) {
      return;
    }
    this.setFocus();
    onClick(event);

    return this.setFocus();
  };

  render() {
    const { focused, invalid, invalidMsg } = this.state;
    const {
      type,
      id,
      value,
      label,
      placeholder,
      disabled,
      mask,
      maxLength,
      minLength,
      showCounter,
      loading,
      showCounterOnFocusOnly,
    } = this.props;
    const { conformedValue } = (value && mask && conformToMask(value, mask)) || {};

    let containerClasses = 'input-container';

    if (focused) {
      containerClasses += ' focused';
    }

    if (value) {
      containerClasses += ' has-value';
    }

    if (invalid || this.props.invalid) {
      containerClasses += ' invalid';
    }

    const inputProps = {
      type,
      id,
      name: id,
      value: value ? (value && mask ? conformedValue : value) : '',
      placeholder,
      onFocus: this.setFocus,
      onBlur: this.setBlur,
      onChange: this.onChange,
      disabled: disabled,
      maxLength: maxLength,
      minLength: minLength,
    };

    const counterVisible = showCounter && maxLength && value && value.length > 0;

    return (
      <div className={ containerClasses } onClick={ this.onClick }>
        {mask ? <MaskedInput { ...inputProps } mask={ mask } /> : <input { ...inputProps } />}

        {label && <Label htmlFor={ id }>{label}</Label>}

        {invalid || this.props.invalid && (
          <label htmlFor={ id } className="input-validate">
            { invalidMsg }
          </label>
        )}

        {counterVisible && (!showCounterOnFocusOnly || focused) && (
          <Counter value={ value.length } max={ parseInt(maxLength, 10) } />
        )}

        {loading && (
          <div className="loader-container">
            <Loader size={ 20 } />
          </div>
        )}

        <style jsx>{`
          .input-container,
          .input-container :global(input) {
            height: 50px;
            width: 100%;
          }

          .input-validate {
            position: absolute;
            top: 50px !important;
            left: 2px !important;
            font-size: 11px !important;
            color: #e53935;
            font-size: 11px;
            font-weight: bold;
            margin-top: 5px;
          }

          .input-container {
            display: block;
            position: relative;
          }

          .input-container :global(label),
          .input-container :global(input),
          .input-container :global(input:-webkit-autofill) {
            color: #666;
            font-size: 17px;
            transition: 0.2s;
          }

          .input-container :global(input[type='time']) {
            -webkit-appearance: none;
            padding: 0 10px;
          }

          .input-container :global(input[type='time']::-webkit-outer-spin-button),
          .input-container :global(input[type='time']::-webkit-inner-spin-button) {
            -webkit-appearance: none;
            margin: 0;
          }

          .input-container :global(input[type='time']::-webkit-clear-button) {
            -webkit-appearance: none;
            display: none;
          }

          .input-container :global(input:-webkit-autofill),
          .input-container :global(input:-webkit-autofill:focus) {
            box-shadow: 0 0 0 30px white inset;
          }

          .input-container :global(label) {
            position: absolute;
            top: 16px;
            left: 14px;
            transition: 0.2s;
          }

          .input-container.has-value :global(label) {
            font-size: 12px;
            top: 7px;
          }

          .input-container.has-value.focused:not(.invalid) :global(label) {
            color: #1e88e5;
          }

          .input-container :global(input) {
            background: none;
            border: 2px solid #e9e9e9;
            border-radius: 3px;
            padding: 0 12px;
            color: #666;
            font-family: sans-serif, Helvetica Neue, Helvetica, Arial;
            font-size: 17px;
          }

          .input-container :global(input[disabled]) {
            background: #e9e9e9;
            opacity: 0.4;
          }

          .input-container :global(input[disabled]) ~ :global(label) {
            opacity: 0.4;
          }

          .input-container.focused :global(input) {
            border-color: #1e88e5;
            box-shadow: 0 0 1px 0 #1e88e5;
          }

          .input-container.has-value :global(input) {
            padding-top: ${label ? '12px' : 0};
          }

          .input-container.invalid :global(label),
          .input-container.invalid :global(input) {
            color: #e53935;
            border-color: #e53935;
          }

          .input-container.invalid :global(input) {
            box-shadow: 0 0 1px 0 #e53935;
          }

          .loader-container {
            position: absolute;
            right: 12px;
            top: 0;
            bottom: 0;
            margin: auto;
            width: 20px;
            height: 20px;
          }

          @media (max-width: 960px) {
            .input-container :global(input[type='time']) {
              padding: 0 4px;
              text-align: center;
            }
          }

          @media (max-width: 350px) {
            .input-container :global(input[type='time']) {
              font-size: 16px;
            }
          }
        `}</style>
      </div>
    );
  }
}
