import { Schema, model, models } from 'mongoose';

const LikePostSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  likedPost: {
    type: Schema.Types.ObjectId,
    ref: 'Prompt',
  }
});

const LikePost = models.LikePost || model('LikePost', LikePostSchema);

export default LikePost;