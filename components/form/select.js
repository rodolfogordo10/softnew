import { Component } from 'react';

import { shape, string, number, func, arrayOf, oneOfType, bool } from 'prop-types';

class Select extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    const { onChange } = this.props;
    const { value } = event.target;

    return onChange && onChange(value);
  }

  render() {
    const { _id, disabled, placeholder, items, value } = this.props;

    const selectId = `select_${_id}`;

    return (
      <div className="select-container input-container">
        <select
          className="input select"
          id={ selectId }
          name={ selectId }
          disabled={ disabled }
          value={ value ? value : '' }
          onChange={ this.onChange }
        >
          {placeholder && <option value="">{placeholder}</option>}

          {items &&
            items.map(option => (
              <option key={ `select_option_${option._id}` } value={ option.value }>
                {option.label}
              </option>
            ))}
        </select>

        <style jsx>{`
          .input {
            background: #fff;
            border: 2px solid #e8e8e8;
            border-radius: 3px;
            font-size: 16px;
            outline: none;
            padding: 10px 20px;
            width: 100%;
            height: 54px;
            margin: 0;
          }

          .input,
          .select {
            -webkit-appearance: none;
          }

          .select-container {
            position: relative;
          }

          .input-container {
            width: 100%;
            max-width: 380px;
          }

          .select-container::before {
            content: '';
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 6px solid rgba(0, 0, 0, 0.2);
            position: absolute;
            right: 15px;
            top: 0;
            bottom: 0;
            margin: auto;
          }
        `}</style>
      </div>
    );
  }
}

Select.propTypes = {
  _id: string.isRequired,
  items: arrayOf(
    shape({
      _id: string.isRequired,
      label: string.isRequired,
      value: oneOfType([string.isRequired, number.isRequired]),
    })
  ).isRequired,
  value: string,
  placeholder: string,
  onChange: func,
  disabled: bool,
};

Select.defaultProps = {
  disabled: false,
};

export default Select;
