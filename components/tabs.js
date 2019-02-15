import { Component } from 'react';
import { array, bool, func } from 'prop-types';

export default class Tabs extends Component {
  static propTypes = {
    tabs: array.isRequired,
    isMobile: bool,
    onClick: func
  };

  tabChange = tab => {
    this.props.onClick(tab.id);
  };

  renderContent = () => {
    const tab = this.props.tabs.find(tab => tab.isActive);

    return (
      <div className="content">
        {tab.content}
        <style jsx>{`
          .content {
            margin-top: 30px;
          }
        `}</style>
      </div>
    );
  };

  render() {
    return (
      <div>
        <ol className="center">
          {this.props.tabs.map(tab => {
            return (
              <li
                key={ tab.id }
                onClick={ () => this.tabChange(tab) }
                className={ `tab-list-item ${tab.isActive ? 'tab-list-active' : ''}` }
              >
                {tab.name}
              </li>
            );
          })}
        </ol>
        {this.renderContent()}
        <style jsx>{`
          .center {
            padding: 0;
            margin: auto;
            text-align: center;
          }

          .tab-list-item {
            display: inline-block;
            list-style: none;
            font-size: 15px;
            font-weight: bold;
            padding: 14px 17px;
            cursor: pointer;
            color: #6A8C92;
            min-width: 20%;
          }

          .tab-list-active {
            color: #1e88e5;
            border-bottom: 2px solid #1e88e5;
          }
        `}</style>
      </div>
    );
  }
}
