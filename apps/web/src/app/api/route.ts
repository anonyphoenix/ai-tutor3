import { getNFTMetadataAction } from "../actions/db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (id) {
    const nftMetadata = await getNFTMetadataAction(Number(id));
    if (Array.isArray(nftMetadata)) {
      return new Response(JSON.stringify(nftMetadata[0]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify(nftMetadata), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } else {
    return new Response("No ID provided", { status: 400 });
  }
}

// export async function POST(request: Request) {
//   // Handle POST request
//   return new Response("Created", { status: 201 });
// }
