import { Component } from 'react';
import { string, func, bool } from 'prop-types';

import Input from './input';
import { cep } from '../../utils/masks';
import { searchCep } from '../../services/address';

class Cep extends Component {
  state = {
    isValid: true,
    changed: false,
  };

  /**
   * @function onChange
   * @description Handles the input value to get the cep infos
   * @param  {String} value Value of the input
   */
  onChange = async value => {
    const { onChange, onInitSearch, onFinishSearch } = this.props;

    if (onChange) {
      onChange(value);
    }

    // Reset valid state
    this.setState({ isValid: true, changed: true });

    if (value && /^\d{5}-\d{3}$/.test(value)) {
      if (onInitSearch) {
        onInitSearch();
      }

      const cepData = await this.validate(value);
      onFinishSearch(cepData);

      this.setState({ changed: false });
    }
  };

  onBlur = async () => {
    const { onBlur, value, onInitSearch, onFinishSearch } = this.props;

    if (onBlur) {
      onBlur(value);
    }

    if (this.state.changed) {
      if (onInitSearch) {
        onInitSearch();
      }

      const cepData = await this.validate(value);
      onFinishSearch(cepData);
    }

    this.setState({ changed: false });
  };

  validate = async value => {
    try {
      const cepData = await searchCep(value);
      const isValid = cepData && !cepData.erro;

      this.setState({ isValid });

      return cepData;
    } catch (err) {
      this.setState({ isValid: false });
    }

    this.setState({ isValid: false });
    return false;
  };

  render() {
    const { id, value, label, disabled } = this.props;
    const { isValid } = this.state;
    const inputId = `input_${id}`;
    const showValidation = !disabled && !isValid;

    const inputProps = {
      id: inputId,
      name: inputId,
      value: value ? value : '',
      type: 'tel',
      mask: cep,
      label,
      disabled,
      onChange: this.onChange,
      onBlur: this.onBlur,
    };

    // Return input mask component
    return (
      <div className={ `input-container ${showValidation ? ' invalid' : ''}` }>
        <Input { ...inputProps } />

        {showValidation && (
          <label htmlFor={ inputId } className="input-validate">
            CEP inválido.
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

          .input-container {
            width: 100%;
            max-width: 640px;
          }
        `}</style>
      </div>
    );
  }
}

Cep.propTypes = {
  id: string.isRequired,
  value: string,
  label: string,
  onChange: func,
  onBlur: func,
  onInitSearch: func,
  onFinishSearch: func,
  disabled: bool,
};

Cep.defaultProps = {
  value: '',
  disabled: false,
};

export default Cep;
