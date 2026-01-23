import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-amber-400/20 blur-[140px]" />
        <div className="absolute left-0 top-1/3 h-40 w-40 rounded-full bg-sky-400/20 blur-[90px]" />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-lg font-bold text-slate-950">
            DB
          </span>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-200">
              Daily Budget
            </p>
            <p className="text-lg font-semibold">Kelola uang dengan tenang</p>
          </div>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
          >
            Daftar Gratis
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-20 pt-6">
        <section className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
              Budgeting harian yang fokus
            </p>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">
              Catat pemasukan, kontrol pengeluaran, dan lihat arah uangmu
              bergerak.
            </h1>
            <p className="text-base text-slate-200 md:text-lg">
              Daily Budget membantu kamu mengatur transaksi harian secara cepat,
              membuat kategori yang rapi, dan membaca ringkasan keuangan tanpa
              stres. Fokus pada keputusan, bukan spreadsheet.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/register"
                className="rounded-full bg-emerald-400 px-6 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
              >
                Mulai Sekarang
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-white/20 px-6 py-3 text-center text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
              >
                Login
              </Link>
              <Link
                href="/dashboard"
                className="text-sm font-semibold text-emerald-200 underline-offset-4 hover:underline"
              >
                Buka dashboard (jika sudah login)
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-emerald-500/10 backdrop-blur">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Ringkasan Mingguan</h3>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-100">
                  Update hari ini
                </span>
              </div>
              <div className="mt-6 grid gap-4">
                {["Pemasukan", "Pengeluaran", "Saldo"].map((label, index) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                  >
                    <div>
                      <p className="text-sm text-slate-300">{label}</p>
                      <p className="text-xl font-semibold">
                        {index === 0 && "+ Rp12.450.000"}
                        {index === 1 && "- Rp5.380.000"}
                        {index === 2 && "Rp7.070.000"}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-white/10" />
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 hidden w-48 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200 shadow-lg shadow-slate-950/40 backdrop-blur md:block">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">
                Insight
              </p>
              <p className="mt-2 font-semibold">
                62% pengeluaran terbesar ada di kategori makanan minggu ini.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-100 md:grid-cols-3">
          {[
            {
              value: "3 menit",
              label: "Setup awal sampai siap mencatat",
            },
            {
              value: "24/7",
              label: "Akses data keuangan kapan saja",
            },
            {
              value: "100%",
              label: "Data diolah cepat dan rapi",
            },
          ].map((item) => (
            <div key={item.value} className="space-y-2">
              <p className="text-3xl font-semibold text-emerald-200">
                {item.value}
              </p>
              <p className="text-sm text-slate-300">{item.label}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {[
            {
              title: "Kategori fleksibel",
              desc: "Buat kategori income/expense sesuai kebutuhanmu tanpa batasan.",
            },
            {
              title: "Transaksi super cepat",
              desc: "Input transaksi dalam hitungan detik dengan form yang simpel.",
            },
            {
              title: "Ringkasan jelas",
              desc: "Lihat saldo, pemasukan, dan pengeluaran tanpa perhitungan manual.",
            },
          ].map((item, index) => (
            <div
              key={item.title}
              className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-emerald-400/60"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">
                0{index + 1}
              </p>
              <h3 className="mt-3 text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm text-slate-300">{item.desc}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="text-2xl font-semibold md:text-3xl">
              Cara kerja yang langsung terasa manfaatnya
            </h2>
            <ul className="mt-6 space-y-4 text-sm text-slate-200">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-300" />
                Daftar akun, buat kategori, dan mulai input transaksi harian.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-300" />
                Pantau ringkasan dan lihat kategori yang paling banyak menyerap
                budget.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-300" />
                Ambil keputusan berdasarkan data, bukan perasaan.
              </li>
            </ul>
          </div>
          <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-950/60 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">
              Fokus harian
            </p>
            <p className="text-lg font-semibold">
              Dashboard ringkas membuat kamu tahu posisi keuangan dalam sekali
              lihat.
            </p>
            <div className="space-y-3 text-sm text-slate-300">
              <p>• Transaksi terakhir langsung tampil.</p>
              <p>• Filter kategori yang cepat.</p>
              <p>• Siap dikembangkan ke laporan bulanan.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 px-6 py-8 text-center text-xs text-slate-400">
        <p>Daily Budget · Kelola keuangan pribadi dengan lebih sederhana.</p>
      </footer>
    </div>
  );
}
