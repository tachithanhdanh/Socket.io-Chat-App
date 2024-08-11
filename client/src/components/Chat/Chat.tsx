import { useEffect, useState, KeyboardEvent, MouseEvent } from "react";
import { Socket, io } from "socket.io-client";
import queryString from "query-string";
import { Container } from "react-bootstrap";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import TextContainer from "../TextContainer/TextContainer";
import { useNavigate } from "react-router-dom";

interface ChatProps {
  location: Location;
}

interface MessageType {
  user: string;
  text: string;
}

export interface User {
  id: string;
  name: string;
  room: string;
}

const SOCKET_EVENT = {
  CLIENT_MESSAGE: 'CLIENT_MESSAGE',
  SERVER_MESSAGE: 'SERVER_MESSAGE',
  JOIN: 'join',
  DISCONNECT: 'disconnect',
  CONNECT: 'connection',
  ROOM_DATA: 'roomData',
}

// Declare a socket variable to store the socket connection
// Put it outside the component so that it doesn't get redeclared on every render
let socket: Socket;

export default function Chat({ location }: ChatProps) {
  const [name, setName] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  
  
  const ENDPOINT = "localhost:5050";

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    socket = io(ENDPOINT);

    socket.emit(SOCKET_EVENT.JOIN, { name, room }, (error: string) => {
      if (error) {
        alert(error);
        navigate("/");
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
    // Get the list of users in the room
    socket.on(SOCKET_EVENT.ROOM_DATA, ({ users }: { users: User[] }) => {
      console.log(users);
      setUsers(users);
    });

    // Listen for messages from the server
    socket.on(SOCKET_EVENT.SERVER_MESSAGE, (message: MessageType) => {
      setMessages([...messages, message]);
    });
    // Here the dependency array has messages, so the effect will run whenever messages change
    // This is crucial for updating the messages in real-time
    // If we forget to add messages to the dependency array, the effect will only run once
    // and the messages won't update in real-time
    // This is because the effect will always refer to the initial messages array
    // and not the updated messages array
    // Displayed messages will always be the initial messages array
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
      <Container className="d-flex flex-column justify-content-between bg-white rounded p-0" style={{ height: '80%', width: '60%' }}>
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </Container>
       {/* TextContainer Section */}
    <div className="ml-3 w-25">
      <TextContainer users={users} />
    </div>
    </div>
  );
}
