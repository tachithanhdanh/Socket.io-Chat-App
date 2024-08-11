import ScrollToBottom from "react-scroll-to-bottom";
import Message from "./Message/Message";
import './Messages.css';

interface MessagesProps {
  messages: { user: string; text: string }[];
  name: string;
}

export default function Messages({ messages, name }: MessagesProps) {
  return (
    <ScrollToBottom className="bg-transparent overflow-auto flex-auto">
      {messages.map((message, index) => (
        <Message key={index} message={message} name={name} />
      ))}
    </ScrollToBottom>
  );
}
