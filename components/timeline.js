import {
  arrayOf,
  node,
  bool
} from 'prop-types';

const Timeline = ({ children, isLoading }) => {
  return (
    <div className="vertical-timeline vertical-timeline--two-columns">
      {
        !isLoading && (
          children.map((item, index) => (
            <div key={ index } className="vertical-timeline-margin" >
              { item }
            </div>
          ))
        )
      }
    <style jsx>{`
      .vertical-timeline {
        width: 100%;
        max-width: 1170px;
        margin: auto;
        position: relative;
        padding: 1em 0;
      }

      .vertical-timeline-margin {
        margin: 20px 5px;
      }

      .vertical-timeline::after {
        /* clearfix */
        content: '';
        display: table;
        clear: both;
      }

      .vertical-timeline::before {
        /* this is the vertical line */
        content: '';
        position: absolute;
        top: 0;
        left: 23px;
        height: 100%;
        width: 4px;
        background: #F2F2F2;
      }

      @media only screen and (min-width: 1170px) {
        .vertical-timeline.vertical-timeline--two-columns {
          width: 100%;
        }
        .vertical-timeline.vertical-timeline--two-columns:before {
          left: 50%;
          margin-left: -2px;
        }
      }
    `}</style>
    </div>
  );
};

Timeline.propTypes = {
  children: arrayOf(node).isRequired,
  isLoading: bool
};

export default Timeline;
