import { Component } from 'react';
import { string } from 'prop-types';
import avatarColors from '../utils/avatar-colors';

class Apps extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { imageUrl, firstLetter } = this.props;
    const backgroundColor = avatarColors.letters[firstLetter];

    return (
      <div style={{ backgroundColor }} className="avatar">

        { imageUrl ? <img src={ imageUrl }/> : <div className="first-letter"> { firstLetter } </div> }

        <style jsx global>{`
          .avatar {
            max-width: 40px;
            max-height: 40px;
            width: 40px;
            height: 40px;
            border-radius: 40px;
            box-shadow: 0 1px 5px rgba(0,0,0,.2), 0 2px 2px rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12);
          }

          .avatar:hover{
            box-shadow: 0 3px 15px rgba(0,0,0,.3), 0 2px 2px rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12);
          }

          .first-letter {
            color: #fff;
            display: block;
            font-size: 20px;
            font-style: normal;
            line-height: 40px;
            text-align: center;
            user-select: none;
          }

          .avatar img{
            width: 100%;
            height: 100%;
            border-radius: 40px;
            object-fit: cover;
          }
        `}</style>
      </div>
    );
  }
}

Apps.propTypes = {
  imageUrl: string,
  firstLetter: string,
};

export default Apps;
