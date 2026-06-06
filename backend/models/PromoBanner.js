import mongoose from 'mongoose';

const promoBannerSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    desktopImageUrl: {
      type: String,
      required: [true, 'Desktop image is required'],
    },
    desktopPublicId: { type: String },
    mobileImageUrl: {
      type: String,
      required: [true, 'Mobile image is required'],
    },
    mobilePublicId: { type: String },
    link: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

promoBannerSchema.index({ isActive: 1, order: 1 });

const PromoBanner = mongoose.model('PromoBanner', promoBannerSchema);
export default PromoBanner;
