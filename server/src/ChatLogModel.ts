import mongoose from "mongoose";

interface ChatLog {
  room: string;
  user: string;
  text: string;
}

const chatLogSchema = new mongoose.Schema({
  room : {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const ChatLogModel = mongoose.model<ChatLog>("ChatLog", chatLogSchema);
export { ChatLog, ChatLogModel };