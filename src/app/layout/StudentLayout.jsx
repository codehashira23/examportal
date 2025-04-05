import Navbar from "../../../components/components/navbar";
import Footer from "../../../components/components/footer";

export default function StudentLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar role="student" />
      <main className="container mx-auto p-6 flex-grow  ">{children}</main>
      <Footer role="student" />
    </div>
  );
}
