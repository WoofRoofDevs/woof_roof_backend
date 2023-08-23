import mongoose, { Schema, InferSchemaType } from "mongoose";

export const favouritePetSchema = new Schema({
  petId: { type: String, required: true },
  userId: { type: String, required: true },
});

export type FavouritePet = InferSchemaType<typeof favouritePetSchema>;

export const FavouritePetModel = mongoose.model(
  "FavouritePet",
  favouritePetSchema,
);
