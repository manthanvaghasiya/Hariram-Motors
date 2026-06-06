import mongoose from 'mongoose';

const happyCustomerSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    review: { type: String, trim: true },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    photo: {
      url: { type: String, required: true },
      publicId: { type: String },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const HappyCustomer = mongoose.model('HappyCustomer', happyCustomerSchema);
export default HappyCustomer;
