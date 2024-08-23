"use server";

import { revalidatePath } from "next/cache";

const API_URL = process.env.API_URL;

export async function fetchAllUsersAction() {
  const response = await fetch(`${API_URL}/users`, {
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

export async function extractEventAction(txHash: string) {
  const response = await fetch(`${API_URL}/extract-event/${txHash}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to extract event data");
  }

  const result = await response.json();
  revalidatePath("/credits"); // Assuming you have a credits page
  return result;
}

export async function getUserCreditsAction(address: string) {
  const response = await fetch(`${API_URL}/user/${address}/credits`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user credits");
  }

  return response.json();
}

export async function createCustomBotAction(botData: {
  creatorAddress: string;
  name: string;
  description: string;
  prompt: string;
  isPublic?: boolean;
}) {
  const response = await fetch(`${API_URL}/bots`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(botData),
  });

  if (!response.ok) {
    throw new Error("Failed to create custom bot");
  }

  const result = await response.json();
  revalidatePath("/bots"); // Assuming you have a bots page
  return result;
}

export async function fetchPublicBotsAction() {
  const response = await fetch(`${API_URL}/bots/public`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch public bots");
  }

  return response.json();
}
