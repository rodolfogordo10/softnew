import { Fragment } from 'react';
import {
  string,
  number,
  array
} from 'prop-types';

import Avatar from './avatar';

const createMarkup = (description) => {
  return {__html: description}; 
};

const TimelineItem = ({ create_date, description, imageDriveId, fullname, nickname, parent_id, possition }) => {

  const align = possition % 2 == 0 ? 'vertical-timeline-element vertical-timeline-element--left' : 'vertical-timeline-element vertical-timeline-element--right';

  const imageId = Array.isArray(imageDriveId) ? imageDriveId[0] : null;
  const parentId = Array.isArray(parent_id) ? parent_id[0] : null;
  let name = Array.isArray(nickname) ? nickname[0] : null;
  name = name ? name : Array.isArray(fullname) ? fullname[0] : null;

  if (name.length > 20)
    name = name.substring(0,20) + '...';

  return (
    <Fragment>
      <div className={ align } >
        <div>
          <span className="vertical-timeline-element-icon">
            <Avatar parentId={ parentId } imageId={ imageId } firstLetter={ name } fullLetter={ name } ></Avatar>
          </span>
          <div className="vertical-timeline-element-content bounce-in" >
            <span className="description" dangerouslySetInnerHTML={ createMarkup(description) } ></span>
            <span className="vertical-timeline-element-date bounce-in">
              { create_date } - { name }
            </span>
          </div>
        </div>
        <style jsx>{`
          .vertical-timeline-element {
            position: relative;
            margin: 2em 0;
          }
          .vertical-timeline-element > div {
            min-height: 1px;
          }
          .vertical-timeline-element:after {
            content: "";
            display: table;
            clear: both;
          }
          .vertical-timeline-element:first-child {
            margin-top: 0;
          }
          .vertical-timeline-element:last-child {
            margin-bottom: 0;
          }
          @media screen and (min-width: 1170px) {
            .vertical-timeline-element {
              margin: 4em 0;
            }
            .vertical-timeline-element:first-child {
              margin-top: 0;
            }
            .vertical-timeline-element:last-child {
              margin-bottom: 0;
            }
          }

          .vertical-timeline-element-icon {
            position: absolute;
            top: 0;
            left: 0;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            box-shadow: 0 0 0 4px #F2F2F2, inset 0 2px 0 rgba(0, 0, 0, 0.08), 0 3px 0 4px rgba(0, 0, 0, 0.05);
          }

          .vertical-timeline-element-icon svg {
            display: block;
            width: 24px;
            height: 24px;
            position: relative;
            left: 50%;
            top: 50%;
            margin-left: -12px;
            margin-top: -12px;
          }

          @media screen and (min-width: 1170px) {
            .vertical-timeline-element-icon {
              width: 40px;
              height: 40px;
              left: 50%;
              margin-left: -20px;
            }
          }

          /* Icon animations */
          .vertical-timeline-element-icon {
            /* Force Hardware Acceleration in WebKit */
            -webkit-transform: translateZ(0);
            -webkit-backface-visibility: hidden;
          }
          .vertical-timeline--animate .vertical-timeline-element-icon.is-hidden {
            visibility: hidden;
          }
          .vertical-timeline--animate .vertical-timeline-element-icon.bounce-in {
            visibility: visible;
            -webkit-animation: cd-bounce-1 0.6s;
            -moz-animation: cd-bounce-1 0.6s;
            animation: cd-bounce-1 0.6s;
          }

          .vertical-timeline-element-content {
            position: relative;
            margin-left: 50px;
            margin-right: 8px;
            background: #F2F2F2;
            border-radius: 15px;
            padding: 1em;
            box-shadow: 0 3px 0 #ddd;
          }
          .vertical-timeline-element--no-children .vertical-timeline-element-content {
            background: transparent;
            box-shadow: none;
          }
          .vertical-timeline-element-content:after {
            content: "";
            display: table;
            clear: both;
          }
          
          .vertical-timeline-element-content span, .vertical-timeline-element-content .vertical-timeline-element-date {
            font-size: 13px;
            font-weight: 500;
            color: #515151;
          }
          .vertical-timeline-element-content .vertical-timeline-element-date {
            display: inline-block;
            text-align: left;
          }
          .vertical-timeline-element-content .description {
            line-height: 1.6;
            width: 100%;
            text-align: left;
            padding: 0;
            font-size: 14px;
            display: block;
            margin: 0;
          }

          .vertical-timeline-element-title {
            margin: 0;
          }

          .vertical-timeline-element-subtitle {
            margin: 0;
          }

          .vertical-timeline-element-content .vertical-timeline-element-date {
            float: left;
            padding: .8em 0;
            opacity: .7;
          }
          .vertical-timeline-element-content::before {
            content: '';
            position: absolute;
            top: 16px;
            right: 100%;
            height: 0;
            width: 0;
            border: 7px solid transparent;
            border-right: 7px solid #F2F2F2;
          }
          .vertical-timeline-element--no-children .vertical-timeline-element-content::before {
            display: none;
          }
          @media only screen and (min-width: 768px) {
            .vertical-timeline-element-content span {
              font-size: 13px;
            }
            .vertical-timeline-element-content .vertical-timeline-element-date {
              font-size: 13px;
            }
          }
          @media only screen and (min-width: 1170px) {
            .vertical-timeline-element-content {
              margin-left: 0;
              padding: 1.5em;
              width: 40%;
            }
            .vertical-timeline-element-content::before {
              top: 15px;
              left: 100%;
              border-color: transparent;
              border-left-color: #F2F2F2;
            }

            .vertical-timeline-element-content .vertical-timeline-element-date {
              position: absolute;
              width: 100%;
              left: 150%;
              top: 0px;
              font-size: 13px;
            }

            .vertical-timeline-element:nth-child(even):not(.vertical-timeline-element--left) .vertical-timeline-element-content,
            .vertical-timeline-element.vertical-timeline-element--right .vertical-timeline-element-content {
              float: right;
            }
            .vertical-timeline-element:nth-child(even):not(.vertical-timeline-element--left) .vertical-timeline-element-content::before,
            .vertical-timeline-element.vertical-timeline-element--right .vertical-timeline-element-content::before {
              top: 15px;
              left: auto;
              right: 100%;
              border-color: transparent;
              border-right-color: #F2F2F2;
            }

            .vertical-timeline-element:nth-child(even):not(.vertical-timeline-element--left) .vertical-timeline-element-content .vertical-timeline-element-date,
            .vertical-timeline-element.vertical-timeline-element--right .vertical-timeline-element-content .vertical-timeline-element-date {
              left: auto;
              right: 150%;
              text-align: right;
            }
          }

          /* Box animations */
          .vertical-timeline--animate .vertical-timeline-element-content.is-hidden {
            visibility: hidden;
          }
          .vertical-timeline--animate .vertical-timeline-element-content.bounce-in {
            visibility: visible;
            -webkit-animation: cd-bounce-2 0.6s;
            -moz-animation: cd-bounce-2 0.6s;
            animation: cd-bounce-2 0.6s;
          }

          @media only screen and (min-width: 1170px) {
            /* inverse bounce effect on even content blocks */
            .vertical-timeline--two-columns.vertical-timeline--animate .vertical-timeline-element:nth-child(even):not(.vertical-timeline-element--left) .vertical-timeline-element-content.bounce-in,
            .vertical-timeline--two-columns.vertical-timeline--animate .vertical-timeline-element.vertical-timeline-element--right .vertical-timeline-element-content.bounce-in {
              -webkit-animation: cd-bounce-2-inverse 0.6s;
              -moz-animation: cd-bounce-2-inverse 0.6s;
              animation: cd-bounce-2-inverse 0.6s;
            }
          }

          @media only screen and (max-width: 1169px) {
            .vertical-timeline--animate .vertical-timeline-element-content.bounce-in {
              visibility: visible;
              -webkit-animation: cd-bounce-2-inverse 0.6s;
              -moz-animation: cd-bounce-2-inverse 0.6s;
              animation: cd-bounce-2-inverse 0.6s;
            }
            
            .vertical-timeline-element-content .vertical-timeline-element-date {
              float: right;
            }

            .vertical-timeline-element-content .description {
              float: left;
            }
          }
        `}</style>
      </div>
    </Fragment>
  );
};

TimelineItem.propTypes = {
  index: number.isRequired,
  create_date: string.isRequired,
  description: string.isRequired,
  possition : number.isRequired,
  imageDriveId: array,
  customer_id: array,
  parent_id: array,
  nickname: array,
  fullname: array
};

export default TimelineItem;
