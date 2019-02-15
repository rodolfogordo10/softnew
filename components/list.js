import {
  arrayOf,
  node,
  func,
  bool
} from 'prop-types';

const List = ({ children, onItemClick, isLoading, isMobile }) => {
  return (
    <ul className="list-container">
      {
        !isLoading && (
          children.map((item, index) => (
            <li key={ index }
              className={ `${children.length > 1 && index !== children.length - 1 ? 'divider' : ''}` }
              onClick={ () => onItemClick && onItemClick(item.props, isMobile) }>
              <div className="list-item-container">
                { item }
              </div>
            </li>
          ))
        )
      }

      <style jsx>{`
        ul {
          box-shadow: 0 1px 5px rgba(0, 0, 0, .2),
            0 2px 2px rgba(0, 0, 0, .14),
            0 3px 1px -2px rgba(0, 0, 0, .12);
          margin: 0;
          padding: 0;
          padding-top: 8px;
          background-color: #FFFFFF;
        }

        li {
          background: #fff;
          display: table;
          min-height: 72px;
          list-style: none;
          transition: background .2s;
          width: 100%;
        }

        li:hover {
          background: hsla(0, 0%, 60%, .2);
          cursor: pointer;
        }

        li.divider {
          border-bottom: 1px solid rgba(0, 0, 0, .12);
        }

        .list-item-container {
          display: table-cell;
          padding: 0 16px;
          text-align: left;
          vertical-align: middle;
        }
  
      `}</style>
    </ul>
  );
};

List.propTypes = {
  children: arrayOf(node).isRequired,
  onItemClick: func,
  isLoading: bool,
  isMobile: bool
};

export default List;
