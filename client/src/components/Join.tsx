import { useState } from "react";
import { Button, Container, Form, Row, Stack } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap css
import { Link } from "react-router-dom";

/*
  This component will be used to join a room.
  It has a form with an input field for the user to enter a room name.
*/
export default function Join() {
  const [name, setName] = useState<string>("");
  const [room, setRoom] = useState<string>("");

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#1A1A1D" }}
    >
      <Stack gap={2} className="justify-content-center align-items-center">
        <Row>
          <h1 className="text-white text-center">Join</h1>
        </Row>
        <Form>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Room"
              value={room}
              onChange={(event) => setRoom(event.target.value)}
              required
            />
          </Form.Group>
        </Form>
        <Link
          onClick={(e) => (!name || !room ? e.preventDefault() : null)}
          to={`/chat?name=${name}&room=${room}`}
        >
          <Button variant="primary" type="submit" disabled={!name || !room}>
            Sign in
          </Button>
        </Link>
      </Stack>
    </Container>
  );
}
