import { Component } from 'react';
import { object, func, bool, number } from 'prop-types';
import stringToColor from 'string-to-hex-color';
import AvatarEditor from 'react-avatar-editor';

import Button from './form/button';
import Modal from './modal';
import Snackbar from './snackbar';
import { orientation } from '../services/drive';
import ProgressCircle from './form/progress-circle';

const getFirstLetter = fullname => {
  if (!fullname) {
    return '';
  }

  return fullname[0].toUpperCase();
};

/**
 * @class Avatar
 * @description Avatar component
 */
class AvatarContact extends Component {
  constructor(props) {
    super(props);

    // Initilize the files from props to state
    let files = [];

    this.state = {
      buttonDisabled: true,
      files,
      loading: false,
      modalOpen: false,
      image: null,
      allowZoomOut: false,
      position: { x: 0.5, y: 0.5 },
      scale: 1,
      rotate: 0,
      borderRadius: 200,
      preview: null,
      width: 200,
      height: 200,
    };
  
  }

  handleNewImage = e => {
    this.setState({ image: e.target.files[0] });
  }

  handleSave = () => {
    const img = this.editor.getImageScaledToCanvas().toDataURL();
    const { onChange } = this.props;
    
    if (!onChange) {
      return;
    }

    this.setState({
      modalOpen: !this.state.modalOpen,
      buttonDisabled: true,
    });

    return onChange(img);
  }

  handleScale = e => {
    const scale = parseFloat(e.target.value);
    this.setState({ scale });
  }

  handleAllowZoomOut = ({ target: { checked: allowZoomOut } }) => {
    this.setState({ allowZoomOut });
  }

  rotateLeft = e => {
    e.preventDefault();

    this.setState({
      rotate: this.state.rotate - 90,
    });
  }

  rotateRight = e => {
    e.preventDefault();
    this.setState({
      rotate: this.state.rotate + 90,
    });
  }

  handleBorderRadius = e => {
    const borderRadius = parseInt(e.target.value);
    this.setState({ borderRadius });
  }

  handleXPosition = e => {
    const x = parseFloat(e.target.value);
    this.setState({ position: { ...this.state.position, x } });
  }

  handleYPosition = e => {
    const y = parseFloat(e.target.value);
    this.setState({ position: { ...this.state.position, y } });
  }

  handleWidth = e => {
    const width = parseInt(e.target.value);
    this.setState({ width });
  }

  handleHeight = e => {
    const height = parseInt(e.target.value);
    this.setState({ height });
  }

  setEditorRef = editor => {
    if (editor) this.editor = editor;
  }

  handlePositionChange = position => {
    this.setState({ position });
  }

  handleDrop = acceptedFiles => {
    this.setState({ image: acceptedFiles[0] });
  }

  getProfileImageUrl = (customerId, imageDriveId) => {
    const { API_URL } = process.env;
    if (!customerId || !imageDriveId)
      return null;

    return `${API_URL}/v2/drive/profile-images/${customerId}/${imageDriveId}/default`;
  }

  toggle = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  };

  validator = blob => {
    const valid = /\.(jpe?g|png)$/i.test(blob.name);

    if (!valid) {
      this.showSnackbarMessage('Formato de imagem inválido.');
    }

    return valid;
  };

  showSnackbarMessage = text => {
    return this.snackbar && this.snackbar.show(text);
  };

  uploadFile = async event => {
    event.preventDefault();

    const { files, rotate } = this.state;
    const {
      files: [file],
    } = event.target;

    const isValid = await this.validator(file);

    if (!isValid) {
      return;
    }

    // Verify duplicate files
    if (files.some(f => f.name === file.name)) {
      return;
    }

    const rotation = await orientation(file);

    this.setState({
      modalOpen: !this.state.modalOpen,
      buttonDisabled: false,
      imageName: file.name,
      image: rotation.base64img
    });

    if(rotation)
      this.setState({
        rotate: rotate + rotation.rotation
      });

  }

  render() {
    const { contact, isSaving, onProgress } = this.props;
    const { modalOpen, buttonDisabled } = this.state;
    const [ backgroundColor ] = stringToColor(contact._id);
    const imageDriveId = contact.imageDriveId[0];
    const parentId = contact.parent_id;

    return (
      <div>

        <Modal className="modal" isOpen={ modalOpen } onClose={ () => this.toggle() }>
          <div className="mobilePadding">
            <AvatarEditor
              ref={ this.setEditorRef }
              scale={ parseFloat(this.state.scale) }
              width={ this.state.width }
              height={ this.state.height }
              position={ this.state.position }
              onPositionChange={ this.handlePositionChange }
              rotate={ parseFloat(this.state.rotate) }
              borderRadius={ this.state.width / (100 / this.state.borderRadius) }
              image={ this.state.image }
            />
          </div>
          <div className="mobilePadding">
            <input type="range" onChange={ this.handleScale } min="1"  max="2" name="scale" step="0.01" defaultValue="1" />
          </div>
          <div className="mobilePadding">
            <button className="mobilePaddingButton" onClick={ this.rotateLeft } >
              <img src="./../static/icons/rotate_left.svg" />
            </button>
            <button className="mobilePaddingButton" onClick={ this.rotateRight } >
              <img src="./../static/icons/rotate_right.svg" />
            </button>
          </div>
          <div>
            <Button
              onClick={ this.handleSave }
              loading={ isSaving }
              disabled={ isSaving || buttonDisabled }
            >
              Salvar
            </Button>
          </div>
        </Modal>

        {isSaving ? <ProgressCircle /> : (
          onProgress === undefined ? (
            <label>
              { imageDriveId ? <a><img className="image-avatar" src={ this.getProfileImageUrl(parentId, imageDriveId) }/></a> : <div style={{ backgroundColor }} className="frame-avatar" ><a><div className="frame-first-letter"> { getFirstLetter(contact.name) } </div></a></div> }
              <input
                type="file"
                name={ `file_upload_avatar` }
                accept="image/*"
                onChange={ this.uploadFile }
              />
            </label>  
          ) : (
            <div className="frame-avatar">
              <ProgressCircle
                progress={ 100 }
                size={ 150 }
                backgroundColor="#FFF"
              />
            </div>
          )
        )}
       
        <Snackbar key="snackbar-savebtn" ref={ elm => (this.snackbar = elm) } />

        <style jsx global>{`
          .modal {
            text-align: center;
          }

          .mobilePadding {
            padding: 0 0 20px 0;
          }

          .mobilePaddingButton {
            padding: 2px;
            margin: 0 5px;
            background-color: transparent;
            border: inherit;
            cursor: pointer;
          }

          input[type='file'] {
            height: 0;
            visibility: hidden;
            width: 0;
            opacity: 0;
          }

          .image-avatar {
            background-color: #fff;
            height: 150px;
            width: 150px;
            border-radius: 50%;
            box-shadow: 0 1px 5px rgba(0, 0, 0, .2), 0 2px 2px rgba(0, 0, 0, .14), 0 3px 1px -2px rgba(0, 0, 0, .12);
            position: relative;
            top: -90px;
            margin-bottom: -80px;
            text-align: center;
            object-fit: cover;
            cursor: pointer;
          }

          .frame-avatar {
            cursor: pointer;
            background-color: #fff;
            height: 150px;
            width: 150px;
            border-radius: 50%;
            position: relative;
            top: -90px;
            margin-bottom: -80px;
            margin: 0 auto -80px;
          }

          .frame-first-letter {
            color: #fff;
            display: block;
            font-size: 80px;
            font-style: normal;
            line-height: 150px;
            text-align: center;
            user-select: none;
          }

          .icon {
            margin: 0 15px;
          }
        `}</style>
      </div>
    );
  }
}

AvatarContact.propTypes = {
  contact: object,
  onChange: func,
  isSaving: bool,
  onProgress: number
};

export default AvatarContact;
