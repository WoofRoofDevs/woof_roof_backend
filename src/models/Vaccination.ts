import mongoose, { Schema, InferSchemaType } from "mongoose";

export const vaccinationSchema = new Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  comment: { type: String, required: false },
});

export type Vaccination = InferSchemaType<typeof vaccinationSchema>;

export const VaccinationModel = mongoose.model(
  "Vaccination",
  vaccinationSchema,
);
