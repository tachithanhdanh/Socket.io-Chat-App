import { Container, Row, Col } from 'react-bootstrap';
import { User } from "../Chat/Chat";
import onlineIcon from '../../icons/onlineIcon.png';
import './TextContainer.css';

interface TextContainerProps {
  users: User[];
}

export default function TextContainer({ users }: TextContainerProps) {
  return (
    <Container className="text-white d-flex flex-column justify-content-between h-60 me-2">
      <div>
        <h4>Realtime Chat Application <span role="img" aria-label="emoji">💬</span></h4>
        <h5>Created with MongoDB, React, Express, Node and Socket.IO <span role="img" aria-label="emoji">❤️</span></h5>
        <h5>Try it out right now! <span role="img" aria-label="emoji">⬅️</span></h5>
      </div>
      {users && (
        <div>
          <h4>People currently chatting:</h4>
          <Row className="d-flex align-items-center mb-5 flex-row">
            {users.map(({ name }) => (
              <div key={name} className="d-flex align-items-center">
                <h5>{name}</h5>
                <img alt="Online Icon" src={onlineIcon} className="ps-2"/>
              </div>
            ))}
          </Row>
        </div>
      )}
    </Container>
  );
}
