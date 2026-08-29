import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITeamMember extends Document {
  name: string;
  role: string;
  email?: string;
  phone?: string;
  headshot?: string;
  order: number;
  published: boolean;
  en: { bio: string };
  es: { bio: string };
  social?: { linkedin?: string; instagram?: string };
  createdAt: Date;
  updatedAt: Date;
}

const TeamMemberSchema = new Schema<ITeamMember>(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    email: String,
    phone: String,
    headshot: String,
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
    en: { bio: String },
    es: { bio: String },
    social: { linkedin: String, instagram: String },
  },
  { timestamps: true }
);

const TeamMember: Model<ITeamMember> =
  mongoose.models.TeamMember || mongoose.model<ITeamMember>("TeamMember", TeamMemberSchema);

export default TeamMember;
