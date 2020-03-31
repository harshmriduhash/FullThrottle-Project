import React from "react";
import { Card, Button } from "react-bootstrap";

export default (props) => {
  const { member: { id, real_name }, openModal } = props;
  return (
    <Card>
      <Card.Header>User Id :- {id}</Card.Header>
      <Card.Body>
        <Card.Title>Name :- {real_name}</Card.Title>
        <Button variant="primary" onClick={() => openModal(id)}>Show Activity Details</Button>
      </Card.Body>
    </Card>
  )
}