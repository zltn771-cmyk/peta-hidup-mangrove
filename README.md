# PETA HIDUP MANGROVE 🌿
### *Monitor. Understand. Protect.*
**Platform Geospasial & Kecerdasan Buatan Pemantauan Ekosistem Mangrove Provinsi Bengkulu**  
*Prototype & Karya Esai Teknologi Lingkungan — IT RUSH 2026*

---

## 📌 Ringkasan Eksekutif

Provinsi Bengkulu memiliki garis pantai sepanjang 525 km yang berhadapan langsung dengan Samudera Hindia dan zona subduksi aktif Megathrust Mentawai. Ekosistem mangrove seluas ±835 hektare berperan vital sebagai benteng hayati alami peredam energi gelombang pasang, tsunami, pencegah abrasi pantai barat Sumatera, serta penyerap karbon biru (*Blue Carbon*).

**Peta Hidup Mangrove (PHM)** adalah platform teknologi lingkungan terintegrasi yang menggabungkan:
1. **Penginderaan Jauh Satelit**: Konstelasi Sentinel-2 (ESA Copernicus) dengan resolusi spasial 10–20 meter.
2. **Tri-Indeks Spektral**: CMRI (*Combined Mangrove Recognition Index*), MVI (*Mangrove Vegetation Index*), dan NDMI (*Normalized Difference Moisture Index*).
3. **Kecerdasan Buatan (Machine Learning)**: Algoritma *Random Forest Classifier* untuk klasifikasi tutupan lahan secara objektif dan kebal terhadap multikolinearitas pita spektral.
4. **Citizen Science Pesisir**: Sistem pelaporan berbasis komunitas yang menjembatani nelayan, mahasiswa, dan pokdarwis dengan otoritas pengelola konservasi.
5. **Pusat Edukasi Digital**: Modul ilmiah interaktif dengan evaluasi pemahaman (kuis 7 soal) untuk menumbuhkan kepemilikan komunal (*community stewardship*).

---

## 🏗️ 8 Modul Halaman Utama

| Rute | Modul | Deskripsi Fungsional |
|---|---|---|
| `/dashboard` | **Monitoring Overview** | Ringkasan KPI eksekutif, Leaflet mini-map sebaran zona pesisir, donat komposisi kanopi, tren historis 7 tahun, dan tabel zona kritis (Teluk Sepang, Muara Kinal). |
| `/peta` | **Peta Geospasial Mangrove** | Full GIS canvas interaktif dengan 3 basemap (OSM, ESRI High-Res Satellite, OpenTopoMap Terrain), poligon GeoJSON WGS84, filter wilayah administratif, slider tahun 2021–2026, dan panel arsitektur Sentinel-2/GEE. |
| `/analisis` | **Analisis Vegetasi Spektral** | Deep-dive indeks CMRI, MVI, dan NDMI. Visualisasi komparatif (Tren Garis Dual-Axis, Radar 5 Zona, Bar Chart Distribusi) serta kartu detail interpretasi kesehatan tajuk otomatis. |
| `/perubahan` | **Perubahan Tutupan Multitemporal** | Deteksi dinamika tutupan 2020–2026, komparator interaktif dua tahun pilihan pengguna, sebaran hotspot per kabupaten, dan **Simulasi Proyeksi Kebijakan 2027–2030** (Konservasi Ketat, BAU, Tekanan Tinggi). |
| `/ai-klasifikasi` | **AI Classification Center** | Mesin **Random Forest Asli** di TypeScript dengan 60 sampel lapangan Bengkulu, CSV uploader, sliders hiperparameter (estimators, depth, split, seed), matriks konfusi heatmap, Cohen's Kappa, dan blueprint backend Python GEE. |
| `/laporan` | **Community Reporting System** | Formulir 5 langkah pelaporan warga (lokasi GPS izin pengguna, unggah & preview foto, kategori temuan), pelacakan lifecycle status, tampilan kartu vs tabel, dan filter laporan. |
| `/edukasi` | **Mangrove Education Center** | 8 seksi edukatif: anatomi fisiologis mangrove, 5 manfaat ekologis/karbon biru, katalog biodiversitas flora/fauna Bengkulu, matriks 6 ancaman, akordion teknologi antariksa, dan **Kuis Interaktif 7 Soal** berskor. |
| `/tentang` | **Tentang Platform & Roadmap** | Visi kompetisi IT RUSH 2026, 4 pilar utama, Peta Jalan Pengembangan 4 Fase (2026–2027), FAQ akordion, dan komitmen transparansi etika data. |

---

## 🎯 Panduan Demonstrasi Penjurian (2-Minute Walkthrough)

Untuk dewan juri dan penguji kompetisi IT RUSH 2026:
1. Klik tombol **"Panduan Juri & Demo"** pada Header navigasi atas untuk melihat ringkasan singkat kesesuaian rubrik penilaian.
2. **Langkah 1 (Dashboard)**: Tinjau kartu KPI dan klik salah satu titik di peta pesisir Bengkulu untuk melihat popup metrik.
3. **Langkah 2 (Peta GIS)**: Buka menu `Peta Mangrove`, ubah basemap ke **Satelit ESRI**, aktifkan filter **Mukomuko** atau **Kaur**, dan periksa layer GeoJSON.
4. **Langkah 3 (Analisis Spektral)**: Masuk ke `Analisis Vegetasi`, pilih tab **Radar Zona** untuk melihat profil spektral normalisasi antar kawasan.
5. **Langkah 4 (AI Engine Live)**: Buka `AI Classification`, klik **"Latih Model Random Forest"** untuk mengeksekusi pelatihan live pohon keputusan pada browser dan amati akurasi ~93% beserta Confusion Matrix.
6. **Langkah 5 (Citizen Science)**: Masuk ke `Laporan Masyarakat`, buka tab form, klik **"Gunakan Lokasi Saat Ini (GPS)"**, dan lihat preview foto simulasi.
7. **Langkah 6 (Edukasi & Kuis)**: Buka `Edukasi Mangrove`, gulir ke bagian **Kuis Interaktif**, jawab 7 pertanyaan dan periksa umpan balik skor otomatis.

---

## 🔬 Spesifikasi Sains & Formula Spektral

1. **CMRI (Combined Mangrove Recognition Index)**:
   $$\text{CMRI} = \text{NDVI} - \text{NDWI} = \left(\frac{\text{NIR} - \text{Red}}{\text{NIR} + \text{Red}}\right) - \left(\frac{\text{Green} - \text{NIR}}{\text{Green} + \text{NIR}}\right)$$
   *Fungsi: Memisahkan mangrove dari air laut dan vegetasi darat.*

2. **MVI (Mangrove Vegetation Index)**:
   $$\text{MVI} = \frac{\text{NIR} - \text{Green}}{\text{SWIR1} - \text{Green}}$$
   *Fungsi: Menangkap kerapatan tajuk dan biomassa pada tanah basah pasang-surut.*

3. **NDMI (Normalized Difference Moisture Index)**:
   $$\text{NDMI} = \frac{\text{NIR} - \text{SWIR1}}{\text{NIR} + \text{SWIR1}}$$
   *Fungsi: Proksi kadar air daun dan deteksi dini stres hidrologis tanaman.*

---

## 💻 Tech Stack & Arsitektur

- **Frontend Core**: React 19 + TypeScript 7 (Strict Mode) + Vite 8.3
- **Styling & Design System**: Tailwind CSS v4 Theme Tokens (`#174B32` Forest Green, `#103D2B` Deep Green, `#A8BFA5` Sage)
- **GIS Canvas**: Leaflet 1.9.4 (CDN integration, zero bundle bloat)
- **Visualisasi Data**: Recharts 3.10 (ResponsiveContainer, AreaChart, BarChart, LineChart, RadarChart)
- **Icons**: Lucide React
- **Cloud Architecture Blueprint**: Python 3.11 + FastAPI + `earthengine-api` (Google Earth Engine) + `scikit-learn`

---

## ⚙️ Menjalankan Platform

```bash
# Clone repositori
git clone https://github.com/peta-hidup-mangrove/platform.git
cd platform

# Jalankan development server
npm run dev -- --host --port 5173

# Verifikasi kompilasi dan build produksi
npm run build
```

Buka peramban di `http://localhost:5173`.

---

## ⚖️ Integritas Ilmiah & Etika Data

Platform ini mematuhi standar etika kejujuran akademik:
- Seluruh angka tutupan hektare dan poligon yang belum terhubung dengan satelit riil secara eksplisit diberi label amber **`◈ Data Simulasi`** atau **`Demonstration Data`**.
- Tidak ada manipulasi poligon atau klaim fiktif bahwa pipeline cloud Google Earth Engine telah aktif di server publik. Arsitektur teknis disiapkan lengkap untuk integrasi instan begitu otentikasi GEE Service Account diaktifkan.

---
*© 2026 Tim Peneliti Peta Hidup Mangrove — Universitas Bengkulu & IT RUSH 2026*
