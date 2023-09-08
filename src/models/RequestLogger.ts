import mongoose, { Schema, InferSchemaType } from "mongoose";

const requestLoggerSchema = new Schema({
  ip: { type: String, required: true },
  city: { type: String, required: true },
  region: { type: String, required: true },
  country: { type: String, required: true },
  country_name: { type: String, required: true },
  country_code: { type: String, required: true },
  timezone: { type: String, required: true },
  utc_offset: { type: String, required: true },
  requestDate: { type: Date, required: true },
});

export type RequestLogger = InferSchemaType<typeof requestLoggerSchema>;

export const RequestLoggerModel = mongoose.model(
  "RequestLogger",
  requestLoggerSchema,
);
