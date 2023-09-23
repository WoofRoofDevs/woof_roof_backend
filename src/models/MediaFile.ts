import mongoose, { Schema, InferSchemaType } from "mongoose";

export const mediaFile = new Schema({
  contentUrl: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  contentType: { type: String, required: true }, // video | photo
  creationDate: { type: Date, required: true },
});

export type MediaFileSchema = InferSchemaType<typeof mediaFile>;

export const MediaFileModel = mongoose.model("MediaFile", mediaFile);
