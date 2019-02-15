import { Component, Fragment } from 'react';
import { arrayOf, object, string, func, bool, number } from 'prop-types';

/**
 * Components
 */
import LinkButton from './link-button';
import ProgressCircle from './progress-circle';

/**
 * Services
 */
import { getImageSrc } from '../../services/drive';

class Upload extends Component {
  constructor(props) {
    super(props);

    // Initilize the files from props to state
    let files = [];

    if (props.value && Array.isArray(props.value)) {
      files = props.value;
    }

    this.state = {
      files,
      loading: false,
    };
  }

  static propTypes = {
    _id: string.isRequired,
    label: string,
    title: string,
    name: string,
    value: arrayOf(object),
    customerId: string.isRequired,
    onChange: func,
    disabled: bool,
    hideHelperLabel: bool,
    helperLabel: string,
    maxItems: number,
    upload: func.isRequired,
    delete: func.isRequired,
    validator: func,

    // Event when the text of the input changes, without losing focus. Adapted to upload
    onChangeText: func,
  };

  static defaultProps = {
    disabled: false,
  };

  /**
   * @function emitFilesChange
   * @description Calls the onChange function of the props
   * @param  {Array<Object>} files List of files to update
   */
  emitFilesChange = files => {
    const { onChange } = this.props;

    if (!onChange) {
      return;
    }

    if (!files) {
      files = this.state.files;
    }

    return onChange(files);
  };

  /**
   * @function uploadFile
   * @description Starts to upload the new selected file and inserts it in the state
   * @param  {Object} event React event
   */
  uploadFile = async event => {
    event.preventDefault();

    const { customerId, onChangeText, validator } = this.props;
    const { files } = this.state;
    const {
      files: [file],
    } = event.target;

    if (validator) {
      const isValid = await validator(file);

      if (!isValid) {
        return;
      }
    }

    // Verify duplicate files
    if (files.some(f => f.name === file.name)) {
      return;
    }

    const updatedFiles = files.concat([
      {
        name: file.name,
        progress: 0,
        imageSrc: await getImageSrc(file),
      },
    ]);

    return this.setState({ files: updatedFiles }, async () => {
      try {
        const uploadedFile = await this.props.upload(file, customerId, progress => {
          const updatedFiles = this.state.files.map(progressFile => {
            if (progressFile._id === file._id) {
              progressFile.progress = progress;
            }

            return progressFile;
          });

          this.setState({ files: updatedFiles });

          // Call the onChangeText to update the files list and disabled the next button while an upload is happening
          onChangeText && onChangeText(updatedFiles);
        });

        const files = this.state.files.map(file => {
          if (file.name === uploadedFile.name) {
            return {
              ...uploadedFile,
              imageSrc: file.imageSrc,
            };
          }

          return file;
        });

        this.setState({ files }, () => this.emitFilesChange());
      } catch (err) {
        console.error(err);
      }
    });
  };

  /**
   * @function removeFile
   * @description Removes a file of the list
   * @param {String} fileId ID of the file to remove
   */
  removeFile = async fileId => {
    this.setState({ loading: true });

    const status = await this.props.delete(fileId);

    if (status) {
      const filesFiltered = this.state.files.filter(({ _id }) => _id !== fileId);

      return this.setState({ loading: false, files: filesFiltered }, () => this.emitFilesChange(filesFiltered));
    }
  };

  renderHelperLabel = () => {
    const { hideHelperLabel, helperLabel } = this.props;

    return !hideHelperLabel && helperLabel && (
      <p className="input-label question-title block">{helperLabel}</p>
    );
  }

  render() {
    const { name, title, label, disabled, maxItems } = this.props;
    const { files, loading } = this.state;

    return (
      <div>
        {title && <h2 className="title">{title}</h2>}

        <div className={ `files ${files.length === 0 ? 'no-files' : ''}` }>
          {files.map(file => {
            const { _id, name, imageSrc, progress } = file;

            return (
              <div
                key={ _id ? _id : name }
                className={ `file ${progress ? 'uploading' : ''} ${disabled ? 'without-delete' : ''}` }
              >
                {imageSrc && <div style={{ backgroundImage: `url(${imageSrc})` }} className="preview-image" />}

                <a
                  className="file-name"
                  title={ name }
                  href={ imageSrc }
                  download={ name }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {name}
                </a>

                {loading ? <ProgressCircle /> : (
                  progress === undefined ? (
                    <div className="file-actions">
                      <button className="btn btn-delete" onClick={ () => this.removeFile(_id) }>
                        <img src="/static/icons/delete-white.svg" />
                      </button>
                    </div>
                  ) : (
                    <ProgressCircle progress={ progress } />
                  )
                )}
              </div>
            );
          })}
        </div>

        {!disabled && (maxItems ? files.length < maxItems : true) && (
          <Fragment>
            {title && this.renderHelperLabel()}

            <label>
              <LinkButton color="#847c5f" textColor="#fff">
                {label}
              </LinkButton>

              <input
                type="file"
                name={ `file_upload_${name}` }
                accept="image/*"
                onChange={ this.uploadFile }
                disabled={ disabled }
              />
            </label>

            {!title && this.renderHelperLabel()}
          </Fragment>
        )}

        <style jsx>{`
          input[type='file'] {
            height: 0;
            visibility: hidden;
            width: 0;
            opacity: 0;
          }

          .title {
            color: #847c5f;
            font-size: 28px;
            line-height: 1.2;
            margin: 0;
            text-align: center;
          }

          .files {
            margin: 10px 0 20px;
            overflow: auto;
            text-align: center;
            font-size: 0;
          }

          .files.no-files {
            margin: 0;
          }

          .file {
            background-color: rgba(0, 0, 0, 0.2);
            border-radius: 5px;
            display: inline-block;
            margin: 5px;
            width: 100%;
            min-height: 42px;
            overflow: hidden;
            position: relative;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
          }

          .file:before {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            box-shadow: 0 0 150px 75px rgba(0, 0, 0, 0.5);
          }

          .file-name {
            color: #fff;
            display: block;
            font-size: 16px;
            line-break: strict;
            line-height: 28px;
            overflow: hidden;
            text-decoration: none;
            text-overflow: ellipsis;
            text-align: left;
            text-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
            white-space: nowrap;
            word-break: break-all;
            padding: 12px;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 60px;
          }

          .file-name:hover {
            text-decoration: underline;
          }

          .file .btn,
          .file :global(.loader) {
            width: 40px;
            height: 40px;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
          }

          .file-actions,
          .file :global(.loader) {
            position: absolute;
            bottom: 10px;
            right: 10px;
          }

          .file-actions {
            display: flex;
          }

          .file-actions .btn {
            margin-left: 10px;
          }

          .file .btn {
            background: #000;
            border: none;
            border-radius: 50%;
            color: #fff;
            cursor: pointer;
            font-size: 18px;
            font-weight: bold;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: 0.2s;
          }

          .file .btn:hover,
          .file .btn:active,
          .file .btn:focus {
            outline: none;
          }

          .file .btn img {
            display: block;
            margin: auto;
            width: 24px;
            height: auto;
          }

          .file .btn-delete {
            background: #e53935;
          }

          .file .btn-delete:hover {
            background: #cc201c;
          }

          .input-label {
            display: block;
            color: #555;
            margin-top: 10px;
            margin-bottom: 5px;
            text-align: center;
          }

          .preview-image {
            display: block;
            width: 100%;
            background-repeat: no-repeat;
            background-position: 50% 50%;
            background-size: contain;
          }

          .preview-image:before {
            content: '';
            display: block;
            padding-bottom: ${(250 / 450) * 100}%;
          }

          @media (min-width: 768px) {
            .file {
              max-width: 450px;
            }
          }

          @media (max-width: 768px) {
            .file {
              margin: 5px 0;
              min-height: 40px;
              width: 100%;
            }

            .file-name {
              line-height: 36px;
            }
          }
        `}</style>
      </div>
    );
  }
}

export default Upload;
