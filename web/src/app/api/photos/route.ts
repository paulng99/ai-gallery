export async function GET() {
  const res = await fetch("http://localhost:8000/photos");
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
