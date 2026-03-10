import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function AdminDashboard() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPokemons();
  }, [currentPage]);

  const fetchPokemons = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/pokemons?page=${currentPage}&limit=20`);
      setPokemons(response.data.data);
      setTotalPages(response.data.pagination.totalPages || 1);
      setLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement des données.');
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Es-tu sûr de vouloir supprimer ${name} définitivement ?`)) return;

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3000/api/pokemon/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPokemons(pokemons.filter(p => p.id !== id));
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  if (loading && pokemons.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-emerald-400 text-xl font-mono tracking-widest animate-pulse">
          Accès à la base de données Sylphe SARL...
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden p-4 md:p-8 font-sans text-white">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[600px] bg-gradient-to-b from-red-500 to-orange-500 rounded-full blur-[150px] opacity-10 pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] shadow-2xl">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 tracking-tight">
              Administration
            </h1>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/" className="px-6 py-3 rounded-full font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
              Retour au Pokédex
            </Link>
          </div>
        </header>

        {error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-[2rem] p-8 text-center text-red-400 font-bold">
            {error}
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4 text-slate-400 font-bold uppercase tracking-widest text-sm">ID</th>
                  <th className="p-4 text-slate-400 font-bold uppercase tracking-widest text-sm">Sprite</th>
                  <th className="p-4 text-slate-400 font-bold uppercase tracking-widest text-sm">Nom (FR)</th>
                  <th className="p-4 text-slate-400 font-bold uppercase tracking-widest text-sm">Types</th>
                  <th className="p-4 text-slate-400 font-bold uppercase tracking-widest text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pokemons.map(poke => (
                  <tr key={poke.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono text-slate-300">#{String(poke.id).padStart(3, '0')}</td>
                    <td className="p-4">
                      <img 
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png`} 
                        alt={poke.name.french}
                        className="w-12 h-12"
                      />
                    </td>
                    <td className="p-4 font-bold text-white">{poke.name.french}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {poke.type.map(t => (
                          <span key={t} className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-slate-300">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right space-x-3">
                      <Link 
                        to={`/admin/edit/${poke.id}`}
                        className="px-4 py-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-full font-bold text-sm transition-colors border border-emerald-500/20"
                      >
                        Éditer
                      </Link>
                      <button 
                        onClick={() => handleDelete(poke.id, poke.name.french)}
                        className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-full font-bold text-sm transition-colors border border-red-500/20"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-center items-center mt-8 gap-4">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-6 py-2 rounded-full font-bold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Précédent
              </button>
              <span className="text-slate-400 font-bold">
                Page {currentPage} / {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-6 py-2 rounded-full font-bold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}