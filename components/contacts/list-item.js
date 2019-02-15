import { Fragment } from 'react';
import {
  string,
  number,
  array
} from 'prop-types';

import Avatar from '../avatar';

/**
 * @function leftPadZero
 * @description Puts a `0` in front of the value if its length is just one character
 * @param  {String} value Value to left pad with `0`
 * @return {String} New string
 */
function leftPadZero(value) {
  if (value.length > 1) {
    return value;
  }

  return '0' + value;
}



/**
 * @function formatDate
 * @description Formats the date
 * @param  {String} date Date to format
 * @return {String} Formatted date
 */
const formatDate = date => {
  const formattedDate = new Date(date);
  const strDate = leftPadZero(formattedDate.getDate().toString());
  const strMonth = leftPadZero((formattedDate.getMonth() + 1).toString());
  const strHour = leftPadZero(formattedDate.getUTCHours().toString());
  const strMinutes = leftPadZero(formattedDate.getMinutes().toString());
  const strSeconds = leftPadZero(formattedDate.getSeconds().toString());

  const hours =`${strHour}:${strMinutes}:${strSeconds}`;

  return `${strDate}/${strMonth}/${formattedDate.getFullYear()} - ${hours}`;
};

const ContactsListItem = props => {
  
  const imageId = Array.isArray(props.imageDriveId) ? props.imageDriveId[0] : null;

  return (
    <Fragment>
      <div className="Contacts-list-item-index">
        <div >
          <Avatar parentId={ props.parent_id } imageId={ imageId } firstLetter={ (props.name || props.email) } fullLetter={ props._id } ></Avatar>
        </div>
      </div>
      <div className="Contacts-list-item-content">
        <span className="list-item-dynamic-container">
          <span className="list-item-dynamic-ellipsis">
            { props.name || props.email }
          </span>
        </span>
        <p>{ formatDate(props.createDate) }</p>
      </div>

      <style jsx global>{`
        .Contacts-list-item-index,
        .Contacts-list-item-content {
          box-sizing: border-box;
          display: block;
          float: left;
          user-select: none;
        }

        .Contacts-list-item-index,
        .Contacts-list-item-content {
          font-size: 16px;
          font-weight: 400;
        }

        .Contacts-list-item-index {
          line-height: 20px;
          text-align: center;
        }

        .Contacts-list-item-index > div {
          background: red;
          margin: 0 16px 0 0;
          width: 40px;
          min-width: 40px;
          height: 40px;
          min-height: 40px;
          display: inline-block;
          position: relative;
          border-radius: 40px;
          vertical-align: middle;
        }

        .Contacts-list-item-index i {
          color: #fff;
          display: block;
          font-size: 20px;
          font-style: normal;
          line-height: 40px;
          text-align: center;
        }

        .Contacts-list-item-content {
          line-height: 1.25em;
          white-space: normal;
          width: 80%;
        }

        .Contacts-list-item-content p {
          margin: 0;
          color: rgba(0,0,0,.54);
          font-size: 14px;
        }

        .list-item-dynamic-container {
          position: relative;
          max-width: 100%;
          padding: 0 !important;
          display: -webkit-flex;
          display: -moz-flex;
          display: flex;
          vertical-align: text-bottom !important;
        }

        .list-item-dynamic-ellipsis {
            position: absolute;
            white-space: nowrap;
            overflow-y: visible;
            overflow-x: hidden;
            text-overflow: ellipsis;
            -ms-text-overflow: ellipsis;
            -o-text-overflow: ellipsis;
            max-width: 100%;
            min-width: 0;
            width:100%;
            top: 0;
            left: 0;
        }

        .list-item-dynamic-container:after,
        .list-item-dynamic-ellipsis:after {
            content: '-';
            display: inline;
            visibility: hidden;
            width: 0;
        }
      `}</style>
    </Fragment>
  );
};

ContactsListItem.propTypes = {
  index: number.isRequired,
  name: string.isRequired,
  email: string,
  _id: string.isRequired,
  imageDriveId: array,
  parent_id: string,
  createDate: string.isRequired
};

export default ContactsListItem;
