import mongoose, { Schema, InferSchemaType } from "mongoose";
import { animalSchema } from "./Pet";

export const favouritePetSchema = new Schema({
  dog: [{ type: animalSchema, required: true }],
  Cat: [{ type: animalSchema, required: true }],
});

export type FavouritePet = InferSchemaType<typeof favouritePetSchema>;

export const FavouritePetModel = mongoose.model(
  "FavouritePet",
  favouritePetSchema,
);
