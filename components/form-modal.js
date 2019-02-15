import { Component } from 'react';
import { node } from 'prop-types';

/**
 * Components
 */
import Modal from './modal';

export default class FormModal extends Component {
  state = {
    modalOpen: false,
  };

  static propTypes = {
    children: node.isRequired,
  };

  toggle = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  };

  render() {
    return (
      <div className="row-help">
        <a className="link-help" href="javascript:void(0);" onClick={ this.toggle }>
          Ajuda
        </a>

        <Modal isOpen={ this.state.modalOpen } onClose={ () => this.toggle() }>
          {this.props.children}
        </Modal>

        <style jsx>{`
          .row-help {
            text-align: center;
            margin: -25px 0 20px;
          }

          .link-help {
            font-size: 15px;
            line-height: 1.5;
            color: #1e88e5;
            text-decoration: underline;
          }

          .link-help:hover {
            text-decoration: none;
          }
        `}</style>
      </div>
    );
  }
}
