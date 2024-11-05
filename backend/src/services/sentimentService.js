// services/sentimentService.js
import Sentiment from 'sentiment';
import { ReviewModel } from '../models/review.model.js';

const sentiment = new Sentiment();

export const analyzeSentiment = async (reviewId, comment) => {
  const result = sentiment.analyze(comment);
  const sentimentScore = result.score; // This will give you the sentiment score
  
  // Update the review with the sentiment score
  await ReviewModel.findByIdAndUpdate(reviewId, { sentimentScore });
};
