// models/review.model.js
import { model, Schema } from 'mongoose';
import { FoodModel } from './food.model.js';

export const OrderItemSchema = new Schema(
  {
    food: { type: FoodModel.schema, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  {
    _id: false,
  }
);

OrderItemSchema.pre('validate', function (next) {
  this.price = this.food.price * this.quantity;
  next();
});


const ReviewSchema = new Schema(
  {
    foodId: { type: String, required: true},
    items: { type: [OrderItemSchema], required: true },
    userName: { type: String, required: true  },
    comment: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    sentimentScore: { type: Number },
  },
  { timestamps: true }
);

export const ReviewModel = model('review', ReviewSchema);
