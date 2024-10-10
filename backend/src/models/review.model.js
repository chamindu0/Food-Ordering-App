// models/review.model.js
import { model, Schema } from 'mongoose';

const ReviewSchema = new Schema(
  {
    foodId: { type: Schema.Types.ObjectId, required: true, ref: 'food' },
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
    comment: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true }
);

export const ReviewModel = model('review', ReviewSchema);
