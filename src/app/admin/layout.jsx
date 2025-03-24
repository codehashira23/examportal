import { redirect } from "next/navigation";
import AdminLayout from "../layout/AdminLayout";
import { getSessionUser } from "../../lib/authmiddleware";

export default async function Layout({ children }) {
  const adminUser = await getSessionUser();

  if (!adminUser || adminUser.role !== "admin") {
    redirect("/login"); // Redirect unauthorized users
  }

  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
}
