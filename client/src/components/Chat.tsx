import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import queryString from "query-string";

interface ChatProps {
  location: Location;
}

let socket: Socket;

export default function Chat({ location }: ChatProps) {
  const [name, setName] = useState<string>("");
  const [room, setRoom] = useState<string>("");

  const ENDPOINT = "localhost:5050";

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    socket = io(ENDPOINT);

    socket.emit("join", { name, room }, (error: string) => {
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

  return (
    <div>
      <h1>Chat</h1>
    </div>
  );
}
