import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  if (!query) {
    return NextResponse.json({ 
      items: [],
      total: 0,
      page: 1,
      limit: 20
    });
  }

  try {
    const res = await fetch("http://localhost:8000/ai/search/semantic", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: query,
        limit: limit * page // Fetch more to handle pagination
      }),
    });

    if (!res.ok) {
      throw new Error("Search failed");
    }

    const data = await res.json();
    
    // Simple pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = data.results?.slice(startIndex, endIndex) || [];
    
    return NextResponse.json({
      items: paginatedResults,
      total: data.results?.length || 0,
      page,
      limit,
      query: data.query
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed", items: [], total: 0 },
      { status: 500 }
    );
  }
}

// Keep GET for backward compatibility
export async function GET(req: NextRequest) {
  return POST(req);
}
