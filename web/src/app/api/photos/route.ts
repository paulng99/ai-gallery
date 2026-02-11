export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const backendUrl = new URL("http://localhost:8000/photos");
  searchParams.forEach((value, key) => {
    backendUrl.searchParams.append(key, value);
  });
  
  const res = await fetch(backendUrl.toString());
  const data = await res.json();
  return Response.json(data);
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const res = await fetch("http://localhost:8000/photos", {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  return Response.json(data);
}
