import { Schema, model, Document, Types } from 'mongoose';

export interface IContribution extends Document {
  userId: Types.ObjectId;
  amount: number;
  daysCovered: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const contributionSchema = new Schema<IContribution>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  daysCovered: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
}, {
  timestamps: true
});

const Contribution = model('Contribution', contributionSchema);
export default Contribution;
