import { Component } from 'react';
import { PhoneForm } from './PhoneForm/PhoneForm';
import { Filter } from './Filter/Filter';
import { ContactList } from './ContactList/ContactList';
import { nanoid } from 'nanoid';
import { GlobalStyle } from './GlobalStyle';
import { Container } from './MainPageStyle.styled';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const stotageContacts = 'contacts';

export class App extends Component {
  state = {
    contacts: [
      { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
      { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
      { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
      { id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
    ],
    filter: '',
  };

  componentDidMount() {
    const savedContacts = window.localStorage.getItem(stotageContacts);

    if (savedContacts !== null) {
      this.setState({
        contacts: JSON.parse(savedContacts),
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.contacts !== prevState.contacts) {
      window.localStorage.setItem(
        stotageContacts,
        JSON.stringify(this.state.contacts)
      );
    }
  }

  updateFilter = newTopic => {
    this.setState(() => {
      return {
        filter: newTopic,
      };
    });
  };

  filterContacts = () => {
    const { contacts, filter } = this.state;

    return contacts.filter(contact => {
      const contactName = contact.name.toLowerCase();
      const contactNumber = contact.number;

      return (
        contactName.includes(filter.toLowerCase()) ||
        contactNumber.includes(filter)
      );
    });
  };

  addPhone = newItem => {
    const { contacts } = this.state;

    if (contacts.some(contact => contact.name === newItem.name)) {
      Notify.failure(`${newItem.name} already in phonebook`);
      return;
    }

    const item = {
      ...newItem,
      id: nanoid(),
    };
    this.setState(prevState => {
      return {
        contacts: [...prevState.contacts, item],
      };
    });
    Notify.success(`${newItem.name} added to your contacts`);
  };

  deletePhone = user => {
    Notify.info(`${user.name} removed from your phone book`);

    this.setState(prevState => {
      return {
        contacts: prevState.contacts.filter(item => item.id !== user.id),
      };
    });
  };

  render() {
    const { filter } = this.state;
    const filteredContacts = this.filterContacts();

    return (
      <Container>
        <h1>Phonebook</h1>
        <PhoneForm onAdd={this.addPhone} />
        <h2>Contacts</h2>
        <Filter filter={filter} onSearchPhone={this.updateFilter} />
        <ContactList items={filteredContacts} onDelete={this.deletePhone} />
        <GlobalStyle />
      </Container>
    );
  }
}
