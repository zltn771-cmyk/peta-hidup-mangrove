import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Leaf, Satellite, Brain, Shield, MapPin, MessageSquarePlus,
  ChevronRight, ExternalLink, Waves, Sun, Sprout, TreePine,
  Users, FlaskConical, AlertTriangle, Info, ChevronDown, ChevronUp,
} from 'lucide-react';
import { MangroveQuiz } from '../components/education/MangroveQuiz';
import {
  BIODIVERSITY_ITEMS, THREATS, REFERENCES,
} from '../data/educationContent';

// ── Reusable sub-components ───────────────────────────────────────────────────

function SectionAnchor({ id }: { id: string }) {
  return <div id={id} className="-mt-16 pt-16 pointer-events-none" />;
}

function CardSection({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-xl font-extrabold text-[#1D2A22] tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-[#718075] mt-1">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function NavPill({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={`#${href}`}
      className="text-xs font-semibold text-[#174B32] bg-white border border-[#A8BFA5] hover:bg-[#174B32] hover:text-white px-3 py-1.5 rounded-full transition-colors"
    >
      {label}
    </a>
  );
}

// ── Technology Accordion Item ─────────────────────────────────────────────────

function TechAccordion({
  icon, title, tag, children, defaultOpen = false,
}: {
  icon: React.ReactNode; title: string; tag: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`bg-white rounded-2xl border transition-all ${open ? 'border-[#174B32]' : 'border-[#E2EAE2]'}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 p-5 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#F5F8F5] border border-[#E2EAE2] rounded-xl flex items-center justify-center text-[#174B32] flex-shrink-0">
            {icon}
          </div>
          <div>
            <div className="font-extrabold text-sm text-[#1D2A22]">{title}</div>
            <div className="text-[11px] text-[#A8BFA5] font-mono">{tag}</div>
          </div>
        </div>
        {open ? <ChevronUp size={16} className="text-[#718075] flex-shrink-0" /> : <ChevronDown size={16} className="text-[#718075] flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-[#F0F4F0] pt-4 text-sm text-[#718075] leading-relaxed space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export const EdukasiPage: React.FC = () => {
  return (
    <div className="space-y-14">

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative rounded-3xl overflow-hidden bg-[#103D2B]" style={{ minHeight: 320 }}>
        {/* SVG forest background */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 800 320" preserveAspectRatio="xMidYMid slice">
            {[...Array(14)].map((_, i) => {
              const x = 20 + i * 55; const h = 180 + (i % 3) * 50;
              return (
                <g key={i} transform={`translate(${x}, ${320 - h})`}>
                  <rect x={-4} y={h * 0.7} width={8} height={h * 0.3} fill="#A8BFA5" />
                  <ellipse cx={0} cy={h * 0.4} rx={28 + (i % 2) * 8} ry={h * 0.45} fill="#A8BFA5" />
                  {[...Array(5)].map((_, j) => (
                    <line key={j} x1={-20 + j * 8} y1={h * 0.55 + j * 12} x2={-20 + j * 8} y2={h} stroke="#174B32" strokeWidth="2" opacity="0.4" />
                  ))}
                </g>
              );
            })}
            <rect y={280} width={800} height={40} fill="#174B32" opacity={0.6} />
          </svg>
        </div>

        <div className="relative z-10 p-8 sm:p-14 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold text-[#A8BFA5] uppercase tracking-widest mb-4 bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
            <BookOpen size={12} /> Knowledge Center · Peta Hidup Mangrove
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight mb-3">
            Mangrove Education Center
          </h1>
          <p className="text-sm sm:text-base text-[#A8BFA5] leading-relaxed mb-6 max-w-xl">
            Understand the Ecosystem. Protect the Coast. Build a Sustainable Future.
          </p>
          <p className="text-xs sm:text-sm text-[#A8BFA5]/80 leading-relaxed mb-8 max-w-lg">
            Mangrove merupakan ekosistem pesisir yang kritis — menyediakan perlindungan pantai, habitat keanekaragaman hayati, dan penyimpanan karbon.
            Pelajari ekologi, teknologi pemantauan, dan cara Anda dapat berkontribusi.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#ekosistem" className="inline-flex items-center gap-2 bg-white text-[#174B32] px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#F5F8F5] transition-colors">
              <Sprout size={15} /> Mulai Belajar
            </a>
            <Link to="/peta" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors">
              <MapPin size={15} /> Jelajahi Peta <ChevronRight size={13} />
            </Link>
          </div>
        </div>

        {/* Quick nav pills */}
        <div className="relative z-10 px-8 sm:px-14 pb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { href: 'ekosistem', label: 'Ekosistem' },
              { href: 'manfaat', label: 'Fungsi & Manfaat' },
              { href: 'biodiversitas', label: 'Keanekaragaman Hayati' },
              { href: 'ancaman', label: 'Ancaman' },
              { href: 'teknologi', label: 'Teknologi Pemantauan' },
              { href: 'panduan', label: 'Panduan Warga' },
              { href: 'kuis', label: 'Kuis Interaktif' },
            ].map(item => (
              <NavPill key={item.href} href={item.href} label={item.label} />
            ))}
          </div>
        </div>
      </section>

      {/* ── MENGENAL EKOSISTEM ───────────────────────────────────────────────── */}
      <SectionAnchor id="ekosistem" />
      <CardSection
        title="Mengenal Ekosistem Mangrove"
        subtitle="Dasar ekologi dan karakteristik kawasan mangrove pesisir"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            {
              icon: <Leaf size={18} className="text-[#059669]" />,
              bg: '#ECFDF5', border: '#A7F3D0',
              title: 'Apa itu Mangrove?',
              body: 'Mangrove adalah kelompok tumbuhan berkayu yang tumbuh di zona antara daratan dan laut tropis serta subtropis — umumnya di muara sungai, teluk, dan estuari. Mereka telah beradaptasi untuk bertahan di kondisi salinitas tinggi, genangan pasang surut, dan substrat berlumpur rendah oksigen.',
            },
            {
              icon: <Waves size={18} className="text-[#0891B2]" />,
              bg: '#ECFEFF', border: '#A5F3FC',
              title: 'Karakteristik Kawasan',
              body: 'Kawasan mangrove ditandai oleh variasi salinitas (dari air tawar di bagian hulu hingga salin di tepi laut), substrat berlumpur kaya bahan organik, fluktuasi pasang surut harian, dan kondisi anoksik pada lapisan tanah bawah. Zonasi vegetasi terbentuk berdasarkan toleransi salinitas dan frekuensi genangan.',
            },
            {
              icon: <TreePine size={18} className="text-[#174B32]" />,
              bg: '#F5F8F5', border: '#A8BFA5',
              title: 'Adaptasi Tumbuhan',
              body: 'Mangrove memiliki beragam adaptasi unik: (1) akar khusus untuk pertukaran gas seperti pneumatophores dan akar lutut; (2) mekanisme eksklusi atau sekresi garam; (3) perkecambahan vivipar — biji berkecambah di pohon induk sebelum jatuh; (4) daun tebal berlapis lilin untuk mengurangi transpirasi.',
            },
            {
              icon: <Sun size={18} className="text-[#D97706]" />,
              bg: '#FFFBEB', border: '#FDE68A',
              title: 'Hubungan dengan Ekosistem Lain',
              body: 'Mangrove terhubung erat dengan padang lamun (seagrass beds) dan terumbu karang melalui aliran nutrien, transportasi sedimen, dan pergerakan organisme. Detritus daun mangrove mendukung rantai makanan di perairan pesisir, sementara mangrove menyediakan zona asuhan (nursery) bagi ikan yang akan menghuni terumbu karang.',
            },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border p-5 flex gap-4" style={{ borderColor: item.border }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: item.bg }}>
                {item.icon}
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#1D2A22] mb-2">{item.title}</h3>
                <p className="text-xs text-[#718075] leading-relaxed">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </CardSection>

      {/* ── FUNGSI & MANFAAT ─────────────────────────────────────────────────── */}
      <SectionAnchor id="manfaat" />
      <CardSection
        title="Fungsi dan Manfaat Ekosistem Mangrove"
        subtitle="Peran ekologis dan sosial-ekonomi kawasan mangrove pesisir"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: '🛡️', title: 'Perlindungan Pesisir', color: '#0891B2', bg: '#ECFEFF', border: '#A5F3FC', body: 'Vegetasi mangrove meredam energi gelombang dan mengurangi kecepatan arus melalui sistem akarnya yang rapat. Struktur ini membantu mengurangi risiko abrasi garis pantai dan memperlambat intrusi air laut ke daratan.' },
            { icon: '🦎', title: 'Habitat Keanekaragaman Hayati', color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', body: 'Mangrove menjadi habitat bagi ratusan spesies ikan, crustacea, moluska, reptil, dan burung. Akar yang terendam air menyediakan tempat berlindung dan mencari makan bagi juvenil ikan dan udang penting secara komersial.' },
            { icon: '💙', title: 'Penyimpanan Karbon Biru', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE', body: 'Ekosistem mangrove menyimpan karbon dalam biomassa tumbuhan dan terutama dalam sedimen anoksik yang menghambat dekomposisi. Ini menjadikan mangrove salah satu ekosistem penyimpan karbon per satuan luas yang efisien.' },
            { icon: '🎣', title: 'Pendukung Ekonomi Masyarakat', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', body: 'Nelayan pesisir bergantung pada mangrove sebagai habitat bagi hasil tangkapan utama seperti ikan, kepiting, dan udang. Potensi ekowisata mangrove juga berkembang sebagai sumber pendapatan alternatif yang berkelanjutan.' },
            { icon: '⚖️', title: 'Keseimbangan Ekosistem', color: '#174B32', bg: '#F5F8F5', border: '#A8BFA5', body: 'Mangrove berperan dalam siklus nutrien pesisir, menyaring sedimen dan nutrien dari daratan sebelum masuk ke laut, mengurangi eutrofikasi perairan pesisir, dan mempertahankan kejernihan air yang dibutuhkan ekosistem terumbu karang.' },
            { icon: '🌊', title: 'Penyaring Alami Perairan', color: '#B45309', bg: '#FEF9C3', border: '#FDE047', body: 'Sistem akar mangrove bertindak sebagai penyaring fisik yang menjebak sedimen dan partikel tersuspensi dari daratan. Proses ini membantu menjaga kualitas air pesisir dan mengurangi beban sedimen ke ekosistem laut.' },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border p-5 hover:shadow-sm transition-shadow" style={{ borderColor: item.border }}>
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-sm mb-2" style={{ color: item.color }}>{item.title}</h3>
              <p className="text-xs text-[#718075] leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </CardSection>

      {/* ── BIODIVERSITAS ────────────────────────────────────────────────────── */}
      <SectionAnchor id="biodiversitas" />
      <CardSection
        title="Keanekaragaman Hayati Mangrove"
        subtitle="Flora dan fauna yang ditemukan di ekosistem mangrove pesisir. Catatan: keberadaan spesies tertentu di Bengkulu memerlukan verifikasi inventarisasi lapangan."
      >
        {/* Flora */}
        <div>
          <div className="text-xs font-extrabold text-[#174B32] uppercase tracking-wider flex items-center gap-2 mb-3">
            <Leaf size={14} /> Flora — Vegetasi Mangrove
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {BIODIVERSITY_ITEMS.filter(b => b.type === 'flora').map(item => (
              <div key={item.name} className="bg-white rounded-2xl border p-4 hover:border-[#A8BFA5] transition-colors" style={{ borderColor: item.colorBorder }}>
                <div className="text-3xl mb-3 text-center">{item.icon}</div>
                <h4 className="font-bold text-xs text-[#1D2A22] italic">{item.name}</h4>
                <p className="text-[11px] text-[#A8BFA5] mb-2">{item.nameId}</p>
                <p className="text-[11px] text-[#718075] leading-relaxed mb-2">{item.desc}</p>
                <div className="pt-2 border-t border-[#F0F4F0]">
                  <span className="text-[10px] font-bold text-[#174B32] uppercase tracking-wider">Peran:</span>
                  <p className="text-[10px] text-[#718075] mt-0.5 leading-relaxed">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fauna */}
        <div>
          <div className="text-xs font-extrabold text-[#174B32] uppercase tracking-wider flex items-center gap-2 mb-3 mt-2">
            <Shield size={14} /> Fauna — Organisme Pesisir Mangrove
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {BIODIVERSITY_ITEMS.filter(b => b.type === 'fauna').map(item => (
              <div key={item.name} className="bg-white rounded-2xl border p-4 hover:border-[#A8BFA5] transition-colors" style={{ borderColor: item.colorBorder }}>
                <div className="text-3xl mb-3 text-center">{item.icon}</div>
                <h4 className="font-bold text-xs text-[#1D2A22] italic">{item.name}</h4>
                <p className="text-[11px] text-[#A8BFA5] mb-2">{item.nameId}</p>
                <p className="text-[11px] text-[#718075] leading-relaxed mb-2">{item.desc}</p>
                <div className="pt-2 border-t border-[#F0F4F0]">
                  <span className="text-[10px] font-bold text-[#174B32] uppercase tracking-wider">Peran:</span>
                  <p className="text-[10px] text-[#718075] mt-0.5 leading-relaxed">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-3.5 flex items-start gap-2 text-[11px] text-[#92400E]">
          <Info size={13} className="text-[#D97706] flex-shrink-0 mt-0.5" />
          <span>Daftar spesies di atas merupakan contoh organisme umum ekosistem mangrove. Distribusi aktual di kawasan pesisir Bengkulu memerlukan inventarisasi lapangan yang terverifikasi.</span>
        </div>
      </CardSection>

      {/* ── ANCAMAN ──────────────────────────────────────────────────────────── */}
      <SectionAnchor id="ancaman" />
      <CardSection
        title="Ancaman terhadap Ekosistem Mangrove"
        subtitle="Faktor-faktor yang mengancam kelestarian mangrove dan mengapa pemantauan berkelanjutan sangat penting"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {THREATS.map((t, i) => (
            <div key={i} className={`bg-white rounded-2xl border p-4 ${t.severity === 'high' ? 'border-[#FECACA]' : t.severity === 'medium' ? 'border-[#FDE68A]' : 'border-[#E2EAE2]'}`}>
              <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0">{t.icon}</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-sm text-[#1D2A22]">{t.title}</h3>
                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                      t.severity === 'high' ? 'bg-[#FEF2F2] text-[#DC2626]' : t.severity === 'medium' ? 'bg-[#FFFBEB] text-[#D97706]' : 'bg-[#F5F8F5] text-[#718075]'
                    }`}>{t.severity === 'high' ? 'Tinggi' : t.severity === 'medium' ? 'Sedang' : 'Perlu Pantau'}</span>
                  </div>
                  <p className="text-xs text-[#718075] leading-relaxed">{t.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Why monitoring matters */}
        <div className="bg-[#174B32] rounded-2xl p-6 sm:p-8 text-white">
          <h3 className="text-lg font-extrabold mb-3">🛰️ Why Mangrove Monitoring Matters</h3>
          <p className="text-sm text-[#A8BFA5] leading-relaxed mb-5">
            Pemantauan mangrove secara berkala menggunakan data satelit memungkinkan deteksi perubahan tutupan vegetasi yang tidak terlihat dari darat.
            Dengan indeks spektral seperti CMRI, MVI, dan NDMI yang dihitung dari citra Sentinel-2, kondisi kesehatan kanopi dapat dipantau secara konsisten dari waktu ke waktu.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: '🔍', title: 'Deteksi Dini', desc: 'Mengidentifikasi area yang mengalami penurunan tutupan sebelum kerusakan meluas.' },
              { icon: '📊', title: 'Data Berbasis Sains', desc: 'Mendukung pengambilan keputusan konservasi dengan data kuantitatif yang terukur.' },
              { icon: '🤝', title: 'Partisipasi Masyarakat', desc: 'Laporan warga melengkapi data satelit dengan pengamatan langsung dari lapangan.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 rounded-xl p-4 border border-white/10">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h4 className="font-bold text-sm text-white mb-1">{item.title}</h4>
                <p className="text-[11px] text-[#A8BFA5] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </CardSection>

      {/* ── TEKNOLOGI ────────────────────────────────────────────────────────── */}
      <SectionAnchor id="teknologi" />
      <CardSection
        title="Teknologi Pemantauan Mangrove"
        subtitle="Penjelasan teknologi yang disiapkan dalam arsitektur PETA HIDUP MANGROVE"
      >
        <div className="space-y-3">
          <TechAccordion icon={<Satellite size={16} />} title="Sentinel-2 MSI" tag="European Space Agency (ESA)" defaultOpen>
            <p><strong className="text-[#1D2A22]">Sentinel-2</strong> adalah konstelasi satelit pemantauan Bumi dari program Copernicus ESA yang terdiri dari dua wahana — Sentinel-2A dan Sentinel-2B.</p>
            <p>Sensor <strong className="text-[#1D2A22]">MSI (Multispectral Instrument)</strong> merekam 13 band spektral dari tampak hingga inframerah gelombang pendek (SWIR). Resolusi spasial: <strong className="text-[#174B32]">10 meter</strong> untuk band B2, B3, B4, B8 — dan 20 meter untuk band SWIR yang digunakan indeks mangrove.</p>
            <p>Revisi ulang area yang sama setiap <strong className="text-[#174B32]">5 hari</strong> (kombinasi dua satelit) menjadikan Sentinel-2 cocok untuk pemantauan multitemporal perubahan tutupan lahan. Keterbatasan utama adalah tutupan awan yang umum di daerah tropis lembab seperti Bengkulu.</p>
            <div className="bg-[#FFFBEB] border border-[#FDE68A] p-3 rounded-xl text-[11px] text-[#92400E] flex items-start gap-2">
              <AlertTriangle size={12} className="flex-shrink-0 mt-0.5 text-[#D97706]" />
              <span>Integrasi data Sentinel-2 pada platform ini masih dalam tahap arsitektur. Data citra aktual belum diproses pada prototipe ini.</span>
            </div>
          </TechAccordion>

          <TechAccordion icon={<FlaskConical size={16} />} title="Google Earth Engine (GEE)" tag="Platform Komputasi Awan Geospasial">
            <p><strong className="text-[#1D2A22]">Google Earth Engine</strong> adalah platform komputasi awan untuk analisis citra satelit skala besar. GEE menyediakan akses ke katalog data geospasial global (termasuk seluruh arsip Sentinel-2) tanpa perlu mengunduh dan menyimpan data secara lokal.</p>
            <p>Fungsi utama dalam konteks mangrove: (1) <strong>Cloud masking</strong> otomatis untuk menyaring piksel berawan, (2) <strong>Temporal compositing</strong> (median/quartile) untuk menggabungkan beberapa citra menjadi komposit bebas awan, (3) Kalkulasi indeks vegetasi skala regional, (4) Klasifikasi supervised dengan algoritma machine learning built-in seperti <code className="text-[11px] bg-[#F5F8F5] px-1.5 rounded">ee.Classifier.smileRandomForest()</code>.</p>
          </TechAccordion>

          <TechAccordion icon={<Leaf size={16} />} title="Indeks Vegetasi Spektral" tag="CMRI · MVI · NDMI">
            <div className="space-y-4">
              {[
                {
                  name: 'CMRI — Combined Mangrove Recognition Index',
                  formula: 'CMRI = NDVI − NDWI',
                  formulaExpand: 'di mana NDVI = (B8−B4)/(B8+B4) dan NDWI = (B3−B8)/(B3+B8)',
                  desc: 'Mengkombinasikan informasi vegetasi (NDVI) dan kandungan air (NDWI). Nilai tinggi (+) mengindikasikan vegetasi mangrove yang rapat dan sehat, karena mangrove memiliki NDVI tinggi dan NDWI rendah.',
                },
                {
                  name: 'MVI — Mangrove Vegetation Index',
                  formula: 'MVI = (B8 − B3) / (B11 − B3)',
                  formulaExpand: 'B8: NIR (842nm), B3: Green (560nm), B11: SWIR-1 (1610nm)',
                  desc: 'Memanfaatkan perbedaan respons NIR dan SWIR-1 yang khas pada kanopi mangrove. Efektif membedakan mangrove dari vegetasi terestrial lainnya yang memiliki nilai MVI lebih rendah.',
                },
                {
                  name: 'NDMI — Normalized Difference Moisture Index',
                  formula: 'NDMI = (B8 − B11) / (B8 + B11)',
                  formulaExpand: 'B8: NIR (842nm), B11: SWIR-1 (1610nm)',
                  desc: 'Mengukur kadar air pada kanopi daun mangrove. Nilai tinggi mengindikasikan kadar air tinggi, yang berkorelasi dengan kesehatan vegetasi dan kelembaban substrat.',
                },
              ].map(idx => (
                <div key={idx.name} className="bg-[#F5F8F5] border border-[#E2EAE2] rounded-xl p-4">
                  <div className="font-bold text-xs text-[#1D2A22] mb-2">{idx.name}</div>
                  <div className="font-mono text-xs bg-white border border-[#E2EAE2] px-3 py-2 rounded-lg text-[#174B32] font-bold mb-1">{idx.formula}</div>
                  <div className="text-[10px] text-[#718075] mb-2">{idx.formulaExpand}</div>
                  <p className="text-[11px] text-[#718075]">{idx.desc}</p>
                </div>
              ))}
            </div>
          </TechAccordion>

          <TechAccordion icon={<Brain size={16} />} title="Algoritma Random Forest" tag="Machine Learning · Ensemble Classifier">
            <p><strong className="text-[#1D2A22]">Random Forest</strong> adalah algoritma machine learning berbasis ensemble yang menggabungkan ratusan decision tree yang dilatih secara independen. Setiap tree memberikan prediksi kelas, dan prediksi akhir ditentukan lewat <strong>voting mayoritas</strong>.</p>
            <p>Dalam konteks klasifikasi mangrove, fitur input adalah nilai piksel CMRI, MVI, dan NDMI. Data training berasal dari titik sampel lapangan (ground truth) yang telah dilabeli sebagai "mangrove" atau "non-mangrove".</p>
            <p>Keunggulan: robust terhadap outlier, dapat mengestimasi <strong>feature importance</strong>, dan umumnya tidak memerlukan normalisasi fitur. Keterbatasan: perlu sampel training yang representatif dan beragam secara spasial.</p>
          </TechAccordion>

          <TechAccordion icon={<MapPin size={16} />} title="Validasi Lapangan (Ground Truth)" tag="Field Survey · Reference Data Collection">
            <p><strong className="text-[#1D2A22]">Validasi lapangan</strong> adalah proses pengumpulan data referensi di lokasi nyata dengan label kelas yang diketahui secara pasti. Titik-titik sampel ini digunakan sebagai <strong>testing set</strong> yang terpisah dari data training.</p>
            <p>Metrik evaluasi yang dihitung: (1) <strong>Overall Accuracy</strong> — proporsi prediksi benar dari total sampel; (2) <strong>Cohen's Kappa</strong> — akurasi yang sudah memperhitungkan kesepakatan kebetulan; (3) <strong>Confusion Matrix</strong> — distribusi True Positive, False Positive, True Negative, dan False Negative.</p>
            <p>Prinsip penting: data training dan testing harus terpisah sepenuhnya (no data leakage). Idealnya, sampel testing berasal dari lokasi berbeda dari sampel training untuk menghindari spatial autocorrelation.</p>
          </TechAccordion>
        </div>

        <div className="flex flex-wrap gap-3 mt-2">
          <a href="/analisis" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#174B32] border border-[#A8BFA5] bg-white hover:bg-[#F5F8F5] px-4 py-2 rounded-xl transition-colors">
            <Leaf size={13} /> Lihat Analisis Vegetasi <ChevronRight size={12} />
          </a>
          <a href="/ai-klasifikasi" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#174B32] border border-[#A8BFA5] bg-white hover:bg-[#F5F8F5] px-4 py-2 rounded-xl transition-colors">
            <Brain size={13} /> Pelajari AI Classification <ChevronRight size={12} />
          </a>
        </div>
      </CardSection>

      {/* ── PANDUAN WARGA ────────────────────────────────────────────────────── */}
      <SectionAnchor id="panduan" />
      <CardSection title="Become a Mangrove Guardian" subtitle="Panduan praktis pengamatan dan pelaporan kondisi mangrove">
        <div className="bg-[#174B32] rounded-2xl p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            {[
              { num: '01', title: 'Kenali Tanda Kerusakan', desc: 'Perhatikan daun menguning massal, akar terekspos tanpa sedimen, bekas tebangan segar, atau perubahan mendadak pada garis pantai.', icon: '🔍' },
              { num: '02', title: 'Dokumentasikan Temuan', desc: 'Ambil foto dari berbagai sudut — tampilkan area yang terdampak, vegetasi sekitar, dan penanda skala jika memungkinkan. Catat waktu dan perkiraan luas area.', icon: '📸' },
              { num: '03', title: 'Tentukan Lokasi', desc: 'Aktifkan GPS perangkat Anda atau catat nama kampung/dusun terdekat. Koordinat yang akurat membantu tim memverifikasi dan menempatkan marker di peta.', icon: '📍' },
              { num: '04', title: 'Ambil Foto Informatif', desc: 'Gunakan mode landscape. Pastikan cahaya cukup. Ambil satu foto dari jauh (konteks) dan satu foto dekat (detail kerusakan). Hindari foto bergerak atau buram.', icon: '🌅' },
              { num: '05', title: 'Buat Laporan', desc: 'Isi formulir laporan dengan kategori temuan yang tepat, deskripsi kondisi yang Anda saksikan, dan unggah foto dokumentasi. Laporan yang lengkap lebih mudah diverifikasi.', icon: '📝' },
              { num: '06', title: 'Etika Pengamatan', desc: 'Jangan masuk ke area konservasi tanpa izin. Jangan merusak vegetasi untuk mengambil foto. Hormati nelayan dan warga lokal yang sedang bekerja di kawasan.', icon: '🤝' },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 border border-white/15 rounded-xl p-4 flex gap-3">
                <div>
                  <div className="text-[10px] font-bold text-[#A8BFA5] mb-0.5">{item.num}</div>
                  <div className="text-xl mb-2">{item.icon}</div>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white mb-1">{item.title}</h4>
                  <p className="text-[11px] text-[#A8BFA5] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <a href="/laporan" className="inline-flex items-center gap-2 bg-white text-[#174B32] px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#F5F8F5] transition-colors">
              <MessageSquarePlus size={15} /> Laporkan Temuan Sekarang
            </a>
            <a href="/peta" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors">
              <MapPin size={15} /> Lihat Peta Sebaran <ChevronRight size={13} />
            </a>
          </div>
        </div>
      </CardSection>

      {/* ── KUIS ─────────────────────────────────────────────────────────────── */}
      <SectionAnchor id="kuis" />
      <CardSection
        title="Kuis Interaktif"
        subtitle="Uji pemahaman Anda tentang ekosistem mangrove dan teknologi pemantauan satelit"
      >
        <MangroveQuiz />
      </CardSection>

      {/* ── REFERENSI ────────────────────────────────────────────────────────── */}
      <SectionAnchor id="referensi" />
      <CardSection
        title="Sumber & Referensi"
        subtitle="Dokumentasi resmi dan publikasi ilmiah yang mendasari konten platform ini"
      >
        <div className="space-y-5">
          {REFERENCES.map((group, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#E2EAE2] p-5">
              <div className="text-[11px] font-extrabold text-[#174B32] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <BookOpen size={12} /> {group.category}
              </div>
              <div className="space-y-2.5">
                {group.items.map((ref, j) => (
                  <div key={j} className="flex items-start justify-between gap-3 p-3 bg-[#F5F8F5] rounded-xl border border-[#E2EAE2]">
                    <div className="text-xs">
                      <div className="font-semibold text-[#1D2A22]">{ref.title}</div>
                      <div className="text-[#718075] mt-0.5">{ref.org}</div>
                      <div className="text-[10px] text-[#A8BFA5] mt-0.5 italic">{ref.note}</div>
                    </div>
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[11px] font-semibold text-[#174B32] hover:underline flex-shrink-0 mt-0.5"
                    >
                      Buka <ExternalLink size={11} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-[#F5F8F5] border border-[#E2EAE2] rounded-xl p-4 text-xs text-[#718075]">
            <strong className="text-[#1D2A22]">Catatan:</strong> Referensi di atas merujuk pada sumber yang dapat diakses publik. Untuk penerapan akademis, harap verifikasi ketersediaan dan akurasi referensi secara mandiri. Konten platform ini bersifat edukatif dan tidak menggantikan publikasi ilmiah peer-reviewed.
          </div>
        </div>
      </CardSection>

      {/* ── CTA Bottom ───────────────────────────────────────────────────────── */}
      <section className="bg-[#174B32] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div>
          <h2 className="text-xl font-extrabold text-white mb-1">Siap Berkontribusi?</h2>
          <p className="text-sm text-[#A8BFA5]">Bergabung bersama komunitas pemantauan mangrove pesisir Bengkulu.</p>
        </div>
        <div className="flex flex-wrap gap-3 flex-shrink-0">
          <Link to="/laporan" className="flex items-center gap-2 bg-white text-[#174B32] px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#F5F8F5] transition-colors">
            <MessageSquarePlus size={15} /> Buat Laporan
          </Link>
          <Link to="/peta" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors">
            <MapPin size={15} /> Jelajahi Peta
          </Link>
        </div>
      </section>

    </div>
  );
};
