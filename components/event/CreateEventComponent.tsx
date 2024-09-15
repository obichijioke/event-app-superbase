"use client";
import React, { useState, useEffect } from "react";
import EventForm from "./EventForm";
import LocationComponent from "./LocationForm";
import CreateTicket from "./CreateTicket";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";

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
    return null;
  }

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-center mb-12">{title}</h1>
      <nav aria-label="Progress">
        <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
          {steps.map((step, stepIdx) => (
            <li key={step.label} className="md:flex-1">
              <div className="group flex flex-col border-l-4 border-indigo-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-indigo-600">
                  Step {stepIdx + 1}
                </span>
                <span className="text-lg font-semibold">{step.label}</span>
                <span className="mt-1 flex items-center text-sm font-medium text-gray-500">
                  {step.isCompleted ? (
                    <>
                      <CheckIcon
                        className="h-5 w-5 flex-shrink-0 text-indigo-600"
                        aria-hidden="true"
                      />
                      <span className="ml-2 text-indigo-600">Completed</span>
                    </>
                  ) : step.isActive ? (
                    <span className="text-indigo-600">In progress</span>
                  ) : (
                    <span>Pending</span>
                  )}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
