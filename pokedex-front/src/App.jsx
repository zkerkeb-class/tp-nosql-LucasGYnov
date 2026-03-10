import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PokemonDetail from './pages/PokemonDetail';
import Login from './pages/Login';
import Teams from './pages/Teams';
import AdminDashboard from './pages/AdminDashboard';
import EditPokemon from './pages/EditPokemon';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 font-sans text-white selection:bg-emerald-500/30">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pokemon/:id" element={<PokemonDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/edit/:id" element={<EditPokemon />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;