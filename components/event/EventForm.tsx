"use client";
import { useEffect, useCallback, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { cn } from "@/lib/utils";
import { createEventAction } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Category } from "@/types/eventTypes";
import Loader from "@/components/ui/Loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { getCategories } from "@/app/actions";
//import ReactQuill from "react-quill";
//import "react-quill/dist/quill.snow.css";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { EditorState } from "draft-js";
import dynamic from "next/dynamic";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

const validationSchema = Yup.object().shape({
  eventName: Yup.string().required("Event name is required"),
  category: Yup.string().required("Category is required"),
  eventDate: Yup.date().required("Event date is required"),
  eventTime: Yup.string().required("Event time is required"),
  eventDuration: Yup.string().required("Event duration is required"),
  eventDescription: Yup.string().required("Event description is required"),
  bannerImages: Yup.array().min(1, "At least one image is required"),
});

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

export default function EventForm({
  completed,
}: {
  completed: (result: any) => void;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  useEffect(() => {
    const fetchCategories = async () => {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
      setLoading(false);
    };
    fetchCategories();
  }, []);

  const formik = useFormik({
    initialValues: {
      eventName: "",
      category: "",
      eventDate: "",
      eventTime: "",
      eventDuration: "1h",
      eventDescription: "",
      bannerImages: [] as File[],
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      try {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (key === "bannerImages" && Array.isArray(value)) {
            value.forEach((file: File) => formData.append("images", file));
          } else if (key === "eventDate") {
            const dateValue = value as string;
            formData.append(
              key,
              new Date(dateValue).toISOString().split("T")[0]
            );
          } else {
            formData.append(key, value.toString());
          }
        });

        // Convert eventTime and eventDuration to startTime and endTime
        const startTime = values.eventTime;
        const endTime = calculateEndTime(
          values.eventTime,
          values.eventDuration
        );
        formData.append("startTime", startTime);
        formData.append("endTime", endTime);

        // Rename some fields to match the backend expectations
        formData.set("name", formData.get("eventName") as string);
        formData.delete("eventName");
        formData.set("description", formData.get("eventDescription") as string);
        formData.delete("eventDescription");
        formData.set("category", formData.get("category") as string);
        formData.delete("category");

        const result = await createEventAction(formData);
        if (result) {
          // Handle successful submission
          console.log(result);
          completed(result);
          console.log("Event created successfully");
          // You might want to redirect the user or show a success message
        } else {
          // Handle error
          console.error("Error creating event:", result);
          // You might want to show an error message to the user
        }
      } catch (error) {
        console.error("Error creating event:", error);
        // Handle error, show message to user, etc.
      }
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      formik.setFieldValue("bannerImages", [
        ...formik.values.bannerImages,
        ...acceptedFiles,
      ]);
    },
    [formik]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    multiple: true,
  });

  const removeImage = (index: number) => {
    const newImages = [...formik.values.bannerImages];
    newImages.splice(index, 1);
    formik.setFieldValue("bannerImages", newImages);
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <Card className="w-full max-w-3xl mx-auto">
        <form onSubmit={formik.handleSubmit}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="eventName">Give your event a name.*</Label>
              <p className="text-sm text-gray-500">
                Choose a clear and catchy name that represents your event.
              </p>
              <Input
                id="eventName"
                placeholder="Enter event name here"
                {...formik.getFieldProps("eventName")}
              />
              {formik.touched.eventName && formik.errors.eventName && (
                <p className="text-red-500 text-sm">
                  {formik.errors.eventName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">
                Choose a category for your event.*
              </Label>
              <p className="text-sm text-gray-500">
                Select the category that best fits your event type.
              </p>
              <Select
                value={formik.values.category}
                onValueChange={(value) =>
                  formik.setFieldValue("category", value)
                }
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.category && formik.errors.category && (
                <p className="text-red-500 text-sm">{formik.errors.category}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>When is your event?*</Label>
              <p className="text-sm text-gray-500">
                Set the date, time, and duration of your event.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventDate">Event Date*</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formik.values.eventDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formik.values.eventDate ? (
                          format(new Date(formik.values.eventDate), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={
                          formik.values.eventDate
                            ? new Date(formik.values.eventDate)
                            : undefined
                        }
                        onSelect={(date) =>
                          formik.setFieldValue(
                            "eventDate",
                            date?.toISOString().split("T")[0]
                          )
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {formik.touched.eventDate && formik.errors.eventDate && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.eventDate}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventTime">Time</Label>
                  <Select
                    value={formik.values.eventTime}
                    onValueChange={(value) =>
                      formik.setFieldValue("eventTime", value)
                    }
                  >
                    <SelectTrigger id="eventTime">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 * 4 }, (_, i) => {
                        const hour = Math.floor(i / 4);
                        const minute = (i % 4) * 15;
                        return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
                      }).map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formik.touched.eventTime && formik.errors.eventTime && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.eventTime}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventDuration">Duration</Label>
                  <Select
                    value={formik.values.eventDuration}
                    onValueChange={(value) =>
                      formik.setFieldValue("eventDuration", value)
                    }
                  >
                    <SelectTrigger id="eventDuration">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30m">30m</SelectItem>
                      <SelectItem value="1h">1h</SelectItem>
                      <SelectItem value="2h">2h</SelectItem>
                      <SelectItem value="3h">3h</SelectItem>
                    </SelectContent>
                  </Select>
                  {formik.touched.eventDuration &&
                    formik.errors.eventDuration && (
                      <p className="text-red-500 text-sm">
                        {formik.errors.eventDuration}
                      </p>
                    )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Add images to your event banner.</Label>
              <p className="text-sm text-gray-500">
                Upload attractive images to showcase your event. You can add
                multiple images.
              </p>
              <div
                {...getRootProps()}
                className={`p-4 rounded-lg border-2 border-dashed ${
                  isDragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                }`}
              >
                <input {...getInputProps()} />
                {formik.values.bannerImages.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {formik.values.bannerImages.map((file, index) => (
                      <div key={index} className="relative aspect-square">
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={`Event banner preview ${index + 1}`}
                          fill
                          className="rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-white rounded-full p-1 hover:bg-gray-100"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <p className="text-sm text-gray-500">Add more images</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    {isDragActive ? (
                      <p>Drop the images here ...</p>
                    ) : (
                      <p>Drag 'n' drop images here, or click to select</p>
                    )}
                  </div>
                )}
              </div>
              {formik.touched.bannerImages && formik.errors.bannerImages && (
                <p className="text-red-500 text-sm">
                  {formik.errors.bannerImages.toString()}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventDescription">
                Please describe your event.
              </Label>
              <p className="text-sm text-gray-500">
                Provide a detailed description of your event, including what
                attendees can expect.
              </p>
              {typeof window !== "undefined" && (
                <Editor
                  editorState={editorState}
                  toolbarClassName="toolbarClassName border border-2 border-gray-600"
                  wrapperClassName="wrapperClassName border-2 border-dashed border-gray-300 rounded-lg"
                  editorClassName="editorClassName h-48 px-4"
                  onEditorStateChange={(newState) => {
                    setEditorState(newState);
                    formik.setFieldValue(
                      "eventDescription",
                      newState.getCurrentContent().getPlainText()
                    );
                  }}
                />
              )}
              {formik.touched.eventDescription &&
                formik.errors.eventDescription && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.eventDescription}
                  </p>
                )}
            </div>

            <Button type="submit" className="w-full">
              Create Event
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}

// Helper function to calculate end time
function calculateEndTime(startTime: string, duration: string): string {
  const [hours, minutes] = startTime.split(":").map(Number);
  const durationInMinutes = duration === "30m" ? 30 : parseInt(duration) * 60;

  const endDate = new Date(2000, 0, 1, hours, minutes + durationInMinutes);
  return endDate.toTimeString().slice(0, 5);
}
