import {
  func,
  string
} from 'prop-types';
import { Component } from 'react';
import TextArea from './form/textarea';

/**
 * @class TimelineTextarea
 */
class TimelineTextarea extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.enter = this.enter.bind(this);
    this.save = this.save.bind(this);

  }

  handleChange = (value) => {
    this.props.onChange(value);
  };

  /**
   * @function noEnter
   * @description Calls the onKeyPress event
   * @param  {Object} event onKeyPress event
   */
  enter (event) {
    if (event.key === 'Enter') {
      event.preventDefault();

      if (event.target.value.length < 3)
        return false;

      window.scrollTo(0, 0);

      const { onSubmit } = this.props;
      return onSubmit();
    }
  }

  save () {
    if (this.props.textComment.length < 1)
      return false;

    window.scrollTo(0, 0);

    const { onSubmit } = this.props;
    return onSubmit();
  }

  render() {
    return (
      <div className="timeline-comment">
        <div className="timeline-comment-div">
          <div className="text-area-comment">
            <form onKeyPress={ this.enter }>
              <TextArea
                _id="textComment"
                name="textComment"
                placeholder="Escreva um comentário"
                value={ this.props.textComment }
                onChangeText={ val => this.handleChange(val) }
              />
            </form>
          </div>
          <div className="button-send-div">
            <button className={ `button-send ${ !this.props.textComment ? 'disabled' : 'notDisabled' }` } disabled={ !this.props.textComment } onClick={ this.save } >
              <img src="../static/icons/send-white.svg" alt="Enviar" width="20" height="20" />
            </button>
          </div>
        </div>
      
        <style jsx>{`

          .timeline-comment {
            padding : 0 10px;
          }

          .timeline-comment-div {
            align-items: flex-end;
            box-sizing: border-box;
            display: -webkit-flex;
            display: flex;
            -webkit-flex-direction: row;
            flex-direction: row;
            max-width: 100%;
            min-height: 54px;
            position: relative;
            z-index: 2;
          }

          .timeline-comment-div .text-area-comment {
            background-color: #ffffff;
            padding: 9px 0;
            width: 85%;
          }

          .timeline-comment-div .button-send-div {
            padding: 5px 10px;
            width: 10%;
            margin-bottom: 15px;
          }

          .button-send img {
            position: inherit;
          }

          .button-send-div .button-send {
            border-radius: 25px;
            border-style: inherit;
            padding: 10px;
            line-height: 0;
          }

          .button-send-div .notDisabled {
            background-color: #1e88e5 !important;
            border-color: #1e88e5 !important;
          }

          .button-send-div .disabled {
            background-color: #F2F2F2 !important;
            border-color: #F2F2F2 !important;
          }

        `}</style>
      </div>
    );
  }
}

TimelineTextarea.propTypes = {
  onSubmit: func.isRequired,
  onChange: func.isRequired,
  textComment: string
};

export default TimelineTextarea;
