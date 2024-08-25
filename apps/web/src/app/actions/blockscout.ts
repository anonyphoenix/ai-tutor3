// api.ts
import { NFTResponseType } from "../../utils/types"; // Adjust the import path as needed

const BASE_URL = "https://opencampus-codex.blockscout.com/api/v2";

export const fetchNFTs = async (address: string): Promise<NFTResponseType> => {
  const response = await fetch(
    `${BASE_URL}/addresses/${address}/nft?type=ERC-721,ERC-404,ERC-1155`,
    {
      headers: {
        accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch NFTs");
  }

  return response.json();
};
