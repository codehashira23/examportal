import { cookies } from "next/headers";
import { dbConnect } from "./dbConnect";
import User from "../app/model/User";
import jwt from "jsonwebtoken";

export async function getSessionUser() {
  await dbConnect();

  // ✅ Ensure cookies() is properly awaited
  const cookieStore = await cookies();  
  const token = cookieStore.get("token")?.value; 

  if (!token) return null;

  try {
    // Decode the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by ID from the decoded token
    const user = await User.findById(decoded.id);

    return user || null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}
