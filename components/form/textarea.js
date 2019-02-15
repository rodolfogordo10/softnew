import { Component, createRef } from 'react';
import { string, func, bool } from 'prop-types';
import autosize from 'autosize';

class Textarea extends Component {
  constructor(props) {
    super(props);

    this.state = {
      placeholder: props.placeholder,
      rows: 1,
      minRows: 1,
      maxRows: 10
    };

    this.textareaRef = createRef();

    this.onFocus = this.onFocus.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  componentDidMount() {
    if (!this.textareaRef || !this.textareaRef.current) {
      return;
    }

    autosize(this.textareaRef.current);
  }

  onFocus() {
    return this.setState({
      placeholder: '',
    });
  }

  componentDidUpdate() {
    autosize.update(this.textareaRef.current);
  }

  /**
   * @function onChange
   * @description Emits the event of change to its parent
   * @param  {Object} event DOM event
   */
  onChange(event) {
    const { onChangeText } = this.props;
    const { value } = event.target;

    return onChangeText && onChangeText(value);
  }

  /**
   * @function onBlur
   * @description Emits the event of blur to its parent
   * @param  {Object} event DOM event
   */
  onBlur(event) {
    const { onChange, placeholder } = this.props;
    const { value } = event.target;

    return this.setState(
      {
        placeholder,
      },
      () => {
        return onChange && onChange(value);
      }
    );
  }

  render() {
    const { _id, disabled, value } = this.props;
    const { placeholder, rows } = this.state;
    const textareaId = `textarea_${_id}`;

    return (
      <div className="divTextarea">
        <textarea
          ref={ this.textareaRef }
          className="textarea"
          rows={ rows }
          id={ textareaId }
          name={ textareaId }
          value={ value }
          placeholder={ placeholder }
          disabled={ disabled }
          onFocus={ this.onFocus }
          onChange={ this.onChange }
          onBlur={ this.onBlur }
        />

        <style jsx>{`
          .divTextarea {
            width: 100%;
          }

          .textarea {
            width: 100%;
            margin: 0;
            resize: vertical;
            border: 2px solid #e9e9e9;
            padding: 12px;
            color: #666;
            font-family: sans-serif, Helvetica Neue, Helvetica, Arial;
            font-size: 17px;
            border-radius: 15px;
          }

          textarea:focus { 
            outline: none !important;
            border-color: #1e88e5  !important;
            box-shadow: 0 0 10px #1e88e5 !important;
            border-radius: 15px !important;
          }
        `}</style>
      </div>
    );
  }
}

Textarea.propTypes = {
  _id: string.isRequired,
  value: string,
  placeholder: string,
  onChange: func,
  onChangeText: func,
  disabled: bool
};

Textarea.defaultProps = {
  value: '',
  disabled: false,
};

export default Textarea;
