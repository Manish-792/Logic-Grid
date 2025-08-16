import React from 'react';
import ProblemPage from './pages/ProblemPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProblemPage />} />
        <Route path="/problem/:problemId" element={<ProblemPage />} />
        <Route path="*" element={<ProblemPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;