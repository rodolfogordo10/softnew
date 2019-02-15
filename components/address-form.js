import { Component } from 'react';
import { object, func, bool } from 'prop-types';

/**
 * Components
 */
import Cep from './form/cep';
import Input from './form/input';
import Button from './form/button';
import TextDefault from '../utils/text';

/**
 * @class Tab
 */
class AddressForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      invalidNumber: false,
      buttonDisabled: true
    };
  }

  /**
   * @function validate
   * @description Validates the credit card name
   * @param  {String} value Value of the input
   */
  validate (param, value) {
    if(param === 'postalCode' && value.length <= 0) {
      this.setState({ error: 'Campo obrigatório.'});
      return false;
    }

    return true;
  }

  cepInitSearch = () => {
    this.setState({
      loading: true
    });
  };

  cepFinishSearch(val) {
    this.setState({
      loading: false
    });

    if (val) {
      const { handleChange } = this.props;

      handleChange && handleChange('address', val.address && val.address);
      handleChange && handleChange('neighborhood', val.neighborhood && val.neighborhood);
      handleChange && handleChange('city', val.city && val.city);
      handleChange && handleChange('state', val.state && val.state);
    }
  }

  saveAddress() {
    const { onSubmit, contact } = this.props;

    const update = this.objAddress(null, null, contact);

    return onSubmit(update, TextDefault.SNACKBAR_ADDRESS_SUCCESS);
  }

  handleChange = (param, value) => {
    const { handleChange } = this.props;

    const valueOld = this.props.contact[param];

    this.setState({
      buttonDisabled: true
    });

    if (this.validate(param, value) && valueOld !== value)
      this.setState({
        buttonDisabled: false
      });

    return handleChange && handleChange(param, value);
  };

  objAddress = (param, value, contact) => {
    let update = {
      [param] : value
    };

    if (param === 'postalCode')
      update = {
        postalCode : value,
        address : contact.address,
        neighborhood : contact.neighborhood,
        city : contact.city,
        state : contact.state
      };

    if (!param) {
      update = {
        postalCode : contact.postalCode,
        address : contact.address,
        addressNumber : contact.addressNumber,
        neighborhood : contact.neighborhood,
        city : contact.city,
        state : contact.state
      };

      if (contact.addressComplement)
        update.addressComplement = contact.addressComplement;
      
      if (contact.addressNumber)
        update.addressNumber = contact.addressNumber;
    }

    return update;
  };

  componentDidMount = () => window.scrollTo(0, 0);

  handleBlur = (param, value) => {
    const { onSubmit, contact } = this.props;

    if (this.validate(param, value)) {
      const update = this.objAddress(param, value, contact);

      return onSubmit(update, TextDefault.SNACKBAR_ADDRESS_SUCCESS);
    }
  };

  render() {
    const { postalCode, address, addressNumber, addressComplement, neighborhood, city, state } = this.props.contact;
    const { isSaving } = this.props;
    const { loading, invalidNumber, buttonDisabled } = this.state;

    return (
      <div >

        <div className="form-wrapper" >

          <div className="row">
            <Cep
              id="postalCode"
              name="postalCode"
              value={ postalCode }
              label="Informe o CEP"
              onChange={ val => this.handleChange('postalCode', val) }
              onInitSearch={ this.cepInitSearch }
              onFinishSearch={ val => this.cepFinishSearch(val) }
            />
          </div>

          <div className="row">
            <Input
              id="address"
              onChange={ val => this.handleChange('address', val) }
              value={ address }
              label="Rua"
              disabled={ !postalCode || loading }
              loading={ loading }
            />
          </div>

          <div className="row">
            <Input
              id="addressNumber"
              onChange={ val => this.handleChange('addressNumber', val) }
              type="tel"
              value={ addressNumber }
              label="Número"
              invalid={ invalidNumber }
              disabled={ !postalCode || loading }
              loading={ loading }
            />
          </div>

          <div className="row">
            <Input
              id="addressComplement"
              onChange={ val => this.handleChange('addressComplement', val) }
              value={ addressComplement }
              label="Complemento"
              invalid={ invalidNumber }
              disabled={ !postalCode || loading }
              loading={ loading }
            />
          </div>

          <div className="row">
            <Input
              id="neighborhood"
              onChange={ val => this.handleChange('neighborhood', val) }
              value={ neighborhood }
              label="Bairro"
              disabled={ !postalCode || loading }
              loading={ loading }
            />
          </div>

          <div className="row">
            <Input
              id="city"
              onChange={ val => this.handleChange('city', val) }
              value={ city }
              label="Cidade"
              disabled={ !postalCode || loading }
              loading={ loading }
            />
          </div>

          <div className="row">
            <Input
              id="state"
              onChange={ val => this.handleChange('state', val) }
              value={ state }
              label="Estado"
              disabled={ !postalCode || loading }
              loading={ loading }
            />
          </div>

          <div className="row">
            <Button
              onClick={ () => this.saveAddress() }
              loading={ isSaving }
              disabled={ isSaving || buttonDisabled }  >
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

          @media (max-width: 768px) {
            div :global(.input-container) {
              max-width: none;
            }
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

AddressForm.propTypes = {
  contact: object.isRequired,
  handleChange: func.isRequired,
  onSubmit: func.isRequired,
  isSaving: bool
};

export default AddressForm;