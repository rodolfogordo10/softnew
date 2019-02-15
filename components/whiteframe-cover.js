import { node, bool } from 'prop-types';
import RenderIf from './renderif';

/**
 * @description Whiteframe – Box with a shadow in the desktop viewport
 */
const Whiteframe = ({ children, isMobile }) => (
  <div className="wrapper">
    <RenderIf condition={ !isMobile }>
      <div className="back-page">
        <a href="javascript:history.back()">
          <img src="../static/icons/backspace-black.svg" alt="Menu" width="18" height="18" />
        </a>
      </div>
    </RenderIf>
    <div className="cover"></div>
    <div className="whiteframe-cover">
      {children}
    </div>

    <style jsx>{`
      .back-page {
        text-align: left;
        padding: 10px;
        background: #FFFFFF;
      }

      .back-page a {
        background-color: #F2F2F2;
        border-radius: 50%;
        color: #666;
        transition: all 0.1s ease-in-out;
        text-decoration:none; 
        font-size: 26px;
        padding: 0 8px;
        padding-bottom: 2px;
        cursor: pointer;
      }
        
      .back-page a:hover {
        box-shadow: 0 2px 5px 0 #666;
        transform: scale(0.2);
      }

      .wrapper {
        margin: 0 auto;
        max-width: 100%;
        background: #fff;
        box-shadow: 0 1px 5px rgba(0,0,0,.2), 0 2px 2px rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12);
      }

      .cover {
        background: url('/static/default-cover.png') repeat 50% 50% #6A8C92;
        background-size: 50%;
        height: 110px;
      }

      .whiteframe-cover {
        padding: 10px 25px;
      }

      @media (max-width: 768px) {
        .wrapper {
          box-shadow: none;
        }

        .whiteframe-cover {
          padding: 0;
        }
      }
    `}</style>
  </div>
);

Whiteframe.propTypes = {
  children: node.isRequired,
  isMobile: bool
};

export default Whiteframe;
