import { Component, Fragment } from 'react';
import { bool, func, node } from 'prop-types';

class RenderIf extends Component {

  componentDidMount() {
    if(this.props.onRender) {
      this.props.onRender();
    }
  }

  render() {
    return (
      <Fragment>
        {
          this.props.condition && this.props.children
        }
      </Fragment>
    );
  }
}

RenderIf.propTypes = {
  condition: bool,
  onRender: func,
  children: node.isRequired
};


export default RenderIf;
