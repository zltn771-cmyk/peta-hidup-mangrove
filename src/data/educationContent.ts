// Education content data for Mangrove Education Center
// All content is factual and grounded in published environmental science literature.
// No invented statistics or unverified claims.

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Apa fungsi utama akar prop (akar tunjang) pada Rhizophora?',
    options: [
      'Menyerap nutrisi dari air hujan',
      'Memberikan kestabilan mekanik pada substrat berlumpur yang tidak stabil dan membantu pertukaran gas',
      'Menyimpan karbon di dalam jaringan',
      'Menghasilkan buah vivipar lebih cepat',
    ],
    correctIndex: 1,
    explanation: 'Akar prop (prop roots) pada Rhizophora berfungsi sebagai penopang mekanik pada substrat berlumpur yang lemah, sekaligus memiliki lentisel untuk pertukaran gas oksigen karena tanah mangrove sering kekurangan oksigen (anoksik).',
    topic: 'Ekologi Mangrove',
  },
  {
    id: 2,
    question: 'Sentinel-2 MSI memiliki resolusi spasial 10 meter pada band apa?',
    options: [
      'B11 (SWIR-1) dan B12 (SWIR-2)',
      'B2 (Blue), B3 (Green), B4 (Red), dan B8 (NIR)',
      'Hanya B4 (Red) dan B8 (NIR)',
      'Semua band memiliki resolusi 10 meter',
    ],
    correctIndex: 1,
    explanation: 'Band resolusi 10m Sentinel-2 adalah B2 (Blue ~490nm), B3 (Green ~560nm), B4 (Red ~665nm), dan B8 (NIR ~842nm). Band SWIR seperti B11 dan B12 memiliki resolusi 20m, namun tetap sangat berguna untuk indeks vegetasi mangrove.',
    topic: 'Penginderaan Jauh',
  },
  {
    id: 3,
    question: 'Formula CMRI (Combined Mangrove Recognition Index) adalah…',
    options: [
      '(NIR - Red) / (NIR + Red)',
      '(NIR - Green) / (SWIR1 - Green)',
      'NDVI − NDWI',
      '(NIR - SWIR1) / (NIR + SWIR1)',
    ],
    correctIndex: 2,
    explanation: 'CMRI = NDVI − NDWI, di mana NDVI = (NIR−Red)/(NIR+Red) dan NDWI = (Green−NIR)/(Green+NIR). Kombinasi ini memanfaatkan kontras antara vegetasi dan badan air sehingga efektif membedakan mangrove dari lahan basah lainnya.',
    topic: 'Indeks Vegetasi',
  },
  {
    id: 4,
    question: 'Dalam Random Forest, apa yang dimaksud dengan "bootstrap aggregation" (bagging)?',
    options: [
      'Memilih hanya satu decision tree terbaik dari seluruh kandidat',
      'Melatih setiap tree dari sampel data acak dengan pengembalian (sampling with replacement), lalu menggabungkan prediksi lewat voting mayoritas',
      'Menggunakan seluruh dataset tanpa pengacakan untuk setiap tree',
      'Menghapus fitur dengan kontribusi rendah sebelum training',
    ],
    correctIndex: 1,
    explanation: 'Bagging (Bootstrap Aggregating) melatih setiap decision tree menggunakan subset data acak yang diambil dengan pengembalian (bootstrap sample). Prediksi akhir ditentukan lewat voting mayoritas dari semua tree, mengurangi variance dan overfitting dibanding satu tree tunggal.',
    topic: 'Machine Learning',
  },
  {
    id: 5,
    question: 'Mengapa validasi lapangan (ground truth) diperlukan dalam klasifikasi citra satelit?',
    options: [
      'Agar satelit dapat mengirim citra dengan lebih cepat',
      'Untuk mendekorasi peta dengan marker lokasi',
      'Untuk memeriksa apakah prediksi model sesuai dengan kondisi nyata di lapangan, sehingga akurasi dapat diukur secara objektif',
      'Karena Google Earth Engine memerlukan data lapangan untuk komputasi',
    ],
    correctIndex: 2,
    explanation: 'Validasi lapangan menyediakan titik referensi berkoordinat dengan label kelas yang diketahui secara pasti. Data ini digunakan sebagai "testing set" untuk membandingkan hasil prediksi model dengan kenyataan, memungkinkan perhitungan confusion matrix, overall accuracy, dan Cohen\'s Kappa.',
    topic: 'Validasi Model',
  },
  {
    id: 6,
    question: 'Apa yang dimaksud dengan "blue carbon" pada ekosistem mangrove?',
    options: [
      'Pigmen biru pada daun mangrove yang menyerap cahaya',
      'Karbon yang tersimpan dalam biomassa dan sedimen ekosistem pesisir seperti mangrove, padang lamun, dan rawa payau',
      'Jenis bahan bakar yang dihasilkan dari pengolahan kayu mangrove',
      'Gas CO₂ yang dilepaskan saat mangrove membusuk',
    ],
    correctIndex: 1,
    explanation: '"Blue carbon" merujuk pada karbon yang tersimpan dalam ekosistem pesisir dan lautan — termasuk mangrove, padang lamun (seagrass), dan rawa payau. Mangrove dikenal sebagai penyimpan blue carbon yang efisien karena karbon tersimpan dalam biomassa, akar, dan sedimen anoksik yang memperlambat dekomposisi.',
    topic: 'Ekologi Mangrove',
  },
  {
    id: 7,
    question: 'MVI (Mangrove Vegetation Index) menggabungkan band spektral mana?',
    options: [
      'Blue, Red, NIR',
      'Green, NIR, SWIR-1',
      'Red, NIR, SWIR-2',
      'Green, Red, SWIR-1',
    ],
    correctIndex: 1,
    explanation: 'MVI = (NIR - Green) / (SWIR1 - Green), menggunakan band B3 (Green), B8 (NIR), dan B11 (SWIR-1) dari Sentinel-2. Kombinasi ini memanfaatkan respons spektral unik kanopi mangrove yang tinggi di NIR dan relatif rendah di SWIR-1, membedakannya dari vegetasi terrestrial lainnya.',
    topic: 'Indeks Vegetasi',
  },
];

export const BIODIVERSITY_ITEMS = [
  {
    type: 'flora' as const,
    name: 'Rhizophora apiculata',
    nameId: 'Bakau Minyak',
    icon: '🌿',
    colorBg: '#ECFDF5',
    colorBorder: '#A7F3D0',
    desc: 'Spesies mangrove yang umum dengan sistem akar tunjang (prop roots) yang khas. Tumbuh di zona antara pasang surut dan sering membentuk hutan murni yang rapat.',
    role: 'Menstabilkan substrat berlumpur, menyediakan habitat bagi juvenil ikan dan udang, serta berkontribusi pada akumulasi sedimen.',
  },
  {
    type: 'flora' as const,
    name: 'Avicennia marina',
    nameId: 'Api-Api Putih',
    icon: '🌱',
    colorBg: '#F0FDF4',
    colorBorder: '#86EFAC',
    desc: 'Pionir mangrove yang tumbuh di zona terdepan (seaward edge). Memiliki akar napas (pneumatophores) berbentuk pensil yang muncul dari lumpur.',
    role: 'Koloni pertama yang menstabilkan pantai terbuka. Daun gugur menjadi detritus yang mendukung rantai makanan detritivor.',
  },
  {
    type: 'flora' as const,
    name: 'Sonneratia alba',
    nameId: 'Pedada / Bogem',
    icon: '🌳',
    colorBg: '#F5F3FF',
    colorBorder: '#DDD6FE',
    desc: 'Pohon mangrove berbunga dengan pneumatophores besar. Buahnya dapat dimakan dan sering ditemukan di zona dengan salinitas lebih tinggi.',
    role: 'Buah menjadi sumber pakan bagi kelelawar pemakan buah (Pteropus) yang penting sebagai penyerbuk dan penyebar biji.',
  },
  {
    type: 'flora' as const,
    name: 'Bruguiera gymnorrhiza',
    nameId: 'Lenggadai',
    icon: '🌲',
    colorBg: '#FEF9C3',
    colorBorder: '#FDE047',
    desc: 'Memiliki akar lutut (knee roots) yang khas dan buah vivipar memanjang. Tumbuh di zona lebih ke dalam (landward) dari Rhizophora.',
    role: 'Menyediakan kayu berkualitas baik secara tradisional dan habitat bagi burung bersarang di kanopi.',
  },
  {
    type: 'fauna' as const,
    name: 'Scylla serrata',
    nameId: 'Kepiting Bakau',
    icon: '🦀',
    colorBg: '#FEF2F2',
    colorBorder: '#FECACA',
    desc: 'Kepiting berukuran besar dengan capit kuat yang hidup di lubang-lubang di dalam lumpur mangrove. Bernilai ekonomi tinggi bagi nelayan pesisir.',
    role: 'Mendaur ulang nutrisi melalui aktivitas menggali dan memakan detritus. Lubang galian meningkatkan aerasi dan kandungan oksigen sedimen.',
  },
  {
    type: 'fauna' as const,
    name: 'Boleophthalmus sp.',
    nameId: 'Ikan Gelodok',
    icon: '🐟',
    colorBg: '#ECFEFF',
    colorBorder: '#A5F3FC',
    desc: 'Ikan amfibi unik yang dapat bergerak di darat menggunakan siripnya. Ditemukan di dataran lumpur terbuka di sekitar mangrove.',
    role: 'Indikator ekologis kualitas habitat lumpur mangrove. Memakan alga mikroskopik di permukaan lumpur.',
  },
  {
    type: 'fauna' as const,
    name: 'Cerithidea obtusa',
    nameId: 'Siput Bakau',
    icon: '🐚',
    colorBg: '#FFFBEB',
    colorBorder: '#FDE68A',
    desc: 'Moluska gastropoda yang berlimpah di substrat berlumpur mangrove. Hidup di permukaan akar dan lumpur.',
    role: 'Pengurai material organik dan sumber pakan bagi burung pantai dan ikan. Kelimpahannya mencerminkan kesehatan ekosistem.',
  },
  {
    type: 'fauna' as const,
    name: 'Ardea cinerea',
    nameId: 'Bangau Abu-Abu',
    icon: '🦅',
    colorBg: '#F0F9FF',
    colorBorder: '#BAE6FD',
    desc: 'Burung predator berleher panjang yang bertengger dan berburu di tepi mangrove. Sering terlihat berdiri diam menunggu mangsa.',
    role: 'Predator puncak di ekosistem mangrove pesisir. Keberadaannya mengindikasikan kelimpahan ikan dan udang sebagai mangsa.',
  },
];

export const THREATS = [
  { icon: '🏗️', title: 'Alih Fungsi Lahan', desc: 'Konversi kawasan mangrove menjadi tambak, sawah pasang surut, atau lahan bangunan merupakan penyebab utama berkurangnya tutupan mangrove secara global.', severity: 'high' as const },
  { icon: '🪓', title: 'Penebangan Vegetasi', desc: 'Penebangan untuk bahan bakar, bahan bangunan, atau arang tanpa pengelolaan berkelanjutan dapat merusak struktur hutan secara permanen.', severity: 'high' as const },
  { icon: '🗑️', title: 'Pencemaran & Sampah', desc: 'Limbah industri, pertanian, dan sampah plastik yang masuk ke perairan pesisir dapat mengganggu pertumbuhan dan reproduksi vegetasi mangrove.', severity: 'medium' as const },
  { icon: '🌊', title: 'Abrasi & Erosi Pesisir', desc: 'Hilangnya vegetasi mangrove di garis terdepan mengekspos pantai terhadap gelombang, mempercepat erosi yang semakin mengurangi luas kawasan.', severity: 'medium' as const },
  { icon: '🏭', title: 'Aktivitas Tidak Berkelanjutan', desc: 'Penambangan pasir, pembangunan pelabuhan, dan reklamasi tanpa analisis dampak lingkungan dapat mengubah pola arus dan sedimentasi pesisir.', severity: 'medium' as const },
  { icon: '🌡️', title: 'Tekanan Perubahan Iklim', desc: 'Kenaikan muka air laut, perubahan intensitas curah hujan, dan peningkatan suhu permukaan laut dapat mempengaruhi distribusi dan kesehatan ekosistem mangrove.', severity: 'low' as const },
];

export const REFERENCES = [
  {
    category: 'Kebijakan & Data Indonesia',
    items: [
      { title: 'Atlas Mangrove Indonesia', org: 'Kementerian Lingkungan Hidup dan Kehutanan (KLHK)', url: 'https://www.menlhk.go.id', note: 'Data tutupan mangrove nasional' },
      { title: 'One Map Initiative — Peta Mangrove Nasional', org: 'Badan Informasi Geospasial (BIG)', url: 'https://www.big.go.id', note: 'Referensi geospasial mangrove Indonesia' },
    ],
  },
  {
    category: 'Teknologi Satelit',
    items: [
      { title: 'Sentinel-2 MSI User Guide', org: 'European Space Agency (ESA)', url: 'https://sentinel.esa.int/web/sentinel/user-guides/sentinel-2-msi', note: 'Spesifikasi teknis Sentinel-2' },
      { title: 'Copernicus Open Access Hub', org: 'ESA / Copernicus Programme', url: 'https://dataspace.copernicus.eu', note: 'Akses data citra Sentinel-2' },
    ],
  },
  {
    category: 'Google Earth Engine',
    items: [
      { title: 'Google Earth Engine Documentation', org: 'Google LLC', url: 'https://developers.google.com/earth-engine', note: 'Platform komputasi awan geospasial' },
      { title: 'COPERNICUS/S2_SR_HARMONIZED Dataset', org: 'GEE Data Catalog', url: 'https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S2_SR_HARMONIZED', note: 'Dataset Sentinel-2 Level-2A di GEE' },
    ],
  },
  {
    category: 'Referensi Ilmiah Indeks Vegetasi',
    items: [
      { title: 'Mangrove Vegetation Index (MVI)', org: 'Diniz et al., 2019 — Remote Sensing', url: 'https://doi.org/10.3390/rs11091026', note: 'Formula dan validasi MVI' },
      { title: 'Combined Mangrove Recognition Index (CMRI)', org: 'Gupta et al., 2018', url: 'https://doi.org/10.1080/01431161.2018.1479787', note: 'CMRI berbasis NDVI dan NDWI' },
    ],
  },
];
