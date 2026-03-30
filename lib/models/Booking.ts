import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IBooking extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departure: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  tripType: "one-way" | "round-trip";
  aircraftPreference?: string;
  specialRequests?: string;
  createdAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    departure: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    departureDate: { type: String, required: true },
    returnDate: { type: String },
    passengers: { type: Number, required: true, min: 1, max: 20 },
    tripType: {
      type: String,
      required: true,
      enum: ["one-way", "round-trip"],
      default: "one-way",
    },
    aircraftPreference: { type: String, trim: true },
    specialRequests: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Booking =
  models.Booking || model<IBooking>("Booking", BookingSchema);
