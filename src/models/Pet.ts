import mongoose, { Schema, InferSchemaType } from "mongoose";
import { vaccinationSchema } from "./Vaccination";
import { petStatSchema } from "./PetStat";
import { mediaFile } from "./MediaFile";

export const animalSchema = new Schema({
  name: { type: String, required: true }, // Holly
  type: { type: String, required: true }, // Cat | dog
  gender: { type: String, required: true }, // male | female
  shelterSettlmentDate: { type: Date, required: true }, //
  adoptionDate: { type: Date, required: true }, // date
  weight: { type: Number, required: true }, // 7.5
  stats: [{ type: petStatSchema, required: true }],
  description: { type: String, required: true },
  avatarUrl: { type: String, required: true }, //url

  mediaGallery: [{ type: mediaFile, required: false }],
  birthDate: { type: Date, required: false },
  vaccinations: [{ type: vaccinationSchema, required: false }],
  sterilization: { type: Date, required: false },
});

export type Animal = InferSchemaType<typeof animalSchema>;

export const AnimalModel = mongoose.model("Animal", animalSchema);
