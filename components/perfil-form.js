import { Component } from 'react';
import { object, func, bool } from 'prop-types';

import Input from './form/input';
import PhoneInput from './form/phone-input';
import { validateEmail } from '../utils/validations';
import LoaderContainer from './loader-container';
import Button from './form/button';
import TextDefault from '../utils/text';

/**
 * @class Tab
 */
class PerfilForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      invalidPhone: false,
      invalidName: false,
      invalidEmail: false,
      loading: false,
      buttonDisabled: true,
      showCounterName: false
    };

    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.enter = this.enter.bind(this);
  }

  /**
   * @function validate
   * @description Validates the credit card name
   * @param  {String} value Value of the input
   */
  validate () {
    const { contact: { name, email, phone } } = this.props;

    if (!name) {
      this.setState({ invalidName: true });
    }

    if (!email) {
      this.setState({ invalidEmail: true });
    }

    if (!validateEmail(email)) {
      this.setState({ invalidEmail: true });
    }

    if (!phone) {
      this.setState({ invalidPhone: true });
    }

    const { invalidName, invalidEmail, invalidPhone } = this.state;

    if (invalidName || invalidEmail || invalidPhone) {
      this.setState({ buttonDisabled: true });
      return false;
    }

    this.setState({ buttonDisabled: false });

    return true;
  }

  /**
   * @function onFocus
   * @description Handles the focus event
   */
  onFocus (param, show) {
    this.validate();

    this.setState({
      [param]: false
    });

    if (show)
      this.setState({
        [show]: true
      });

  }

  componentDidMount = () => window.scrollTo(0, 0);

  /**
   * @function onChange
   * @description Emits the event of change to its parent
   * @param  {Object} event DOM event
   */
  onChange (param, value) {
    const { handleChange } = this.props;

    this.validate();

    return handleChange && handleChange(param, value);
  }

  /**
   * @function onBlur
   * @description Emits the event of blur to its parent
   * @param  {Object} event DOM event
   */
  onBlur () {
    this.validate();
    return this.setState({
      showCounterName: false
    });
  }

  savePerfil() {
    const { onSubmit, contact } = this.props;

    const isValid = this.validate();

    return this.setState({
      isValid
    }, () => {
      if (isValid) {
        const update = this.objPerfil(contact);
    
        return onSubmit(update, TextDefault.SNACKBAR_PERFIL_SUCCESS);
      }
    });

  }

  objPerfil = (contact) => {

    const update = {
      name : contact.name,
      email : contact.email,
      phone : contact.phone
    };

    return update;
  };

  /**
   * @function noEnter
   * @description Calls the onKeyPress event
   * @param  {Object} event onKeyPress event
   */
  enter (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const { onSubmit } = this.props;
      const { name, value } = event.target;

      const isValid = this.validate();

      return this.setState({
        isValid
      }, () => {
        if (isValid) {
          const update = {
            [name] : value
          };
          return onSubmit(update, TextDefault.SNACKBAR_PERFIL_SUCCESS);
        }
      });
    }
  }

  render() {
    const {
      contact: {
        name,
        email,
        phone
      },
      isSaving
    } = this.props;

    const { invalidPhone, invalidName, invalidEmail, loading, buttonDisabled, showCounterName } = this.state;

    const commonInputProps = {
      required: false,
    };

    return (
      <div className="container">
        <div className="loader-container">
          <LoaderContainer loading={ loading } />
        </div>

        <div className={ `form-wrapper ${loading ? 'loading' : ''}` }>

          <div className="row">
            <Input
              { ...commonInputProps }
              type="text"
              id="name"
              value={ name }
              maxLength="50"
              showCounter={ showCounterName }
              invalid={ invalidName }
              onFocus={ () => this.onFocus('invalidName', 'showCounterName') }
              onChange= { val => this.onChange('name', val) }
              onBlur= { () => this.onBlur() }
              invalidMsg="Campo obrigatório"
              label="Nome"
            />
          </div>
          <div className="row">
            <Input
              { ...commonInputProps }
              type="email"
              id="email"
              value={ email }
              maxLength="80"
              invalid={ invalidEmail }
              onFocus={ () => this.onFocus('invalidEmail') }
              onChange= { val => this.onChange('email', val) }
              onBlur= { () => this.onBlur() }
              invalidMsg="Email inválido"
              label="Email"
            />
          </div>
          <div className="row">
            <PhoneInput
              id="phone"
              value={ phone }
              className="phone"
              onFocus={ () => this.onFocus('invalidPhone') }
              onChangeText= { val => this.onChange('phone', val) }
              onBlur= { () => this.onBlur() }
              placeholder="Telefone"
              invalid={ invalidPhone }
              onlyCellPhone={ false }
            />
          </div>
          <div className="row">
            <Button
              onClick={ () => this.savePerfil() }
              loading={ isSaving }
              disabled={ isSaving || buttonDisabled }
              >
              Salvar
            </Button>
          </div>
        </div>
        <style jsx>{`
          .form-wrapper {
            position: relative;
            transition: opacity 0.2s;
            padding: 0 10px;
          }

          .loading {
            opacity: 0.2;
          }

          .loader-container :global(.wrapper) {
            z-index: 10;
          }

          .row {
            display: flex;
            margin: 20px auto;
            padding: 0 0 20px;
            justify-content: center;
            align-items: center;
            max-width: 640px;
          }

        `}</style>
      </div>
        
    );
  }
}

PerfilForm.propTypes = {
  contact: object.isRequired,
  handleChange: func.isRequired,
  onSubmit: func.isRequired,
  isSaving: bool
};

export default PerfilForm;
