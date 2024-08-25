import { getNFTMetadataAction } from "../actions/db";

export async function GET(request: Request) {
  const id = request.url.split("/").pop();
  if (id) {
    const nftMetadata = await getNFTMetadataAction(Number(id));
    return new Response(JSON.stringify(nftMetadata), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } else {
    return new Response("Hello, World!", { status: 200 });
  }
}

// export async function POST(request: Request) {
//   // Handle POST request
//   return new Response("Created", { status: 201 });
// }
