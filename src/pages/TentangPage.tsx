import React, { useState } from 'react';
import {
  Leaf, Satellite, Brain, Users, Mail, Globe,
  Shield, CheckCircle2, ChevronDown, ChevronUp, Layers, Code,
  Milestone, HelpCircle, FileText,
} from 'lucide-react';
import { SectionHeader } from '../components/common/SectionHeader';

// GitHub icon – inline SVG
const GitHubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.3-5.467-1.334-5.467-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23A11.51 11.51 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.628-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
);

const PLATFORM_FEATURES = [
  { icon: <Leaf size={20} />, title: 'Pemantauan Ekosistem', desc: 'Memantau kesehatan kanopi mangrove Bengkulu via indeks spektral CMRI, MVI, dan NDMI dari konstelasi satelit Sentinel-2.', color: '#059669' },
  { icon: <Satellite size={20} />, title: 'Data Satelit Sentinel-2', desc: 'Resolusi spasial 10–20 m dari ESA Copernicus Programme dengan kemampuan multitemporal 5 harian.', color: '#0891B2' },
  { icon: <Brain size={20} />, title: 'Kecerdasan Buatan (ML)', desc: 'Klasifikasi Random Forest untuk memisahkan mangrove, non-mangrove, dan badan air dengan validasi akurasi tinggi.', color: '#174B32' },
  { icon: <Users size={20} />, title: 'Citizen Science Pesisir', desc: 'Melibatkan nelayan lokal, mahasiswa, dan komunitas pelestari dalam pelaporan langsung kondisi lapangan real-time.', color: '#D97706' },
];

const ROADMAP = [
  {
    phase: 'Fase I (Q4 2026)',
    title: 'Desain Konseptual & Prototipe Web GIS',
    status: 'Selesai',
    items: ['Arsitektur platform React 19 + TypeScript + Leaflet', 'Perumusan metodologi CMRI, MVI, NDMI', 'Simulasi Random Forest & Sistem Pelaporan Komunitas'],
  },
  {
    phase: 'Fase II (Q1 2027)',
    title: 'Integrasi Cloud & Google Earth Engine (GEE)',
    status: 'Dalam Rencana',
    items: ['Otentikasi GEE Service Account pada backend FastAPI', 'Automasi pipeline komposit citra bulanan bebas awan', 'Validasi poligon GeoJSON definitif kawasan konservasi'],
  },
  {
    phase: 'Fase III (Q2 2027)',
    title: 'Ground Truth & Survei Lapangan Lapangan',
    status: 'Dalam Rencana',
    items: ['Pengambilan 200+ titik koordinat GPS lapangan di Bengkulu', 'Kalibrasi matriks konfusi Random Forest', 'Uji coba aplikasi mobile untuk kelompok nelayan pokdarwis'],
  },
  {
    phase: 'Fase IV (Q3 2027)',
    title: 'Operasionalisasi Bersama Pemerintah Daerah',
    status: 'Dalam Rencana',
    items: ['Integrasi dashboard dengan Dinas Lingkungan Hidup Prov. Bengkulu', 'Sistem Peringatan Dini (Early Warning) deforestasi pesisir', 'Pelatihan kader konservasi mangrove pesisir barat Sumatera'],
  },
];

const FAQ_LIST = [
  {
    q: 'Apakah data luas dan sebaran mangrove di platform ini sudah data riil?',
    a: 'Saat ini platform berada dalam status prototipe pengembangan untuk kompetisi IT RUSH 2026. Angka hektare dan poligon yang ditampilkan adalah data demonstrasi terkalibrasi (mock data) untuk memperlihatkan rancang bangun arsitektur sistem. Ketika backend GEE terhubung, data akan diperbarui dari pengolahan citra satelit terkini.',
  },
  {
    q: 'Mengapa menggunakan tiga indeks (CMRI, MVI, NDMI) secara bersamaan?',
    a: 'Ekosistem mangrove pesisir memiliki tantangan unik: fluktuasi pasang surut air laut dan kemiripan warna dengan vegetasi darat. CMRI memisahkan mangrove dari air dan daratan, MVI mengukur kerapatan biomassa kanopi berlumpur, dan NDMI mendeteksi kadar air tajuk serta stres hidrologis.',
  },
  {
    q: 'Bagaimana peran masyarakat pesisir dalam platform ini?',
    a: 'Melalui fitur Community Reporting, nelayan dan masyarakat lokal dapat mengirimkan foto, koordinat GPS, dan indikasi kerusakan (penebangan, abrasi, sampah). Laporan ini diverifikasi dan menjadi titik ground truth yang melengkapi pantauan satelit dari orbit.',
  },
  {
    q: 'Bagaimana model Random Forest mengklasifikasikan tutupan lahan?',
    a: 'Random Forest adalah algoritma machine learning berbasis ensemble pohon keputusan yang dilatih menggunakan nilai pantulan spektral Sentinel-2 dan titik sampel lapangan. Model ini unggul karena kebal terhadap multikolinearitas band dan noise genangan air laut.',
  },
];

export const TentangPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Tentang Platform"
        subtitle="Peta Hidup Mangrove — platform pemantauan ekosistem pesisir cerdas berbasis teknologi geospasial dan kecerdasan buatan"
      />

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#174B32] via-[#13422C] to-[#0A261A] rounded-2xl p-7 md:p-9 text-white relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold mb-4 text-[#A8BFA5] uppercase tracking-wider border border-white/10">
            <Milestone size={12} /> IT RUSH 2026 — Karya Teknologi Lingkungan
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3 leading-tight tracking-tight">
            Peta Hidup Mangrove: Mengawal Sabuk Hijau Pesisir Barat Sumatera
          </h2>
          <p className="text-sm md:text-base text-white/80 leading-relaxed mb-6 font-normal">
            Platform intelijen ekologis terintegrasi yang menjembatani citra satelit antariksa <strong>Sentinel-2</strong>, 
            algoritma <strong>Random Forest</strong>, dan partisipasi warga pesisir <strong>(Citizen Science)</strong> guna 
            memastikan kelestarian ekosistem mangrove Provinsi Bengkulu dari ancaman deforestasi, sedimentasi, dan perubahan iklim.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {['Observasi Satelit 10m', 'Machine Learning Berkelanjutan', 'Kolaborasi Komunal', 'Ketahanan Megathrust'].map(tag => (
              <span key={tag} className="px-3.5 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold border border-white/15">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Pilar Utama */}
      <div>
        <h3 className="font-extrabold text-[17px] text-[#1D2A22] mb-4">Empat Pilar Utama Platform</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PLATFORM_FEATURES.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#E2EAE2] p-5 hover:border-[#174B32]/40 hover:shadow-sm transition-all">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-white" style={{ backgroundColor: f.color }}>
                {f.icon}
              </div>
              <h4 className="font-bold text-[15px] text-[#1D2A22] mb-1.5">{f.title}</h4>
              <p className="text-[12px] text-[#718075] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Transparansi Data & Disclaimer */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-6">
        <h3 className="font-bold text-[14px] text-amber-900 mb-2 flex items-center gap-2">
          <Shield size={16} className="text-amber-700" />
          Komitmen Transparansi — Status Prototipe Sistem
        </h3>
        <div className="text-[13px] text-amber-800 leading-relaxed space-y-2">
          <p>
            Sistem ini dirancang dan dibangun dengan memegang teguh prinsip <strong>integritas akademik dan etika geospasial</strong>. 
            Dalam fase prototipe saat ini:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2 text-amber-800/90 text-[12px]">
            <li>Poligon mangrove dan angka luas tutupan merupakan <strong>data simulasi representatif</strong> berbasis koordinat nyata pesisir Bengkulu.</li>
            <li>Pengolahan citra satelit Google Earth Engine disiapkan dalam bentuk arsitektur kode siap-pasang (ready-to-deploy).</li>
            <li>Seluruh visualisasi diberi label transparan <strong className="font-mono bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">◈ Data Simulasi</strong> agar tidak menyesatkan pengguna.</li>
          </ul>
        </div>
      </div>

      {/* Roadmap Pengembangan */}
      <div className="bg-white rounded-2xl border border-[#E2EAE2] p-6">
        <h3 className="font-extrabold text-[16px] text-[#1D2A22] mb-1 flex items-center gap-2">
          <Milestone size={18} className="text-[#174B32]" />
          Peta Jalan Pengembangan (Roadmap)
        </h3>
        <p className="text-[12px] text-[#718075] mb-6">Tahapan evolusi platform dari prototipe kompetisi menuju implementasi tata kelola pesisir daerah</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ROADMAP.map((r, idx) => (
            <div key={idx} className="bg-[#F5F8F5] border border-[#E2EAE2] rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#174B32]">{r.phase}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    r.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {r.status}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-[#1D2A22] mb-2">{r.title}</h4>
                <ul className="space-y-1">
                  {r.items.map((it, i) => (
                    <li key={i} className="text-[11px] text-[#718075] flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A8BFA5] mt-1.5 flex-shrink-0" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Interaktif */}
      <div className="bg-white rounded-2xl border border-[#E2EAE2] p-6">
        <h3 className="font-extrabold text-[16px] text-[#1D2A22] mb-1 flex items-center gap-2">
          <HelpCircle size={18} className="text-[#174B32]" />
          Tanya Jawab Seputar Platform (FAQ)
        </h3>
        <p className="text-[12px] text-[#718075] mb-5">Pertanyaan umum terkait metodologi sains, satelit, dan cara kerja sistem</p>

        <div className="space-y-3">
          {FAQ_LIST.map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="border border-[#E2EAE2] rounded-xl overflow-hidden transition-all">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-[#F8FAF8] transition-colors"
                >
                  <span className="font-bold text-[13px] text-[#1D2A22] pr-4">{item.q}</span>
                  {isOpen ? <ChevronUp size={16} className="text-[#718075] flex-shrink-0" /> : <ChevronDown size={16} className="text-[#718075] flex-shrink-0" />}
                </button>
                {isOpen && (
                  <div className="p-4 pt-1 bg-[#F5F8F5] border-t border-[#E2EAE2] text-[12px] text-[#718075] leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Informasi Kontak & Footer */}
      <div className="bg-white rounded-2xl border border-[#E2EAE2] p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="font-bold text-[13px] text-[#1D2A22] mb-3">Kontak & Kolaborasi</div>
            <div className="space-y-2.5">
              {[
                { icon: <Mail size={14} />, text: 'petahidupmangrove@bengkulu.ac.id' },
                { icon: <Globe size={14} />, text: 'www.petahidupmangrove.id' },
                { icon: <GitHubIcon />, text: 'github.com/peta-hidup-mangrove' },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-2.5 text-[12px] text-[#718075]">
                  <span className="text-[#174B32]">{c.icon}</span>
                  <span>{c.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="font-bold text-[13px] text-[#1D2A22] mb-3">Mitra & Pendukung Konseptual</div>
            <div className="space-y-1.5 text-[12px] text-[#718075]">
              <div>Universitas Bengkulu (UNIB)</div>
              <div>BRIN — Pusat Riset Limnologi dan Sumber Daya Air</div>
              <div>Dinas Lingkungan Hidup dan Kehutanan Prov. Bengkulu</div>
              <div>Google Earth Engine Academic Research</div>
              <div>ESA Copernicus Open Access Hub</div>
            </div>
          </div>
          <div>
            <div className="font-bold text-[13px] text-[#1D2A22] mb-3">Identitas Prototipe</div>
            <div className="space-y-1.5 text-[12px] text-[#718075]">
              <div>Versi Rilis: <strong className="text-[#1D2A22]">v1.0.0-prototype</strong></div>
              <div>Kompetisi: <strong>IT RUSH 2026</strong></div>
              <div>Tahun Perancangan: <strong>2026</strong></div>
              <div>Basis Frontend: <strong>React 19 + TypeScript 7 + Vite</strong></div>
              <div className="mt-2 text-[9px] text-amber-600 font-semibold">◈ Prototype Edition — IT RUSH 2026</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
