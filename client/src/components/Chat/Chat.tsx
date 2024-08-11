import { useEffect, useState, KeyboardEvent, MouseEvent, useRef } from "react";
import { Socket, io } from "socket.io-client";
import queryString from "query-string";
import { Container } from "react-bootstrap";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import TextContainer from "../TextContainer/TextContainer";
import { useNavigate } from "react-router-dom";
import Message from "../Messages/Message/Message";

interface ChatProps {
  location: Location;
}

interface ChatLog {
  room: string;
  user: string;
  text: string;
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
  CHAT_LOG: 'chatLog',
}

// Declare a socket variable to store the socket connection
// Put it outside the component so that it doesn't get redeclared on every render
// let socket: Socket;

export default function Chat({ location }: ChatProps) {
  const socketRef = useRef<Socket | null>(null);
  const [name, setName] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  // const [isChatLogLoaded, setIsChatLogLoaded] = useState<boolean>(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!socketRef.current) return;

    // Get the list of users in the room
    socketRef.current.on(SOCKET_EVENT.ROOM_DATA, ({ users }: { users: User[] }) => {
      // console.log(users);
      setUsers(users);
    });

    // Listen for messages from the server
    socketRef.current.on(SOCKET_EVENT.SERVER_MESSAGE, (message: MessageType) => {
      // console.log(messages);
      setMessages([...messages, message]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off(SOCKET_EVENT.ROOM_DATA);
        socketRef.current.off(SOCKET_EVENT.SERVER_MESSAGE);
      }
    };

    // Here the dependency array has messages, so the effect will run whenever messages change
    // This is crucial for updating the messages in real-time
    // If we forget to add messages to the dependency array, the effect will only run once
    // and the messages won't update in real-time
    // This is because the effect will always refer to the initial messages array
    // and not the updated messages array
    // Displayed messages will always be the initial messages array
  }, [messages]);
  
  const ENDPOINT = "localhost:5050";

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    socketRef.current = io(ENDPOINT);

    socketRef.current.emit(SOCKET_EVENT.JOIN, { name, room }, (error: string) => {
      if (error) {
        alert(error);
        navigate("/");
      }
    });

    let messagesFromServer: MessageType[] = [];

    socketRef.current.on(SOCKET_EVENT.CHAT_LOG, (chatLogs: ChatLog[]) => {
      messagesFromServer = chatLogs.map((chatLog) => {
        return { user: chatLog.user, text: chatLog.text };
      });
      setMessages(messagesFromServer);
      // setIsChatLogLoaded(true);
    });

    // Get welcome message from the server
    socketRef.current.on(SOCKET_EVENT.SERVER_MESSAGE, (message: MessageType) => {
      setMessages([...messagesFromServer, message]);
    });

    setName(name as string);
    setRoom(room as string);

    // Clean up the socket connection when the component unmounts
    return () => {
      socketRef.current?.disconnect();
    };
  }, [ENDPOINT, location.search]);



  // Function for sending messages
  function sendMessage(event: KeyboardEvent | MouseEvent) {
    // prevent the form from refreshing the page
    event.preventDefault();

    if (message) {
      // send the message to the server
      // and clear the input field
      socketRef.current?.emit(SOCKET_EVENT.CLIENT_MESSAGE, message, () => setMessage(""));
    }
  }

  // messages.forEach((message) => {
  //   console.log(message);
  // });

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
