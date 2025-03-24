import { dbConnect } from "../../../../lib/dbConnet";
import User from "../../../model/User";

export async function POST(req) {
  await dbConnect();
  const { name, email, password, role } = await req.json();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new Response(JSON.stringify({ message: "Email already exists" }), { status: 400 });
  }

  const user = new User({ name, email, password, role });
  await user.save();

  return new Response(JSON.stringify({ message: "User registered successfully" }), { status: 201 });
}
