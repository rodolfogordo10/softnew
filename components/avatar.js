import { Component } from 'react';
import { string } from 'prop-types';
import stringToColor from 'string-to-hex-color';

const getProfileImageUrl = (customerId, imageDriveId) => {
  const { API_URL } = process.env;
  if (!customerId || !imageDriveId)
    return null;

  return `${API_URL}/v2/drive/profile-images/${customerId}/${imageDriveId}/default`;
};

const getFirstLetter = fullname => {
  if (!fullname) {
    return '';
  }

  return fullname[0].toUpperCase();
};

class Avatar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { imageId, parentId, firstLetter, fullLetter } = this.props;
    const [ backgroundColor ] = fullLetter ? stringToColor(fullLetter) : '#6a8c92';

    return (
      <div style={{ backgroundColor }} className="avatar">

        { imageId ? <img src={ getProfileImageUrl(parentId, imageId) }/> : <div className="first-letter"> { getFirstLetter(firstLetter) } </div> }

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

Avatar.propTypes = {
  imageId: string,
  parentId: string,
  firstLetter: string,
  fullLetter: string,
};

export default Avatar;
