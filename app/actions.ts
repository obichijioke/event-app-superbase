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

export const createLocationAction = async (formData: FormData) => {
  const supabase = createClient();
  const eventId = formData.get("event_id") as string;
  const { data, error } = await supabase
    .from("location")
    .insert([
      {
        venue: formData.get("venue") as string,
        address_line_1: formData.get("address_line_1") as string,
        address_line_2: formData.get("address_line_2") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        //country: formData.get("country") as string,
        zip_postal_code: formData.get("zip_postal_code") as string,
        latitude: parseFloat(formData.get("latitude") as string),
        longitude: parseFloat(formData.get("longitude") as string),
      },
    ])
    .select();

  if (data) {
    console.log(data);
    const formData = new FormData();
    formData.append("venue", data[0].id);
    updateEventAction(formData, eventId as string);
  }

  if (error) {
    console.error(error);
    return { error: error.message };
  }
  return { data };
};

export const updateEventAction = async (formData: FormData, rowId: string) => {
  const supabase = createClient();
  let updateData: { [key: string]: any } = {};

  formData.forEach((value, key) => {
    updateData[key] = value;
  });
  const { data, error } = await supabase
    .from("event")
    .update([updateData])
    .eq("id", rowId);
  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/create", "Failed to update event");
  }
  return data;
};

export const createEventAction = async (formData: FormData) => {
  const supabase = createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();
  // Extract form data
  const title = formData.get("name") as string;
  const description = formData.get("description") as string;
  const eventDate = formData.get("eventDate") as string;
  const startTime = formData.get("eventTime") as string;
  const category = formData.get("category") as string;
  const images = formData.getAll("images") as File[];
  const duration = formData.get("eventDuration") as string;
  // Upload images
  const imageUrls = [];
  for (const image of images) {
    if (image.size > 0) {
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
  }

  // Insert event data with all fields
  const { error, data } = await supabase
    .from("event")
    .insert([
      {
        title,
        description,
        event_date: eventDate,
        time: startTime,
        category: parseInt(category),
        image_urls: imageUrls,
        duration: duration,
        organizer: user.user?.id,
      },
    ])
    .select();

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/create", "Failed to create event");
  }
  console.log(data);
  return data;
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

export const createTicketAction = async (formData: FormData) => {
  const supabase = createClient();

  const eventId = formData.get("event_id") as string;
  const ticketName = formData.get("ticketName") as string;
  const totalTickets = formData.get("totalTickets") as string;
  const maxPerCustomer = formData.get("maxPerCustomer") as string;
  const ticketOrder = formData.get("ticketOrder") as string;
  const ticketDescription = formData.get("ticketDescription") as string;
  const price = parseFloat(formData.get("price") as string);
  const variationName = formData.get("variationName") as string;
  const unlimitedTotal = formData.get("unlimitedTotal") === "true";
  const unlimitedPerCustomer = formData.get("unlimitedPerCustomer") === "true";
  const earlyBirdDiscount = formData.get("earlyBirdDiscount") === "true";
  const earlyBirdDiscountPercentage = earlyBirdDiscount
    ? parseFloat(formData.get("earlyBirdDiscountPercentage") as string)
    : null;

  // Insert ticket into the "tickets" table
  const { data, error } = await supabase
    .from("tickets")
    .insert([
      {
        event_id: eventId,
        ticket_name: ticketName,
        total_tickets: unlimitedTotal ? null : parseInt(totalTickets, 10),
        max_per_customer: unlimitedPerCustomer
          ? null
          : parseInt(maxPerCustomer, 10),
        ticket_order: parseInt(ticketOrder, 10),
        ticket_description: ticketDescription,
        price: price,
        variation_name: variationName,
        unlimited_total: unlimitedTotal,
        unlimited_per_customer: unlimitedPerCustomer,
        early_bird_discount: earlyBirdDiscount,
        early_bird_discount_percentage: earlyBirdDiscountPercentage,
      },
    ])
    .select();

  if (error) {
    console.error("Error creating ticket:", error.message);
    return { error: error.message };
  }

  return { data };
};
