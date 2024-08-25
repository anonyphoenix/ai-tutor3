"use server";

const API_URL = "https://simple-api.glif.app";
const API_TOKEN = process.env.GLIF_API_TOKEN;

type GlifResponse = {
  id: string;
  inputs: {
    input1: string;
  };
  output: string;
};

type GlifRequest = {
  id: string;
  inputs: [string, string];
};

export async function processGlifAction(
  glifId: string,
  inputStrings: string[]
) {
  if (!API_TOKEN) {
    throw new Error("GLIF API token is not set");
  }

  const data: GlifRequest = {
    id: glifId,
    inputs: [inputStrings[0], inputStrings[1]],
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: GlifResponse = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error processing Glif action:", error);
    throw error;
  }
}
