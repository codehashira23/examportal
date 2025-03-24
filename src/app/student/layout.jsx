import { redirect } from "next/navigation";
import StudentLayout from "../layout/StudentLayout";
import { getSessionUser } from "../../lib//authmiddleware";

export default async function Layout({ children }) {
  const studentUser = await getSessionUser();

  if (!studentUser || studentUser.role !== "student") {
    redirect("/login"); // Redirect unauthorized users
  }

  return (
    <StudentLayout>
      {children}
    </StudentLayout>
  );
}
