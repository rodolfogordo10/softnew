import { Component } from 'react';
import { string, func, bool, array } from 'prop-types';

/**
 * Components
 */
import Input from './input';

export default class SocialMediaInput extends Component {
  static propTypes = {
    id: string.isRequired,
    type: string,
    value: string,
    label: string,
    onChange: func,
    onBlur: func,
    onFocus: func,
    onClick: func,
    invalid: bool,
    disabled: bool,
    mask: array,
    maxLength: string,
    minLength: string,
    minLengthValidation: func,
    iconName: string,
  };

  static defaultProps = {
    type: 'url',
    invalid: false,
  };

  state = {
    focused: false,
    invalid: this.props.invalid,
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

  onChange = value => {
    const { onChange, minLengthValidation } = this.props;

    if (!onChange) {
      return;
    }

    if (minLengthValidation) {
      this.isValid(value);
    }

    return onChange(value);
  };

  render() {
    const { type, id, value, label, disabled, invalid, maxLength, minLength, iconName } = this.props;

    const inputProps = {
      type,
      id,
      name: id,
      value: value ? value : '',
      onChange: this.onChange,
      placeholder: label,
      invalid,
      disabled,
      maxLength,
      minLength,
    };

    return (
      <div className={ `wrapper ${invalid ? 'invalid' : ''}` }>
        <Input { ...inputProps } />
        <i className={ `icon ${iconName}` } aria-hidden="true" />

        <style jsx>{`
          .wrapper {
            position: relative;
          }

          .wrapper :global(.input-container input) {
            padding-left: 50px;
          }

          .wrapper.invalid :global(.input-container input) {
            border-color: #e53935;
            box-shadow: 0 0 1px 0 #e53935;
          }

          .icon {
            display: block;
            width: 1em;
            height: 1em;
            position: absolute;
            left: 10px;
            top: 0;
            bottom: 0;
            margin: auto;
          }
        `}</style>
      </div>
    );
  }
}
