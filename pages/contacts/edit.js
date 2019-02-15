import { Component, Fragment } from 'react';
import { bool, object, array, string } from 'prop-types';

/**
 * Components
*/
import WhiteFrameCover from '../../components/whiteframe-cover';
import Tabs from '../../components/tabs';
import PerfilForm from '../../components/perfil-form';
import AddressForm from '../../components/address-form';
import HitoryForm from '../../components/history-form';
import Snackbar from '../../components/snackbar';
import AvatarContact from '../../components/avatar-contact';

/**
 * Service
*/
import { uploadFile } from '../../services/drive';
import { getContactsId, getContactsIdHistory, postContactsIdHistory, putContactsId } from '../../services/contacts';

/**
 * Utils
 */
import { isMobile as isMobileDevice } from '../../utils/mobile';
import * as Token from '../../utils/auth';

class ContactsEdit extends Component {
  constructor (props) {
    super(props);

    this.state = {
      activeTab: 2,
      onProgress: undefined,
      contact: props.contact,
      textComment: props.textComment,
      isLoading: true,
      isSaving: false,
      history: props.initialHistory,
      isSavingAvatar: false
    };

    this.fetchPosts = this.fetchPosts.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.formHitorySubmit = this.formHitorySubmit.bind(this);
    this.formHistoryChange = this.formHistoryChange.bind(this);
    this.contactSubmit = this.contactSubmit.bind(this);
    this.onChangeAvatar = this.onChangeAvatar.bind(this);
  }

  /**
   * @function getInitialProps
   * @description Gets the ticket informations from the API
   * @return {Object} Props of itself
   */
  static async getInitialProps (context) {
    const { req, res, token } = context;
    const isMobile = isMobileDevice(req);
    const { contactId } = req.params && req.params;

    // Get infos from the request
    const props = {
      error: false,
      isMobile : isMobile,
      initialHistory: [],
      textComment: ''
    };

    try {

      props.contact = await getContactsId(contactId, { req, res, token });

      props.initialHistory = await getContactsIdHistory(contactId, 3, 0, { req, res, token });

    } catch (err) {
      console.error(err);
      props.error = true;
    }

    return props;
  }

  updateValue = async (param, value) => {
    try {
      const { contact } = this.state;

      for (let prop in contact) {
        if (prop === param)
          contact[prop] = value;
      }

      this.setState({ contact });

    } catch (err) {
      return console.error(err);
    }
    
  }

  async fetchPosts() {
    const { history, contact } = this.state;

    const storedToken = Token.getToken();
    const skip = history.length === 0 ? 4 : history.length;

    const newHistory = await getContactsIdHistory(contact._id, 4, skip, { token : storedToken });

    newHistory.length > 0 && this.setState({
      history: history.concat(newHistory)
    });
  }

  handleScroll() {
    const el = document.documentElement;

    const scrollTop = (el && el.scrollTop) || document.body.scrollTop;
    const scrollHeight = (el && el.scrollHeight) || document.body.scrollHeight;
    const clientHeight = el.clientHeight || window.innerHeight;
    const scrolledToBottom = scrollTop + clientHeight >= scrollHeight ;

    if (scrolledToBottom) {
      const { activeTab } = this.state;
      
      if (activeTab === 3)
        this.fetchPosts();
    }
  }

  componentDidMount() {
    this.setState({ isLoading: false });

    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  /**
   * @function formHitorySubmit
   * @description Receives the callback of form submitted
   */
  async formHitorySubmit() {
    const storedToken = Token.getToken();
    const { textComment, contact, history } = this.state;

    const returnHistory = await postContactsIdHistory({ description: textComment }, contact._id, { token : storedToken });

    const objHistory = returnHistory.result ? returnHistory.result.value : null;

    if (objHistory) {
      history.unshift(objHistory);

      this.setState ({
        textComment : '',
        history : history
      });
    }
  }

  /**
   * @function formContactSubmit
   * @description Receives the callback of form submitted
   */
  async contactSubmit(update, msg) {
    const storedToken = Token.getToken();
    const { contact } = this.state;

    this.setState({ isSaving: true });

    try {

      await putContactsId(update, contact._id, contact.credential_id, { token : storedToken });

      this.setState({ isSaving: false });

      this.showSnackbarMessage(msg);

    } catch (err) {
      console.log(err);
      this.showSnackbarMessage(err.message);
    }
  }

    /**
   * @function onChangeAvatar
   * @description Receives the callback of form submitted
   */
  async onChangeAvatar(file) {
    const storedToken = Token.getToken();
    const { contact } = this.state;

    this.setState({ isSaving: true });

    try {

      this.setState({ onProgress: 0 });

      const result = await uploadFile(file, contact._id, contact.credential_id, { token : storedToken }, progress => {
      
        this.setState({ onProgress: progress });

      });

      contact.imageDriveId = [result.imageDriveId];

      this.setState({ contact : contact, isSavingAvatar: false });

      this.showSnackbarMessage('Foto adicionada com sucesso.');

      this.setState({ onProgress: undefined });

    } catch (err) {
      console.log(err);
      this.showSnackbarMessage(err.message);
    }
  }

  showSnackbarMessage = text => {
    return this.snackbar && this.snackbar.show(text);
  };

  formHistoryChange(value) {
    return this.setState({
      textComment: value
    });
  }

  renderPerfil(contact) {
    const { isSaving } = this.state;

    return (
      <PerfilForm onSubmit={ this.contactSubmit } handleChange={ this.updateValue } contact={ contact } isSaving={ isSaving } />
    );
  }

  renderAddressForm(contact) {
    const { isSaving } = this.state;

    return (
      <AddressForm onSubmit={ this.contactSubmit } handleChange={ this.updateValue } contact={ contact } isSaving={ isSaving } />
    );
  }

  renderHistory() {
    const { isLoading, history, textComment } = this.state;
    const arrHistory = history;

    return !isLoading && (
      <HitoryForm
        onSubmit={ this.formHitorySubmit }
        textComment={ textComment }
        onChange={ this.formHistoryChange }
        arrHistory={ arrHistory }
        isLoading={ isLoading }
      />
    );
  }

  tabChange(tabId) {
    this.setState({ activeTab: tabId });
  }

  render () {
    const { error, isMobile } = this.props;
    const { contact, isSavingAvatar, onProgress } = this.state;

    if (error)
      return (
        <h1>Erro</h1>
      );

    if (!contact)
      return (
        <h1>Registro não encontrado</h1>
      );

    return (
      <Fragment>
        {
          <WhiteFrameCover isMobile={ isMobile }>
            <div className="designer-container">
              <AvatarContact contact={ contact } onChange={ this.onChangeAvatar } onProgress={ onProgress } isSaving={ isSavingAvatar }/>
              <h1>{ contact.name }</h1>
              <Tabs
                tabs={ [
                  { id: 1, name: 'PERFIL', content: this.renderPerfil(contact), isActive: this.state.activeTab === 1 },
                  { id: 2, name: 'ENDEREÇO', content: this.renderAddressForm(contact), isActive: this.state.activeTab === 2 },
                  { id: 3, name: 'HISTÓRICO', content: this.renderHistory(contact), isActive: this.state.activeTab === 3 },
                ] }
                isMobile={ isMobile }
                onClick={ tab => this.tabChange(tab) }
              />
            </div>
            <Snackbar key="snackbar-savebtn" ref={ elm => (this.snackbar = elm) } />
            <style jsx>{`
              .designer-container {
                margin: 0 auto;
                max-width: 800px;
                padding: 0 10px;
                text-align: center;
                position: relative;
              }

              h1,
              h2 {
                color: #6a8c92;
                font-size: 28px;
                letter-spacing: -1px;
                line-height: 1.2;
                margin-bottom: 20px;
              }

              span {
                font-size: 16px;
              }

              a {
                background: #4caf50;
                border-radius: 3px;
                box-shadow: 0 1px 5px rgba(0, 0, 0, .2), 0 2px 2px rgba(0, 0, 0, .14), 0 3px 1px -2px rgba(0, 0, 0, .12);
                color: #fff;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                line-height: 50px;
                margin: 25px auto;
                max-width: 300px;
                min-height: 50px;
                min-width: 180px;
                outline: none;
                padding: 0 16px;
                text-align: center;
                text-decoration: none;
                text-transform: uppercase;
                transition: opacity .2s ease-in-out;
                user-select: none;
              }

              a:hover {
                opacity: 0.8;
              }

              @media (max-width: 768px) {
                h1,
                h2 {
                  font-size: 24px;
                }

                a {
                  margin: 10px auto;
                  min-height: 50px;
                  max-width: 100%;
                  width: 100%;
                }
              }

            `}</style>
          </WhiteFrameCover>
        }
      </Fragment>
    );
  }
}

ContactsEdit.propTypes = {
  isMobile: bool.isRequired,
  error: bool,
  contact: object,
  history: array,
  isLoading: bool,
  initialHistory: array,
  textComment: string.isRequired
};

export default ContactsEdit;
