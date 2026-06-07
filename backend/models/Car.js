import mongoose from 'mongoose';

const carSchema = new mongoose.Schema(
  {
    // ── Core Details ──
    title: { type: String, trim: true },
    slug: { type: String, unique: true, trim: true },
    make: {
      type: String,
      required: [true, 'Make/Brand is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true,
    },
    year: {
      type: Number,
      min: [1990, 'Year must be 1990 or later'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the future'],
    },
    manufacturingYear: { type: Number },
    registerYear: { type: Number },
    price: {
      type: Number,
      min: [0, 'Price must be positive'],
    },
    kms: {
      type: Number,
      min: [0, 'KMs must be positive'],
    },
    isKmGenuine: { type: Boolean, default: false },
    condition: {
      type: String,
      enum: ['used', 'new'],
      default: 'used',
    },
    exShowroomPrice: {
      type: Number,
    },
    onRoadPrice: {
      type: Number,
    },
    variants: [{ type: String }],
    variant: { type: String, trim: true },

    // ── Specs ──
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'],
    },
    transmission: {
      type: String,
      enum: ['Manual', 'Automatic', 'AMT', 'CVT', 'DCT'],
    },
    bodyType: {
      type: String,
      enum: ['Sedan', 'SUV', 'Hatchback', 'MUV', 'Coupe', 'Convertible', 'Pickup', 'Van', 'Wagon'],
    },
    color: { type: String, trim: true },
    owners: {
      type: Number,
      min: [1, 'Owners must be at least 1'],
      default: 1,
    },
    ownership: { type: String, trim: true },
    seats: { type: Number },
    engineCC: { type: Number },
    insurance: {
      type: String,
      enum: ['Comprehensive', 'Third Party', 'Expired', 'Zero Dep'],
    },
    registrationState: { type: String, trim: true },
    registration: { type: String, trim: true },

    // ── Media ──
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String },
      },
    ],
    spinImages: [{ type: String }],
    mainPhotoIndex: { type: Number, default: 0 },

    // ── Additional ──
    description: { type: String, trim: true },
    features: [{ type: String }],
    airConditioner: { type: String, trim: true },
    powerWindows: { type: String, trim: true },
    sunroof: { type: String, trim: true },
    parkingSensors: { type: String, trim: true },
    displacement: { type: String, trim: true },
    maxPower: { type: String, trim: true },
    driveType: { type: String, trim: true },
    cylinders: { type: Number },
    badges: [{ type: String }],
    loanAvailable: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['available', 'sold', 'reserved', 'upcoming', 'Draft', 'Coming Soon', 'Available'],
      default: 'available',
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate title and slug before saving
carSchema.pre('save', function (next) {
  if (this.isModified('make') || this.isModified('model') || this.isModified('year')) {
    this.title = `${this.make} ${this.model}${this.year ? ` (${this.year})` : ''}`.trim();
    const base = `${this.year}-${this.make}-${this.model}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    this.slug = `${base}-${this._id.toString().slice(-6)}`;
  }
  next();
});

// Indexes for search & filtering
carSchema.index({ make: 1, model: 1 });
carSchema.index({ price: 1 });
carSchema.index({ fuelType: 1 });
carSchema.index({ year: 1 });
carSchema.index({ status: 1 });
carSchema.index({ slug: 1 });
carSchema.index({ createdAt: -1 });

const Car = mongoose.model('Car', carSchema);
export default Car;
