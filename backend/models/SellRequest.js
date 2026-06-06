import mongoose from 'mongoose';

const sellRequestSchema = new mongoose.Schema(
  {
    ownerName: {
      type: String,
      required: [true, 'Owner name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: { type: String, trim: true },
    carBrand: {
      type: String,
      required: [true, 'Car brand is required'],
      trim: true,
    },
    carModel: {
      type: String,
      required: [true, 'Car model is required'],
      trim: true,
    },
    year: { type: Number },
    kmDriven: { type: Number },
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'],
    },
    expectedPrice: { type: Number },
    photos: [
      {
        url: { type: String },
        publicId: { type: String },
      },
    ],
    notes: { type: String, trim: true },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'contacted', 'closed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

sellRequestSchema.index({ status: 1 });
sellRequestSchema.index({ createdAt: -1 });

const SellRequest = mongoose.model('SellRequest', sellRequestSchema);
export default SellRequest;
