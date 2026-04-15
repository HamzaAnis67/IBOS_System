import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Tasks from './pages/Tasks';
import Invoices from './pages/Invoices';
import Messages from './pages/Messages';

export default function App() {
  return (
    <Router>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50">
            <Routes>
              <Route path="/" element={<Navigate to="/tasks" />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/messages" element={<Messages />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}