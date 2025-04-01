import Navbar from "../components/navbar";

export default function StudentLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar role="student" />
      <main className="container mx-auto p-6">{children}</main>
    </div>
  );
}
