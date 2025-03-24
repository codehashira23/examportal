import { adminMiddleware } from "../../../lib/middleware";

export async function GET(req) {
  const auth = await adminMiddleware(req);
  if (auth.status !== 200) {
    return new Response(JSON.stringify({ message: auth.message }), { status: auth.status });
  }

  return new Response(JSON.stringify({ message: "Welcome Admin" }), { status: 200 });
}
