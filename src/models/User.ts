import mongoose, { Schema, InferSchemaType } from "mongoose";

const User = new Schema({
  displayName: { type: String, required: true },
  email: { type: String, required: true },
  photoURL: { type: String, required: false },
  uid: { type: String, required: true },
});

export type User = InferSchemaType<typeof User>;

export const UserModel = mongoose.model("User", User);
