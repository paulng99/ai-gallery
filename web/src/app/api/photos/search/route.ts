
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return Response.json({ items: [] });
  }

  const res = await fetch("http://localhost:8000/search/semantic", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: query,
      limit: 20, // Default limit
    }),
  });

  const data = await res.json();
  // The backend returns { results: [...], query: "..." }
  // We should map 'results' to 'items' to match the /api/photos format if possible,
  // or just return as is and handle in frontend.
  // /api/photos returns { items: [...] }
  // Let's normalize it to { items: data.results }
  
  return Response.json({ items: data.results });
}
