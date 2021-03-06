import React, { Component } from "react";
import { Button, Card, Col, Row, Container, Alert } from "react-bootstrap";

import ViewDestination from "./modals/ViewDestination";
import AddDestination from "./modals/AddDestination";
import destinationIcon from "../../Media/destinationIcon.svg";

import "../../Stylesheets/Destinations.css";
class Destinations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showViewDestination: false,
      showAddDestination: false,
      destinations: [],
      destinationToView: null,
    };

    this.openViewDestinationModal = this.openViewDestinationModal.bind(this);
    this.closeViewDestinationModal = this.closeViewDestinationModal.bind(this);

    this.openAddDestinationModal = this.openAddDestinationModal.bind(this);
    this.closeAddDestinationModal = this.closeAddDestinationModal.bind(this);
  }

  closeViewDestinationModal = () => {
    this.setState({ showViewDestination: false });
  };

  openViewDestinationModal = (destination) => {
    this.setState({
      showViewDestination: true,
      destinationToView: destination,
    });
  };

  closeAddDestinationModal = () => {
    this.setState({ showAddDestination: false, destinationToView: null });
  };

  openAddDestinationModal = () => {
    this.setState({ showAddDestination: true });
  };

  getDestinationsJSON = (destinationIds) => {
    const data = {
      tripId: this.props.tripId,
      destinationIds,
    };
    fetch("/destination/getDestinations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        this.setState({ destinations: res.destinations });
      });
  };
  refreshDestinations = () => {
    this.getDestinationsJSON(this.props.destinationIds);
  };
  componentDidMount() {
    this.getDestinationsJSON(this.props.destinationIds);
  }
  createDestination = (destination) => {
    return (
      <Alert
        onClick={() => {
          this.openViewDestinationModal(destination);
        }}
        className="tripThumbnail mb-2"
        key={destination.id}
      >
        <Row style={{ color: "black" }} className="align-items-center text-center">
          <Col xs={2}>{destination.name}</Col>
          <Col xs={2}>{destination.startDate}</Col>
          <Col xs={2}>{destination.endDate}</Col>
          <Col>{destination.description}</Col>
        </Row>
      </Alert>
    );
  };

  renderDestinations = () => {
    if (this.state.destinations.length === 0) return;
    let destinationAlertListJSX = [];
    for (let destination of this.state.destinations) {
      destinationAlertListJSX.push(this.createDestination(destination));
    }
    return destinationAlertListJSX;
  };

  render() {
    return (
      <div>
        <ViewDestination
          kind="View"
          tripId={this.props.tripId}
          travelerId={this.props.travelerId}
          refreshTrip={this.props.refreshTrip}
          show={this.state.showViewDestination}
          refreshDestinations={this.refreshDestinations}
          destinationToView={this.state.destinationToView}
          handleClose={this.closeViewDestinationModal}
        />
        <AddDestination
          kind="Add"
          tripId={this.props.tripId}
          travelerId={this.props.travelerId}
          show={this.state.showAddDestination}
          handleClose={this.closeAddDestinationModal}
          refreshTrip={this.props.refreshTrip}
          refreshDestinations={this.refreshDestinations}
        />
        <Card className="destinations-list">
          <Card.Header className="destinations-list-header p-1 pl-3">
          <img
            src={destinationIcon}
            width="25"
            height="25"
            className="destinations-list-icon d-inline-block align-top mr-2 "
            alt="destinationIcon"
            id="destinationIcon"
          />
            <strong>Destinations</strong>
            <Button
              className="ml-auto d-inline-block"
              variant="success"
              onClick={this.openAddDestinationModal}
            >
              Add Destination
            </Button>
          </Card.Header>
          <Card.Body className="destinations-list-body">
            <Container fluid>
              <Row className="m-0 text-center">
                <Col xs={2}>
                  <h5>Destination</h5>
                </Col>
                <Col xs={2}>
                  <h5>Start Date</h5>
                </Col>
                <Col xs={2}>
                  <h5>End Date</h5>
                </Col>
                <Col>
                  <h5>Description</h5>
                </Col>
              </Row>
              {this.renderDestinations()}
              <Row>
                <Col></Col>
              </Row>
            </Container>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default Destinations;
