import Link from "next/link";

export default function LoginFailedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-blue-950">
      {/* Card Glassmorphism */}
      <div className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-90 h-90 text-center flex flex-col justify-center">
        {/* Title */}
        <h1 className="text-white font-bold text-3xl mb-6 drop-shadow">
          Login Gagal
        </h1>

        {/* Message */}
        <p className="text-white mb-8">
          Username atau password Anda salah.
        </p>

        {/* Back button */}
        <Link href="/login/login">
          <button className="bg-blue-700/80 text-white font-bold py-2 px-4 rounded hover:bg-blue-900/90 transition">
            Kembali
          </button>
        </Link>
      </div>
    </div>
  );
}
