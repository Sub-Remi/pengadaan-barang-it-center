import Link from "next/link";
export default function PilihPeran() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-blue-950">
      {/* Card Glassmorphism */}
      <div className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-90 h-90 text-center flex flex-col justify-center">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="/logo/ItCenter.png" alt="Logo IT Center" className="h-14" />
        </div>

        {/* Title */}
        <h1 className="text-center text-white font-bold text-2xl mb-6 drop-shadow">
          Anda Sebagai
        </h1>

        {/* Dropdown Pilihan Peran */}
        <form className="flex flex-col space-y-6">
          <select
            defaultValue=""
            className="p-2 bg-white/20 text-white placeholder-gray-100 rounded 
                       focus:outline-none focus:ring-2 focus:ring-blue-300 backdrop-blur-sm"
          >
            <option value="" disabled hidden>Pilih Peran</option>
            <option value="kepala-ga" className="text-black">Kepala General Affair</option>
            <option value="kepala-subdiv" className="text-black">Divisi</option>
            <option value="staf-finance" className="text-black">Finance</option>
          </select>

          {/* Tombol Submit */}
          <Link href="/login/login">
          <button className="bg-blue-700/80 text-white font-bold py-2 px-4 rounded hover:bg-blue-900/90 transition">
            Submit
          </button>
        </Link>
        </form>
      </div>
    </div>
  );
}
