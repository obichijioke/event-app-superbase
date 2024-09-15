"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = createClient();
  const origin = headers().get("origin");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link."
    );
  }
};

export const getCategories = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from("category").select("*");
  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  }
  return data;
};

export const createEventAction = async (formData: FormData) => {
  const supabase = createClient();

  // Extract form data
  const title = formData.get("name") as string;
  const description = formData.get("description") as string;
  const eventDate = formData.get("eventDate") as string;
  const startTime = formData.get("eventTime") as string;
  const categoryId = formData.get("category") as string;
  const images = formData.getAll("bannerImages") as File[];
  const duration = formData.get("eventDuration") as string;

  // Upload images
  const imageUrls = [];
  for (const image of images) {
    const fileName = `${Date.now()}_${image.name}`;
    const { data, error } = await supabase.storage
      .from("event-images")
      .upload(fileName, image);

    if (error) {
      console.error("Image upload error:", error.message);
      return encodedRedirect("error", "/create", "Failed to upload image");
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("event-images").getPublicUrl(fileName);

    imageUrls.push(publicUrl);
  }

  // Insert event data with all fields
  const { error } = await supabase.from("event").insert({
    title,
    description,
    event_date: eventDate,
    time: startTime,
    category: categoryId,
    image_urls: imageUrls,
    duration: duration,
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/create-event", "Failed to create event");
  }

  return encodedRedirect("success", "/events", "Event created successfully");
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = createClient();
  const origin = headers().get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed"
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
