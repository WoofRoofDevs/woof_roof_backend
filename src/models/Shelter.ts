import mongoose, { Schema, InferSchemaType } from "mongoose";

const shelter = new Schema({
  name: { type: String, required: true },
  location: { type: Object, required: true },
  creatorUid: { type: String, required: true },

  numberOfAnimals: { type: Number, required: false },
  numberOfSeats: { type: Number, required: false },
});

export type Shelter = InferSchemaType<typeof shelter>;

export const ShelterModel = mongoose.model("Shelter", shelter);
