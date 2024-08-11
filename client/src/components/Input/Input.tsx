import { KeyboardEvent, MouseEvent } from "react";
import { Button, Form } from "react-bootstrap";


interface InputProps {
  setMessage: (message: string) => void;
  sendMessage: (event: KeyboardEvent | MouseEvent) => void;
  message: string;
}

export default function Input({ setMessage, sendMessage, message }: InputProps) {
  return (
    <Form className="d-flex border-top border-secondary border-1">
      <Form.Control
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={({ target: { value } }) => setMessage(value)}
        onKeyDown={event => event.key === 'Enter' ? sendMessage(event) : null}
        className="border-0 rounded-0 p-3 flex-grow-1"
        style={{ fontSize: '1.2em' }}
      />
      <Button
        variant="primary"
        className="text-uppercase"
        style={{ width: '20%' }}
        onClick={e => sendMessage(e)}
      >
        Send
      </Button>
    </Form>
  );
}
