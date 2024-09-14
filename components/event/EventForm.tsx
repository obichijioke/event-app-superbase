"use client";
import { useEffect, useCallback, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
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
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

const validationSchema = Yup.object().shape({
  eventName: Yup.string().required("Event name is required"),
  category: Yup.string().required("Category is required"),
  eventDate: Yup.date().required("Event date is required"),
  eventTime: Yup.string().required("Event time is required"),
  eventDuration: Yup.string().required("Event duration is required"),
  eventDescription: Yup.string().required("Event description is required"),
  bannerImages: Yup.array().min(1, "At least one image is required"),
});

export default function EventForm() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

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
      try {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (key === "bannerImages" && Array.isArray(value)) {
            value.forEach((file: File) =>
              formData.append("bannerImages", file)
            );
          } else {
            formData.append(key, value.toString());
          }
        });
        await createEventAction(formData);
        // Handle successful submission
      } catch (error) {
        // Handle error
        console.error("Error creating event:", error);
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
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventDate">Event Date*</Label>
                  <Input
                    id="eventDate"
                    type="date"
                    {...formik.getFieldProps("eventDate")}
                  />
                  {formik.touched.eventDate && formik.errors.eventDate && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.eventDate}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventTime">Time</Label>
                  <Input
                    id="eventTime"
                    type="time"
                    {...formik.getFieldProps("eventTime")}
                  />
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
                          layout="fill"
                          objectFit="cover"
                          className="rounded-lg"
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
              <ReactQuill
                id="eventDescription"
                value={formik.values.eventDescription}
                onChange={(value) =>
                  formik.setFieldValue("eventDescription", value)
                }
                className="h-48"
              />
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
