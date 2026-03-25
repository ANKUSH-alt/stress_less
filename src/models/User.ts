import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  ageGroup: 'Teen' | 'Adult' | 'Senior';
  stressLog: {
    score: number;
    date: Date;
    mood: string;
  }[];
  journalEntries: {
    content: string;
    date: Date;
    reflection: string;
  }[];
  dailyStreak: number;
  lastActive: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  ageGroup: { type: String, enum: ['Teen', 'Adult', 'Senior'], default: 'Adult' },
  stressLog: [{
    score: { type: Number },
    date: { type: Date, default: Date.now },
    mood: { type: String }
  }],
  journalEntries: [{
    content: { type: String },
    date: { type: Date, default: Date.now },
    reflection: { type: String }
  }],
  dailyStreak: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
