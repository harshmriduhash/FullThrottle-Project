import React from 'react';
import { Modal, Button, Row, Col, Table } from "react-bootstrap";
import DayPickerInput from 'react-day-picker/DayPickerInput';

import 'react-day-picker/lib/style.css';

class ActivityModal extends React.Component {

  state = {
    startDate: new Date("2020-01-01"), // selecting a suitable back date
    endDate: new Date(),
    activities: []
  }

  componentDidMount() {
    this.filterActivities();
  }

  dateRangeOverlaps = (a_start, a_end, b_start, b_end) => {
    if (a_start <= b_start && b_start <= a_end) return true; // b starts in a
    if (a_start <= b_end && b_end <= a_end) return true; // b ends in a
    if (b_start < a_start && a_end < b_end) return true; // a in b
    return false;
  }

  filterActivities = () => {
    const { startDate, endDate } = this.state;
    const { member } = this.props;
    const activities = member.activity_periods.filter(period => this.dateRangeOverlaps(
      new Date(period.start_time),
      new Date(period.end_time),
      startDate,
      endDate
    ));
    this.setState({ activities });
  }

  duration(dt2, dt1) {
    let diff = (new Date(dt2).getTime() - new Date(dt1).getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
  }

  handleStartDayChange = (day) => {
    this.setState({ startDate: new Date(day) }, () => this.filterActivities());
  }
  handleEndDayChange = (day) => {
    this.setState({ endDate: new Date(day) }, () => this.filterActivities());
  }
  render() {
    const { startDate, endDate, activities } = this.state;
    const { handleClose, member } = this.props;
    return (
      <Modal size="lg" show={true} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>
            Activity of {member.real_name}({member.id})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="pd10">
            <Col>
              <span>Start Date </span>
              <DayPickerInput
                value={startDate}
                onDayChange={this.handleStartDayChange}
              />
            </Col>
            <Col>
              <span>End Date </span>
              <DayPickerInput
                value={endDate}
                onDayChange={this.handleEndDayChange}
                disabledDays={{ before: new Date(startDate) }}
              /></Col>
          </Row>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Duration (Minutes)</th>
              </tr>
            </thead>
            <tbody>
              {activities.length === 0 &&
                <tr>
                  <td colSpan="4">No Rows Found.</td>
                </tr>
              }
              {activities.length > 0 &&
                activities.map((activity, index) => (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{activity.start_time}</td>
                    <td>{activity.end_time}</td>
                    <td>{this.duration(activity.end_time, activity.start_time)}</td>
                  </tr>
                ))
              }
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default ActivityModal;
