import Navbar from "../components/navbar";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar role="admin" />
      <main className="container mx-auto p-6">{children}</main>
    </div>
  );
}
