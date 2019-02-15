import { Component } from 'react';

class NavClose extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="headerClose">
          <a href="javascript:history.back()">
            <img src="../static/icons/clear.svg" alt="Fechar" />
          </a>
        </div>
        <style jsx global>{`
          .headerClose {
            width: 100%;
            height: 64px;
            border-bottom: 1px solid #f3ecec;
            padding: 12px 24px;
            display: flex;
            align-items: center;
            background-color: #FFF;
          }
        `}</style>
      </div>
    );
  }
}

export default NavClose;
