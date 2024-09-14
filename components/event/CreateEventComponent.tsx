"use client";
import React, { useState, useEffect } from "react";
import EventForm from "./EventForm";
import LocationComponent from "./LocationForm";
import CreateTicket from "./CreateTicket";
import { Button } from "@/components/ui/button";

const CreateEventComponent = () => {
  const [step, setStep] = useState(1);
  const steps: Step[] = [
    { label: "Event Details", isActive: step === 1, isCompleted: step > 1 },
    { label: "Location", isActive: step === 2, isCompleted: step > 2 },
    { label: "Ticket", isActive: step === 3, isCompleted: step > 3 },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <StepComponent steps={steps} title="Create Event" />
      </div>
      {step === 1 && <EventForm />}
      {step === 2 && <LocationComponent />}
      {step === 3 && <CreateTicket />}
    </div>
  );
};

export default CreateEventComponent;

interface Step {
  label: string;
  isActive: boolean;
  isCompleted: boolean;
}

interface StepComponentProps {
  steps?: Step[];
  title?: string;
}

export function StepComponent({
  steps = [],
  title = "Create Event",
}: StepComponentProps) {
  if (!steps || steps.length === 0) {
    return null; // or return a placeholder/error message
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-center mb-8">{title}</h1>
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.label}>
            <div className="flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full mb-2 flex items-center justify-center
                  ${step.isActive ? "bg-green-500" : "bg-gray-300"}`}
                aria-current={step.isActive ? "step" : undefined}
              >
                {step.isCompleted && (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                )}
              </div>
              <span
                className={`text-sm ${step.isActive ? "text-black font-medium" : "text-gray-500"}`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className="flex-1 h-px bg-gray-300 mx-2"
                aria-hidden="true"
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
