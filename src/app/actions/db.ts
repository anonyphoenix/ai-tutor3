"use server";

import { revalidatePath } from "next/cache";

export async function fetchAllUsersAction() {
  const response = await fetch(`${process.env.API_URL}/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users data");
  }

  return response.json();
}
