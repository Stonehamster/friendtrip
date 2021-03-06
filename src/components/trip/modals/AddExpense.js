import React, { Component } from "react";
import { Button, Modal, Form, Col } from "react-bootstrap";

class AddExpense extends Component {
  constructor(props) {
    super(props);
    this.state = {
      render: false,
      travelers: [],
    };
  }

  addExpense = (event) => {
    event.preventDefault();
    const { name, description, cost, traveler } = event.target.elements;
    let assignedTravelers = [];
    if (this.props.travelerIds.length === 1) {
      if (traveler.checked) assignedTravelers.push(traveler.value);
    } else if (this.props.travelerIds.length > 1) {
      for (let i = 0; i < this.props.travelerIds.length; i++) {
        if (traveler[i].checked) assignedTravelers.push(traveler[i].value);
      }
    }
    const data = {
      id: this.defaultValue("id"),
      expenseName: name.value,
      description: description.value,
      cost: cost.value,
      travelerId: this.props.travelerId,
      tripId: this.props.tripId,
      assignedTravelers: assignedTravelers,
    };
    const addExpenseAPI = "/expense/addExpense";
    const editExpenseAPI = "/expense/editExpense";
    const fetchAPI = this.props.kind === "Add" ? addExpenseAPI : editExpenseAPI;

    fetch(fetchAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      this.props.refreshTrip(this.props.refreshExpense);
      this.props.handleClose();
    });
  };

  // Gets Travelers on the Trip
  getTravelersJSON = () => {
    fetch("/trip/getTravelers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ travelerIds: this.props.travelerIds }),
    })
      .then((res) => res.json())
      .then((res) => {
        this.setState({ travelers: res.travelers, render: true });
      });
  };

  travelerAssigned = (travelerId, ids) => {
    ids = Object.values(ids);
    for (const assignee of ids) {
      if (assignee === travelerId) return true;
    }
    return false;
  };

  // Create Traveler Radio
  createTraveler = (traveler) => {
    const name = traveler.firstName + " " + traveler.lastName;
    var checked = false;
    if (this.props.expense && this.props.expense.travelerIds) {
      checked = this.travelerAssigned(
        traveler.id,
        this.props.expense.travelerIds
      );
    }
    return (
      <Form.Check
        custom
        type="checkbox"
        name="traveler"
        label={name}
        id={`#${traveler.id}`}
        key={traveler.id}
        value={traveler.id}
        defaultChecked={checked}
      />
    );
  };

  // Render Traveler(s) Radio
  renderTravelers = () => {
    if (!this.state.travelers || this.state.travelers.length === 0) return;
    var travelersJSX = [];
    for (const traveler of this.state.travelers) {
      travelersJSX.push(this.createTraveler(traveler));
    }
    return travelersJSX;
  };

  defaultValue = (param) => {
    if (!this.props.expense) return null;
    else return this.props.expense[param];
  };

  componentDidMount() {
    this.getTravelersJSON();
  }
  render() {
    if (!this.state.render) return <div></div>;
    return (
      <Modal
        show={this.props.show}
        dialogClassName="modal-60w"
        aria-labelledby="contained-modal-title-vcenter"
        onHide={this.props.handleClose}
        animation={false}
        centered
      >
        <Form onSubmit={this.addExpense} className="p-3">
          <Modal.Body>
            <h4>{this.props.kind} Expense</h4>
            <h5>Split a cost equally amongst Travelers</h5>
            <Form.Row>
              <Form.Group as={Col} controlId="exampleForm.ControlTextarea1">
                <Form.Label>Expense Name</Form.Label>
                <Form.Control
                  defaultValue={this.defaultValue("name")}
                  name="name"
                  as="textarea"
                  rows={1}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="exampleForm.ControlTextarea2">
                <Form.Label>Expense Description</Form.Label>
                <Form.Control
                  defaultValue={this.defaultValue("description")}
                  name="description"
                  as="textarea"
                  rows={4}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="exampleForm.ControlTextarea3">
                <Form.Label>Cost</Form.Label>
                <Form.Control
                  defaultValue={this.defaultValue("cost")}
                  name="cost"
                  as="textarea"
                  rows={1}
                />
              </Form.Group>
            </Form.Row>
            <br></br>

            <h5>Choose Travelers to Assign</h5>

            <Form.Row>
              <br></br>
              <div key="assignedTraveler">{this.renderTravelers()}</div>
            </Form.Row>
          </Modal.Body>
          <Modal.Footer>
            <Button className="m-0" variant="success" type="submit">
              Save
            </Button>
            <Button className="m-0 ml-1" variant="warning" onClick={this.props.handleClose}>Close</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}

export default AddExpense;
