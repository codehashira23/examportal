import { dbConnect } from "./dbConnect";
import User from "../app/model/User";

export async function authMiddleware(email) {
  await dbConnect();

  if (!email) {
    return { status: 401, message: "Unauthorized: No user found" };
  }

  const user = await User.findOne({ email });

  if (!user) {
    return { status: 401, message: "Unauthorized: Invalid user" };
  }

  return { status: 200, user };
}

export async function adminMiddleware(email) {
  const auth = await authMiddleware(email);
  if (auth.status !== 200) return auth;

  if (auth.user.role !== "admin") {
    return { status: 403, message: "Forbidden: Admins only" };
  }

  return auth;
}

export async function studentMiddleware(email) {
  const auth = await authMiddleware(email);
  if (auth.status !== 200) return auth;

  if (auth.user.role !== "student") {
    return { status: 403, message: "Forbidden: Students only" };
  }

  return auth;
}
