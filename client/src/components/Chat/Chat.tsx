import { useEffect, useState, KeyboardEvent, MouseEvent } from "react";
import { Socket, io } from "socket.io-client";
import queryString from "query-string";
import { Container } from "react-bootstrap";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";

interface ChatProps {
  location: Location;
}

const SOCKET_EVENT = {
  CLIENT_MESSAGE: 'CLIENT_MESSAGE',
  SERVER_MESSAGE: 'SERVER_MESSAGE',
  JOIN: 'join',
  DISCONNECT: 'disconnect',
  CONNECT: 'connection',
}

let socket: Socket;

export default function Chat({ location }: ChatProps) {
  const [name, setName] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);

  const ENDPOINT = "localhost:5050";

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    socket = io(ENDPOINT);

    socket.emit(SOCKET_EVENT.JOIN, { name, room }, (error: string) => {
      if (error) {
        alert(error);
      }
    });

    setName(name as string);
    setRoom(room as string);

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, [ENDPOINT, location.search]);


  useEffect(() => {
    // Listen for messages from the server
    socket.on(SOCKET_EVENT.SERVER_MESSAGE, (message: string) => {
      setMessages([...messages, message]);
    });
  }, [messages]);

  // Function for sending messages
  function sendMessage(event: KeyboardEvent | MouseEvent) {
    // prevent the form from refreshing the page
    event.preventDefault();

    if (message) {
      // send the message to the server
      // and clear the input field
      socket.emit(SOCKET_EVENT.CLIENT_MESSAGE, message, () => setMessage(""));
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <Container className="d-flex flex-column justify-content-between bg-white rounded p-0" style={{ height: '70%', width: '50%' }}>
        <InfoBar room={room} />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </Container>
    </div>
  );
}
