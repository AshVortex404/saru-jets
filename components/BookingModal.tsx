"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departure: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  passengers: string;
  tripType: "one-way" | "round-trip";
  aircraftPreference: string;
  specialRequests: string;
}

const AIRCRAFT_OPTIONS = [
  "No Preference",
  "Light Jet (4-7 passengers)",
  "Midsize Jet (7-9 passengers)",
  "Super Midsize Jet (9-12 passengers)",
  "Heavy Jet (12-16 passengers)",
  "Ultra Long Range Jet (up to 19 passengers)",
  "VIP Airliner",
];

const initialFormData: BookingFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  departure: "",
  destination: "",
  departureDate: "",
  returnDate: "",
  passengers: "1",
  tripType: "one-way",
  aircraftPreference: "",
  specialRequests: "",
};

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// --- Validation helpers ---
type ValidationErrors = Partial<Record<keyof BookingFormData, string>>;
type TouchedFields = Partial<Record<keyof BookingFormData, boolean>>;

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function validatePhone(phone: string) {
  // Allow international formats: +1 (555) 000-0000 / +44 7911 123456 / 9876543210
  return /^[\+]?[\d\s\-\(\)]{7,20}$/.test(phone.trim());
}

function getFieldErrors(data: BookingFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.firstName.trim()) errors.firstName = "First name is required.";
  if (!data.lastName.trim()) errors.lastName = "Last name is required.";

  if (!data.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!validateEmail(data.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!data.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!validatePhone(data.phone)) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (!data.departure.trim()) errors.departure = "Departure city or airport is required.";
  if (!data.destination.trim()) errors.destination = "Destination city or airport is required.";
  if (!data.departureDate) errors.departureDate = "Departure date is required.";
  if (data.tripType === "round-trip" && !data.returnDate)
    errors.returnDate = "Return date is required for round trips.";

  return errors;
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>(initialFormData);
  const [touched, setTouched] = useState<TouchedFields>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const allErrors = getFieldErrors(formData);

  // Returns the error for a field only if it has been touched
  const fieldError = (name: keyof BookingFormData) =>
    touched[name] ? allErrors[name] : undefined;

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setFormData(initialFormData);
        setTouched({});
        setSubmitStatus("idle");
        setErrorMessage("");
        setIsSubmitting(false);
      }, 500);
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (name: keyof BookingFormData) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleTripTypeChange = (type: "one-way" | "round-trip") => {
    setFormData((prev) => ({ ...prev, tripType: type }));
  };

  const step1Fields: (keyof BookingFormData)[] = ["firstName", "lastName", "email", "phone"];
  const step2Fields: (keyof BookingFormData)[] = ["departure", "destination", "departureDate", ...(formData.tripType === "round-trip" ? ["returnDate" as const] : [])];

  const isStep1Valid = () => step1Fields.every((f) => !allErrors[f]);
  const isStep2Valid = () => step2Fields.every((f) => !allErrors[f]);

  const handleNext = () => {
    if (step === 1) {
      // Touch all step-1 fields to reveal errors
      setTouched((prev) => ({ ...prev, ...Object.fromEntries(step1Fields.map((f) => [f, true])) }));
      if (isStep1Valid()) setStep(2);
    } else if (step === 2) {
      setTouched((prev) => ({ ...prev, ...Object.fromEntries(step2Fields.map((f) => [f, true])) }));
      if (isStep2Valid()) setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitStatus("success");
      } else {
        setErrorMessage(data.message || "Something went wrong.");
        setSubmitStatus("error");
      }
    } catch {
      setErrorMessage("Network error. Please try again.");
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 30 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(14,14,20,0.99) 0%, rgba(20,20,30,0.99) 100%)",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow:
                  "0 40px 120px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
            >
              {/* Header gradient bar */}
              <div
                className="h-[2px] w-full rounded-t-2xl"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(200,170,110,0.8), rgba(255,215,140,0.9), rgba(200,170,110,0.8), transparent)",
                }}
              />

              <div className="p-8 md:p-10">
                {/* Close button */}
                <button
                  id="booking-modal-close"
                  onClick={onClose}
                  className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200"
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    background: "rgba(255,255,255,0.05)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)";
                  }}
                  aria-label="Close booking form"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M1 1L11 11M11 1L1 11"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                {/* Success State */}
                {submitStatus === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center text-center py-8"
                  >
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(200,170,110,0.2), rgba(255,215,140,0.1))",
                        border: "1px solid rgba(200,170,110,0.3)",
                      }}
                    >
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path
                          d="M8 16.5L13.5 22L24 10"
                          stroke="rgba(200,170,110,0.9)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <h2
                      className="text-2xl font-light tracking-wide mb-3"
                      style={{ color: "rgba(255,255,255,0.92)" }}
                    >
                      Booking Request Received
                    </h2>
                    <p
                      className="text-sm leading-relaxed mb-8 max-w-sm"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      Your request has been submitted successfully. Our aviation concierge team will contact you within 2 hours to confirm your booking.
                    </p>
                    <button
                      id="booking-success-close"
                      onClick={onClose}
                      className="px-10 py-3.5 rounded-full text-[11px] uppercase tracking-[0.18em] transition-all duration-300"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(200,170,110,0.25), rgba(255,215,140,0.15))",
                        border: "1px solid rgba(200,170,110,0.4)",
                        color: "rgba(200,170,110,0.9)",
                      }}
                    >
                      Close
                    </button>
                  </motion.div>
                ) : (
                  <>
                    {/* Header */}
                    <div className="mb-8">
                      <p
                        className="text-[11px] uppercase tracking-[0.22em] mb-3"
                        style={{ color: "rgba(212,175,112,0.9)" }}
                      >
                        Private Aviation
                      </p>
                      <h2
                        className="text-3xl md:text-4xl font-light tracking-wide"
                        style={{ color: "rgba(245,245,247,0.97)", fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)" }}
                      >
                        Book Your Flight
                      </h2>
                    </div>

                    {/* Step Indicator */}
                    <div className="flex items-center gap-3 mb-8">
                      {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center gap-3">
                          <div
                            className="relative flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-medium tracking-wide transition-all duration-500"
                            style={{
                              background:
                                step >= s
                                  ? "linear-gradient(135deg, rgba(200,170,110,0.4), rgba(255,215,140,0.2))"
                                  : "rgba(255,255,255,0.04)",
                              border:
                                step >= s
                                  ? "1px solid rgba(200,170,110,0.5)"
                                  : "1px solid rgba(255,255,255,0.08)",
                              color:
                                step >= s
                                  ? "rgba(200,170,110,0.9)"
                                  : "rgba(255,255,255,0.25)",
                            }}
                          >
                            {s}
                          </div>
                          {s < 3 && (
                            <div
                              className="h-px w-10 transition-all duration-500"
                              style={{
                                background:
                                  step > s
                                    ? "rgba(200,170,110,0.4)"
                                    : "rgba(255,255,255,0.08)",
                              }}
                            />
                          )}
                        </div>
                      ))}
                      <span
                        className="ml-2 text-[11px] uppercase tracking-[0.15em]"
                        style={{ color: "rgba(245,245,247,0.55)" }}
                      >
                        {step === 1 && "Contact Details"}
                        {step === 2 && "Flight Details"}
                        {step === 3 && "Preferences"}
                      </span>
                    </div>

                    {/* Form Steps */}
                    <AnimatePresence mode="wait">
                      {step === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-5"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <FormField
                              label="First Name"
                              id="booking-firstName"
                              name="firstName"
                              type="text"
                              placeholder="James"
                              value={formData.firstName}
                              onChange={handleChange}
                              onBlur={() => handleBlur("firstName")}
                              error={fieldError("firstName")}
                              required
                            />
                            <FormField
                              label="Last Name"
                              id="booking-lastName"
                              name="lastName"
                              type="text"
                              placeholder="Harrison"
                              value={formData.lastName}
                              onChange={handleChange}
                              onBlur={() => handleBlur("lastName")}
                              error={fieldError("lastName")}
                              required
                            />
                          </div>
                          <FormField
                            label="Email Address"
                            id="booking-email"
                            name="email"
                            type="email"
                            placeholder="james@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={() => handleBlur("email")}
                            error={fieldError("email")}
                            required
                          />
                          <FormField
                            label="Phone Number"
                            id="booking-phone"
                            name="phone"
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            value={formData.phone}
                            onChange={handleChange}
                            onBlur={() => handleBlur("phone")}
                            error={fieldError("phone")}
                            required
                          />
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-5"
                        >
                          {/* Trip Type */}
                          <div>
                            <label
                              className="block text-[12px] uppercase tracking-[0.14em] mb-3 font-medium"
                              style={{ color: "rgba(245,245,247,0.7)" }}
                            >
                              Trip Type
                            </label>
                            <div className="flex gap-3">
                              {(["one-way", "round-trip"] as const).map((type) => (
                                <button
                                  key={type}
                                  id={`booking-triptype-${type}`}
                                  type="button"
                                  onClick={() => handleTripTypeChange(type)}
                                  className="flex-1 py-2.5 rounded-lg text-[11px] uppercase tracking-[0.12em] transition-all duration-300"
                                  style={{
                                    background:
                                      formData.tripType === type
                                        ? "linear-gradient(135deg, rgba(200,170,110,0.25), rgba(255,215,140,0.12))"
                                        : "rgba(255,255,255,0.03)",
                                    border:
                                      formData.tripType === type
                                        ? "1px solid rgba(200,170,110,0.4)"
                                        : "1px solid rgba(255,255,255,0.06)",
                                    color:
                                      formData.tripType === type
                                        ? "rgba(200,170,110,0.9)"
                                        : "rgba(255,255,255,0.35)",
                                  }}
                                >
                                  {type === "one-way" ? "One Way" : "Round Trip"}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <FormField
                              label="Departure City / Airport"
                              id="booking-departure"
                              name="departure"
                              type="text"
                              placeholder="New York (JFK)"
                              value={formData.departure}
                              onChange={handleChange}
                              onBlur={() => handleBlur("departure")}
                              error={fieldError("departure")}
                              required
                            />
                            <FormField
                              label="Destination City / Airport"
                              id="booking-destination"
                              name="destination"
                              type="text"
                              placeholder="London (LHR)"
                              value={formData.destination}
                              onChange={handleChange}
                              onBlur={() => handleBlur("destination")}
                              error={fieldError("destination")}
                              required
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <FormField
                              label="Departure Date"
                              id="booking-departureDate"
                              name="departureDate"
                              type="date"
                              value={formData.departureDate}
                              onChange={handleChange}
                              onBlur={() => handleBlur("departureDate")}
                              error={fieldError("departureDate")}
                              min={today}
                              required
                            />
                            {formData.tripType === "round-trip" && (
                              <FormField
                                label="Return Date"
                                id="booking-returnDate"
                                name="returnDate"
                                type="date"
                                value={formData.returnDate}
                                onChange={handleChange}
                                onBlur={() => handleBlur("returnDate")}
                                error={fieldError("returnDate")}
                                min={formData.departureDate || today}
                                required
                              />
                            )}
                          </div>

                          <div className="max-w-[180px]">
                            <label
                              htmlFor="booking-passengers"
                              className="block text-[12px] uppercase tracking-[0.14em] mb-2 font-medium"
                              style={{ color: "rgba(245,245,247,0.7)" }}
                            >
                              Passengers
                            </label>
                            <div className="relative">
                              <select
                                id="booking-passengers"
                                name="passengers"
                                value={formData.passengers}
                                onChange={handleChange}
                                className="w-full appearance-none rounded-lg px-4 py-3 text-sm outline-none transition-all duration-300 cursor-pointer"
                                style={{
                                  background: "rgba(255,255,255,0.04)",
                                  border: "1px solid rgba(255,255,255,0.08)",
                                  color: "rgba(255,255,255,0.75)",
                                }}
                              >
                                {[...Array(20)].map((_, i) => (
                                  <option
                                    key={i + 1}
                                    value={i + 1}
                                    style={{ background: "#111", color: "#fff" }}
                                  >
                                    {i + 1} {i === 0 ? "Passenger" : "Passengers"}
                                  </option>
                                ))}
                              </select>
                              <div
                                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                                style={{ color: "rgba(255,255,255,0.3)" }}
                              >
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                                  <path
                                    d="M1 1L5 5L9 1"
                                    stroke="currentColor"
                                    strokeWidth="1.2"
                                    strokeLinecap="round"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {step === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-5"
                        >
                          <div>
                            <label
                              htmlFor="booking-aircraftPreference"
                              className="block text-[12px] uppercase tracking-[0.14em] mb-2 font-medium"
                              style={{ color: "rgba(245,245,247,0.7)" }}
                            >
                              Aircraft Preference
                            </label>
                            <div className="relative">
                              <select
                                id="booking-aircraftPreference"
                                name="aircraftPreference"
                                value={formData.aircraftPreference}
                                onChange={handleChange}
                                className="w-full appearance-none rounded-lg px-4 py-3 text-sm outline-none transition-all duration-300 cursor-pointer"
                                style={{
                                  background: "rgba(255,255,255,0.04)",
                                  border: "1px solid rgba(255,255,255,0.08)",
                                  color: "rgba(255,255,255,0.75)",
                                }}
                              >
                                {AIRCRAFT_OPTIONS.map((opt) => (
                                  <option
                                    key={opt}
                                    value={opt}
                                    style={{ background: "#111", color: "#fff" }}
                                  >
                                    {opt}
                                  </option>
                                ))}
                              </select>
                              <div
                                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                                style={{ color: "rgba(255,255,255,0.3)" }}
                              >
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                                  <path
                                    d="M1 1L5 5L9 1"
                                    stroke="currentColor"
                                    strokeWidth="1.2"
                                    strokeLinecap="round"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label
                              htmlFor="booking-specialRequests"
                              className="block text-[12px] uppercase tracking-[0.14em] mb-2 font-medium"
                              style={{ color: "rgba(245,245,247,0.7)" }}
                            >
                              Special Requests{" "}
                              <span style={{ color: "rgba(245,245,247,0.35)" }}>(optional)</span>
                            </label>
                            <textarea
                              id="booking-specialRequests"
                              name="specialRequests"
                              value={formData.specialRequests}
                              onChange={handleChange}
                              rows={4}
                              placeholder="In-flight catering preferences, ground transport requirements, or any other special arrangements..."
                              className="w-full rounded-lg px-4 py-3 text-sm outline-none resize-none transition-all duration-300"
                              style={{
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                color: "rgba(255,255,255,0.75)",
                              }}
                              onFocus={(e) => {
                                e.currentTarget.style.borderColor = "rgba(200,170,110,0.35)";
                                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                              }}
                              onBlur={(e) => {
                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                              }}
                            />
                          </div>

                          {/* Summary */}
                          <div
                            className="mt-2 p-5 rounded-xl"
                            style={{
                              background: "rgba(255,255,255,0.02)",
                              border: "1px solid rgba(255,255,255,0.06)",
                            }}
                          >
                            <p
                              className="text-[11px] uppercase tracking-[0.18em] mb-4 font-medium"
                              style={{ color: "rgba(212,175,112,0.85)" }}
                            >
                              Booking Summary
                            </p>
                            <div className="grid grid-cols-2 gap-y-3 text-[13px]">
                              <SummaryRow label="Name" value={`${formData.firstName} ${formData.lastName}`} />
                              <SummaryRow label="Email" value={formData.email} />
                              <SummaryRow label="Route" value={`${formData.departure} → ${formData.destination}`} />
                              <SummaryRow label="Date" value={formData.departureDate} />
                              <SummaryRow label="Trip" value={formData.tripType === "one-way" ? "One Way" : "Round Trip"} />
                              <SummaryRow label="Passengers" value={`${formData.passengers}`} />
                            </div>
                          </div>

                          {submitStatus === "error" && (
                            <motion.div
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="py-3 px-4 rounded-lg text-sm"
                              style={{
                                background: "rgba(255,80,80,0.08)",
                                border: "1px solid rgba(255,80,80,0.2)",
                                color: "rgba(255,100,100,0.9)",
                              }}
                            >
                              {errorMessage}
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      {step > 1 ? (
                        <button
                          id="booking-back"
                          type="button"
                          onClick={handleBack}
                          className="text-[11px] uppercase tracking-[0.14em] transition-all duration-200"
                          style={{ color: "rgba(255,255,255,0.35)" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
                        >
                          ← Back
                        </button>
                      ) : (
                        <div />
                      )}

                      {step < 3 ? (
                        <button
                          id={`booking-next-step${step}`}
                          type="button"
                          onClick={handleNext}
                          disabled={(step === 1 && !isStep1Valid()) || (step === 2 && !isStep2Valid())}
                          className="px-10 py-3 rounded-full text-[11px] uppercase tracking-[0.18em] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(200,170,110,0.3), rgba(255,215,140,0.15))",
                            border: "1px solid rgba(200,170,110,0.4)",
                            color: "rgba(200,170,110,0.9)",
                          }}
                        >
                          Continue →
                        </button>
                      ) : (
                        <button
                          id="booking-submit"
                          type="button"
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          className="px-10 py-3 rounded-full text-[11px] uppercase tracking-[0.18em] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(200,170,110,0.35), rgba(255,215,140,0.2))",
                            border: "1px solid rgba(200,170,110,0.5)",
                            color: "rgba(200,170,110,1)",
                          }}
                        >
                          {isSubmitting && (
                            <svg
                              className="animate-spin"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeDasharray="60"
                                strokeDashoffset="20"
                              />
                            </svg>
                          )}
                          {isSubmitting ? "Submitting..." : "Confirm Booking"}
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Helper: Form field
interface FormFieldProps {
  label: string;
  id: string;
  name: string;
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  required?: boolean;
  min?: string;
  error?: string;
}

function FormField({ label, id, name, type, placeholder, value, onChange, onBlur, required, min, error }: FormFieldProps) {
  const hasError = Boolean(error);
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[12px] uppercase tracking-[0.14em] mb-2 font-medium"
        style={{ color: "rgba(245,245,247,0.7)" }}
      >
        {label}
        {required && (
          <span className="ml-1" style={{ color: "rgba(212,175,112,0.8)" }}>
            *
          </span>
        )}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        min={min}
        className="w-full rounded-lg px-4 py-3.5 text-[15px] outline-none transition-all duration-300"
        style={{
          background: hasError ? "rgba(255,80,80,0.05)" : "rgba(255,255,255,0.05)",
          border: hasError ? "1px solid rgba(255,90,90,0.45)" : "1px solid rgba(255,255,255,0.12)",
          color: "rgba(245,245,247,0.92)",
          colorScheme: "dark",
          letterSpacing: "0.01em",
        }}
        onFocus={(e) => {
          if (!hasError) {
            e.currentTarget.style.borderColor = "rgba(212,175,112,0.5)";
            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(212,175,112,0.06)";
          } else {
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,80,80,0.08)";
          }
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = hasError ? "rgba(255,90,90,0.45)" : "rgba(255,255,255,0.12)";
          e.currentTarget.style.background = hasError ? "rgba(255,80,80,0.05)" : "rgba(255,255,255,0.05)";
          e.currentTarget.style.boxShadow = "none";
          onBlur?.();
        }}
      />
      {hasError && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="mt-1.5 text-[11px] tracking-wide"
          style={{ color: "rgba(255,100,100,0.85)" }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

// Helper: Summary row
function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <span style={{ color: "rgba(245,245,247,0.45)" }} className="text-[11px] uppercase tracking-[0.12em] font-medium">
        {label}
      </span>
      <span style={{ color: "rgba(245,245,247,0.88)" }} className="truncate text-[13px]">
        {value || "—"}
      </span>
    </>
  );
}
