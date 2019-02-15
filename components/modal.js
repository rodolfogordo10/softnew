import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import { bool, node, func } from 'prop-types';

class ModalWrapper extends Component {
  static propTypes = {
    children: node,
  };

  componentDidMount() {
    this.element = document.getElementById('modal');
  }

  render() {
    if (this.element === undefined) {
      return null;
    }

    return createPortal(this.props.children, this.element);
  }
}

class Modal extends Component {
  static propTypes = {
    isOpen: bool,
    children: node.isRequired,
    onClose: func.isRequired,
  };

  handleClose = e => {
    e.preventDefault();

    return this.props.onClose();
  };

  render() {
    const { isOpen, children } = this.props;

    return (
      <ModalWrapper>
        {!isOpen ? null : (
          <div className="modal">
            <div className="modal-content">
              <div className="header">
                <button className="button-close" onClick={ e => this.handleClose(e) }>
                  <img src="/static/icons/clear.svg" alt="Fechar" />
                </button>
                <span className="help-label only-mobile">Foto</span>
              </div>

              <div className="text-content">
                {children}
              </div>
            </div>

            <div className="modal-overlay" onClick={ e => this.handleClose(e) } />

            <style jsx>{`
              .only-mobile {
                display: none;
              }

              .modal {
                overflow: hidden;
                display: flex;
                align-items: center;
              }

              .modal,
              .modal-overlay {
                position: fixed;
                z-index: 10;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
              }

              .modal-overlay {
                background: rgba(0, 0, 0, 0.6);
                z-index: 9;
              }

              .modal-content {
                background: #fff;
                width: 100%;
                max-width: 600px;
                padding: 60px;
                position: relative;
                z-index: 10;
                margin: auto;
              }

              .text-content {
                text-align: center;
              }

              .button-close {
                background: transparent;
                border: none;
                cursor: pointer;
                outline: none;
                padding: 0;
                position: absolute;
                right: 10px;
                top: 10px;
              }

              .button-close:hover {
                opacity: 0.5;
              }

              .button-close img {
                display: block;
                height: 32px;
                width: 32px;
              }

              @keyframes modal-fade {
                from {
                  opacity: 0;
                }
                to {
                  opacity: 1;
                }
              }

              @media (min-width: 769px) {
                .modal-content {
                  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
                  border-radius: 2px;
                }
              }

              @media (max-width: 768px) {
                .modal {
                  animation-name: modal-fade;
                  animation-duration: 0.5s;
                }

                .only-mobile {
                  display: block;
                }

                .header {
                  width: 100%;
                  height: 64px;
                  border-bottom: 1px solid #f3ecec;
                  padding: 12px 16px;
                  display: flex;
                  align-items: center;
                }

                .help-label {
                  display: block;
                  font-size: 18px;
                  margin: auto;
                }

                .modal-content {
                  padding: 0;
                  width: 100%;
                  height: 100%;
                  left: 0;
                  top: 0;
                }

                .text-content {
                  padding: 20px;
                }

                .button-back {
                  outline: none;
                  margin-top: 25px;
                }

                .button-close {
                  padding: 20px;
                  height: 64px;
                  width: 64px;
                  left: 0;
                  top: 0;
                }

                .button-close img {
                  height: 24px;
                  width: 24px;
                }
              }
            `}</style>
          </div>
        )}
      </ModalWrapper>
    );
  }
}

export default Modal;
