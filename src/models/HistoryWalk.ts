import mongoose, { Schema, InferSchemaType } from "mongoose";

const historyWalkSchema = new Schema({
  petName: { type: String, required: true },
  date: { type: Date, required: true },
  walkerName: { type: String, required: true },

  durationTime: { type: String, required: false },
  additionalInfo: { type: String, require: false },
});

export type HistoryWalk = InferSchemaType<typeof historyWalkSchema>;

export const HistoryWalkModel = mongoose.model(
  "HistoryWalk",
  historyWalkSchema,
);
