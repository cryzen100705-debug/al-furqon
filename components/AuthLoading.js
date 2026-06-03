export default function AuthLoading({ role = "user" }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-950 via-emerald-900 to-black text-white">
      <div className="text-center px-6">
        <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-white/20 border-t-yellow-300" />

        <h1 className="text-2xl md:text-3xl font-black">
          Memeriksa Akses {role}
        </h1>

        <p className="mt-3 text-sm text-white/70">
          Mohon tunggu sebentar, sistem sedang memvalidasi sesi login.
        </p>
      </div>
    </div>
  );
}