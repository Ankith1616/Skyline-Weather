import mongoose from 'mongoose';

const weatherRecordSchema = new mongoose.Schema({
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    minlength: [1, 'Location cannot be empty']
  },
  latitude: {
    type: Number,
    required: [true, 'Latitude is required'],
    min: [-90, 'Latitude must be at least -90'],
    max: [90, 'Latitude cannot exceed 90']
  },
  longitude: {
    type: Number,
    required: [true, 'Longitude is required'],
    min: [-180, 'Longitude must be at least -180'],
    max: [180, 'Longitude cannot exceed 180']
  },
  fromDate: {
    type: Date,
    required: [true, 'From Date is required']
  },
  toDate: {
    type: Date,
    required: [true, 'To Date is required']
  },
  temperature: {
    type: Number,
    required: [true, 'Temperature is required']
  },
  humidity: {
    type: Number,
    required: [true, 'Humidity is required'],
    min: [0, 'Humidity cannot be negative'],
    max: [100, 'Humidity cannot exceed 100']
  },
  windSpeed: {
    type: Number,
    required: [true, 'Wind Speed is required'],
    min: [0, 'Wind Speed cannot be negative']
  },
  condition: {
    type: String,
    required: [true, 'Weather Condition is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Enforce date validation at Schema level
weatherRecordSchema.pre('validate', function(next) {
  if (this.fromDate && this.toDate) {
    if (this.fromDate > this.toDate) {
      this.invalidate('fromDate', 'From Date must be less than or equal to To Date');
      this.invalidate('toDate', 'To Date must be greater than or equal to From Date');
    }
  }
  next();
});

const WeatherRecord = mongoose.model('WeatherRecord', weatherRecordSchema);

export default WeatherRecord;
