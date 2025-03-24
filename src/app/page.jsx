export default function Home() {
  return (
    <main 
      className="relative flex items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.pexels.com/photos/952670/pexels-photo-952670.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" }}
    >
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content container */}
      <div className="relative z-10 text-center p-8 bg-white/10 backdrop-blur-md rounded-lg shadow-lg">
        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">
          Welcome to the Exam Portal
        </h1>
        <p className="text-lg text-white mt-2">
          Choose your role to proceed
        </p>

        {/* Role selection buttons */}
        <div className="mt-6 flex gap-6 justify-center">
          <a href="/login" className="px-6 py-3 text-lg font-semibold bg-blue-600 text-white rounded-lg shadow-md transition-all hover:bg-blue-700 hover:scale-105">
            Admin
          </a>
          <a href="/login" className="px-6 py-3 text-lg font-semibold bg-green-600 text-white rounded-lg shadow-md transition-all hover:bg-green-700 hover:scale-105">
            Student
          </a>
        </div>
      </div>
    </main>
  );
}
