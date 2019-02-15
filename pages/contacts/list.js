import { Component, Fragment } from 'react';
import { bool, array } from 'prop-types';
import Router from 'next/router';

import { isMobile as isMobileDevice } from '../../utils/mobile';

import { getContacts } from '../../services/contacts';
import List from '../../components/list';
import ContactsListItem from '../../components/contacts/list-item';
import * as Token from '../../utils/auth';

/**
 * Components
*/

class ContactsList extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isLoading: true,
      contacts: props.initialContacts
    };

    this.fetchPosts = this.fetchPosts.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  /**
   * @function getInitialProps
   * @description Gets the ticket informations from the API
   * @return {Object} Props of itself
   */
  static async getInitialProps (context) {
    const { req } = context;
    const isMobile = isMobileDevice(req);

    // Get infos from the request
    let props = {
      error: false,
      isMobile,
      initialContacts: []
    };

    try {

      props.initialContacts = await getContacts(20, 0, { req });

    } catch (err) {
      console.error(err);
      props.error = true;
    }

    return props;
  }

  /**
   * @function onListItemClick
   * @description Redirects the user to the contact form
   * @param  {Object} contact contact to redirect to
   */
  onListItemClick(contact) {
    const { _id } = contact;
    const href = {
      pathname: `/contacts`,
      query: {
        contactId: _id
      }
    };

    return Router.push(href, `/contatos/${_id}`);

  }

  async fetchPosts() {
    const { contacts } = this.state;

    const storedToken = Token.getToken();
    const skip = contacts.length === 0 ? 20 : contacts.length;

    const newContacts = await getContacts(20, skip, { token : storedToken });

    newContacts.length > 0 && this.setState({
      contacts: contacts.concat(newContacts)
    });
  }

  handleScroll() {
    const el = document.documentElement;

    const scrollTop = (el && el.scrollTop) || document.body.scrollTop;
    const scrollHeight = (el && el.scrollHeight) || document.body.scrollHeight;
    const clientHeight = el.clientHeight || window.innerHeight;
    const scrolledToBottom = scrollTop + clientHeight >= scrollHeight ;

    if (scrolledToBottom) {
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

  render () {
    const { error, isMobile } = this.props;
    const { isLoading, contacts } = this.state;
    const arrContacts = contacts;

    if (error)
      return (
        <h1>Erro</h1>
      );

    if (!Array.isArray(arrContacts))
      return (
        <h1>Nenhum registro</h1>
      );
  
    return <Fragment>
      {
        !isLoading && (
          <List onItemClick={ this.onListItemClick } isLoading={ isLoading } isMobile={ isMobile } >
          {
            arrContacts.map((contact, index) => (
              <ContactsListItem index={ arrContacts.length - index }
                key={ `contact-${contact._id}` }
                { ...contact } />
            ))
          }
          </List>
        )
      }
      </Fragment>;
  }
}

ContactsList.propTypes = {
  isMobile: bool.isRequired,
  error: bool,
  isLoading: bool,
  initialContacts: array.isRequired
};

export default ContactsList;
