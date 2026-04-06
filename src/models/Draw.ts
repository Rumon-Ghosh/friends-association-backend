import { Schema, model, Document, Types } from 'mongoose';

export interface IDraw extends Document {
  drawDate: Date;
  winnerId: Types.ObjectId;
  totalAmount: number;
  participants: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const drawSchema = new Schema<IDraw>({
  drawDate: { type: Date, default: Date.now },
  winnerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  totalAmount: { type: Number, required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, {
  timestamps: true
});

const Draw = model('Draw', drawSchema);
export default Draw;
