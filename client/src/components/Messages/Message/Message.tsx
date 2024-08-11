import "./Message.css";
import { checkText } from "smile2emoji";

interface MessageProp {
  message: { user: string, text: string };
  name: string;
}

export default function Message({ message, name }: MessageProp) {

  // console.log(message);

  if (message.user === "admin") {
    return (
      <p className="text-secondary fw-bold text-center">{message.text}</p>
    );
  }
  
  const trimmedName: string = name.trim().toLowerCase();
  
  const isSentByCurrentUser: boolean = message.user === trimmedName;


  return (
    isSentByCurrentUser ? (
      <div className="messageContainer justifyEnd mb-2">
        <p className="sentText pr-10">{trimmedName}</p>
        <div className="messageBox backgroundBlue">
          <p className="messageText colorWhite">{checkText(message.text)}</p>
        </div>
      </div>
    ) : (
      <div className="messageContainer justifyStart mb-2">
        <div className="messageBox backgroundLight">
          <p className="messageText colorDark">{checkText(message.text)}</p>
        </div>
        <p className="sentText pl-10 ">{message.user}</p>
      </div>
    )
  );
}
