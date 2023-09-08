import mongoose, { Schema, InferSchemaType } from "mongoose";

export const petStatSchema = new Schema({
  title: { type: String, required: true }, // контактність
  description: { type: String, required: true },
  activeIconUrl: { type: String, required: true },
  disabledIconUrl: { type: String, required: true },
});

export type PetStat = InferSchemaType<typeof petStatSchema>;

export const PetStatModel = mongoose.model("PetStat", petStatSchema);
