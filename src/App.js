import React from 'react';
import User from './user';
import ActivityModal from './activity-modal';
import './App.css';
import { Container, Row, Col, InputGroup, FormControl } from 'react-bootstrap';

class App extends React.Component {
  state = { userData: { members: [] }, searchText: '' }

  fetchData = async () => {
    let url = '/api/users';
    if (this.state.searchText) {
      url += `?search=${this.state.searchText}`
    }
    const userData = await (await fetch(url)).json();
    this.setState({ userData });
  }

  componentDidMount() {
    this.fetchData();
  }

  onHandleInputChange = (event) => {
    this.setState({ searchText: event.target.value }, () => this.fetchData());
  }

  openModal = id => {
    const selectedMember = this.state.userData.members.find(user => id === user.id);
    this.setState({ showModal: true, selectedMember })
  }

  handleModalClose = () => this.setState({ showModal: false, selectedMember: null });

  render() {
    const { showModal, selectedMember, userData } = this.state;
    return (
      <Container fluid className="root">
        <Row>
          <Col></Col>
          <Col></Col>
          <Col>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Search User by Id or Name"
                onChange={this.onHandleInputChange}
              />
            </InputGroup>
          </Col>
        </Row>
        {
          userData.members && userData.members.length > 0 && userData.members.map(member => 
            <Row key={member.id} className="mt-row">
              <Col>
                <User member={member} openModal={this.openModal} />
              </Col>
            </Row>)
        }
        {
          (!userData.members || userData.members.length === 0) &&
          <span>
            No Member Found !!!!
          </span>
        }
        { showModal && <ActivityModal member={selectedMember} handleClose={this.handleModalClose} />}
      </Container>
    )
  }
}

export default App;
