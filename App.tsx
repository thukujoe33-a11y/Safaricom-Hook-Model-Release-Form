
import React from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import FormPage from './pages/FormPage';
import AdminPage from './pages/AdminPage';

const Header = () => (
  <header className="bg-safaricom-dark text-safaricom-light p-4 shadow-md">
    <div className="container mx-auto flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-safaricom-green">Safaricom<span className="text-safaricom-light">Hook</span></Link>
      <nav>
        <Link to="/admin" className="text-safaricom-light hover:text-safaricom-green transition-colors">Admin Login</Link>
      </nav>
    </div>
  </header>
);

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <Header />
        <main className="container mx-auto p-4 md:p-8">
          <Routes>
            <Route path="/" element={<FormPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;
