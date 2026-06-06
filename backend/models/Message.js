import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    email: { type: String, trim: true },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

messageSchema.index({ isRead: 1 });
messageSchema.index({ createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;
