import { dbConnect } from "../../../../lib/dbConnect";           
import User from "../../../model/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";  // ✅ Import bcrypt

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();
    
    if (!email || !password) {
      return new Response(JSON.stringify({ message: "Email and password are required" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    // ✅ Compare plain text password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ message: "Invalid password" }), { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role,
        profileImage: user.profileImage || null 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );

    // Create user object without sensitive data
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage || null
    };

    return new Response(
      JSON.stringify({ 
        token, 
        user: userData,
        role: user.role,
        message: "Login successful" 
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`
        }
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
