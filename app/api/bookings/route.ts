import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Booking } from "@/lib/models/Booking";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      departure,
      destination,
      departureDate,
      returnDate,
      passengers,
      tripType,
      aircraftPreference,
      specialRequests,
    } = body;

    // Basic validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !departure ||
      !destination ||
      !departureDate ||
      !passengers ||
      !tripType
    ) {
      return NextResponse.json(
        { success: false, message: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const booking = await Booking.create({
      firstName,
      lastName,
      email,
      phone,
      departure,
      destination,
      departureDate,
      returnDate: returnDate || undefined,
      passengers: Number(passengers),
      tripType,
      aircraftPreference: aircraftPreference || undefined,
      specialRequests: specialRequests || undefined,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your booking request has been received. We will contact you shortly.",
        bookingId: booking._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[BOOKING_ERROR]", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const bookings = await Booking.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    console.error("[BOOKING_FETCH_ERROR]", error);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
