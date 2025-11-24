export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-blue-950">
      {/* Card Glassmorphism */}
      <div className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-90 h-90">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="/logo/ItCenter.png" alt="Logo IT Center" className="h-14" />
        </div>

        {/* Title */}
        <h1 className="text-center text-white font-bold text-2xl mb-6 drop-shadow">
          Login
        </h1>

        {/* Form */}
        <form className="flex flex-col space-y-6">
          <input
            type="text"
            placeholder="Username"
            className="p-2 bg-white/20 text-white placeholder-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 backdrop-blur-sm"
          />
          <input
            type="password"
            placeholder="Password"
            className="p-2 bg-white/20 text-white placeholder-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 backdrop-blur-sm"
          />
          <button
            type="submit"
            className="bg-blue-700/80 text-white font-bold py-2 rounded hover:bg-blue-900/90 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
