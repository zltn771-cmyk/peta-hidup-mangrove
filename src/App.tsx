import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { PetaPage } from './pages/PetaPage';
import { AnalisisPage } from './pages/AnalisisPage';
import { PerubahanPage } from './pages/PerubahanPage';
import { AiClassificationPage } from './pages/AiClassificationPage';
import { LaporanPage } from './pages/LaporanPage';
import { EdukasiPage } from './pages/EdukasiPage';
import { TentangPage } from './pages/TentangPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="peta" element={<PetaPage />} />
          <Route path="analisis" element={<AnalisisPage />} />
          <Route path="perubahan" element={<PerubahanPage />} />
          <Route path="ai-klasifikasi" element={<AiClassificationPage />} />
          <Route path="laporan" element={<LaporanPage />} />
          <Route path="edukasi" element={<EdukasiPage />} />
          <Route path="tentang" element={<TentangPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
