import { dbConnect } from "../../../../lib/dbConnet";
import User from "../../../model/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await dbConnect(); // Connect to MongoDB

    const { name, email, password, role } = await req.json();
    console.log("📥 Signup Attempt:", { name, email, role });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔑 Hashed Password:", hashedPassword);

    // Create new user
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    return new Response(
      JSON.stringify({ message: "Signup successful", user: newUser }), 
      { status: 201 }
    );

  } catch (error) {
    console.error("🚨 Signup Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
