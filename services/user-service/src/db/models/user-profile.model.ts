import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    fullName: {
      type: String,
      default: '',
    },

    phone: {
      type: String,
      default: '',
    },

    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Other',
    },

    dateOfBirth: {
      type: Date,
    },

    address: {
      type: String,
      default: '',
    },

    profileImage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);

export const UserProfileModel = mongoose.model('UserProfile', userProfileSchema);
