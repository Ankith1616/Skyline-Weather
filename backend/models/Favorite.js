import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'City name is required'],
    trim: true,
    unique: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  lat: {
    type: Number,
    required: true
  },
  lon: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

export default Favorite;
