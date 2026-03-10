import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const typeGradients = {
  Grass: "from-green-400 to-emerald-600",
  Fire: "from-orange-400 to-red-600",
  Water: "from-blue-400 to-cyan-600",
  Bug: "from-lime-400 to-green-600",
  Normal: "from-gray-300 to-gray-500",
  Poison: "from-purple-400 to-fuchsia-600",
  Electric: "from-yellow-300 to-amber-500",
  Ground: "from-yellow-600 to-amber-800",
  Fairy: "from-pink-300 to-rose-400",
  Fighting: "from-red-500 to-rose-700",
  Psychic: "from-fuchsia-400 to-pink-600",
  Rock: "from-yellow-700 to-orange-900",
  Ghost: "from-violet-500 to-purple-800",
  Ice: "from-cyan-200 to-blue-400",
  Dragon: "from-indigo-500 to-blue-800",
  Dark: "from-gray-700 to-slate-900",
  Steel: "from-slate-400 to-gray-600",
  Flying: "from-sky-300 to-blue-500"
};

export default function Home() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    axios.get(`http://localhost:3000/api/pokemons?page=${currentPage}&limit=46`)
      .then(response => {
        setPokemons(response.data.data);
        setTotalPages(response.data.pagination.totalPages || 1);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, [currentPage]);

  const handleFirst = () => setCurrentPage(1);
  
  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleLast = () => setCurrentPage(totalPages);

  if (loading && pokemons.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-emerald-400 text-xl font-mono tracking-widest animate-pulse">
          Connexion au réseau PC de Léo...
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden p-4 md:p-8 font-sans selection:bg-emerald-500/30">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.03] pointer-events-none z-0">
        <svg viewBox="0 0 100 100" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 0C22.4 0 0 22.4 0 50C0 77.6 22.4 100 50 100C77.6 100 100 77.6 100 50C100 22.4 77.6 0 50 0ZM50 8C71.3 8 89.1 23.9 91.6 44H62.9C60.6 34.6 52.1 27.5 42 27.5C31.9 27.5 23.4 34.6 21.1 44H8.4C10.9 23.9 28.7 8 50 8ZM42 56.5C38.4 56.5 35.5 53.6 35.5 50C35.5 46.4 38.4 43.5 42 43.5C45.6 43.5 48.5 46.4 48.5 50C48.5 53.6 45.6 56.5 42 56.5ZM8.4 56H21.1C23.4 65.4 31.9 72.5 42 72.5C52.1 72.5 60.6 65.4 62.9 56H91.6C89.1 76.1 71.3 92 50 92C28.7 92 10.9 76.1 8.4 56Z"/>
        </svg>
      </div>

      <header className="relative z-10 max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-center bg-white/5 backdrop-blur-2xl border border-white/10 p-6 rounded-[2rem] shadow-2xl">
              <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400 tracking-tight">
                Pokédex<span className="text-white">.</span>
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-4 md:mt-0">
                <div className="text-slate-300 font-medium tracking-wide bg-black/20 px-6 py-3 rounded-full border border-white/5 shadow-inner hidden sm:block">
                  Page <span className="text-white font-bold">{currentPage}</span> sur <span className="text-white font-bold">{totalPages}</span>
                </div>
                
                <Link to="/admin" className="px-6 py-3 rounded-full font-bold text-slate-400 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 transition-all shadow-lg">
                  Admin
                </Link>

                <Link to="/teams" className="px-6 py-3 rounded-full font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all shadow-lg">
                  Mes Équipes
                </Link>
                
                <Link to="/login" className="px-6 py-3 rounded-full font-bold text-slate-900 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 transition-all shadow-[0_0_30px_-5px_rgba(52,211,153,0.4)]">
                  Connexion
                </Link>
              </div>
          </header>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[300px] grid-flow-dense">
        {pokemons.map((poke, index) => {
          const isFeatured = index % 10 === 0 || index % 10 === 6; 
          const mainType = poke.type[0];
          const gradientClass = typeGradients[mainType] || "from-slate-400 to-gray-600";
          
          return (
            <Link 
              to={`/pokemon/${poke.id}`}
              key={poke.id} 
              className={`group relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 flex flex-col items-center justify-center transition-all duration-500 hover:bg-white/10 hover:-translate-y-2 hover:border-white/20 ${isFeatured ? 'md:col-span-2 md:row-span-2' : ''}`}
            >
              <div className={`absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-br ${gradientClass} rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
              
              <span className="absolute top-6 left-6 text-white/40 font-bold font-mono text-sm tracking-tighter">
                #{String(poke.id).padStart(3, '0')}
              </span>

              <img 
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${poke.id}.png`} 
                alt={poke.name.french} 
                className={`drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)] transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3 ${isFeatured ? 'w-64 h-64 mt-4' : 'w-36 h-36'} z-10`} 
              />
              
              <h2 className={`font-bold text-white mt-4 z-10 tracking-wide ${isFeatured ? 'text-4xl' : 'text-2xl'}`}>
                {poke.name.french}
              </h2>
              
              <div className="flex gap-2 mt-3 z-10">
                {poke.type.map(t => (
                  <span key={t} className={`bg-gradient-to-r ${typeGradients[t] || "from-gray-400 to-gray-500"} text-[10px] uppercase px-4 py-1.5 rounded-full text-white font-bold tracking-widest shadow-lg`}>
                    {t}
                  </span>
                ))}
              </div>

              {isFeatured && poke.base && (
                <div className="absolute bottom-6 left-6 right-6 flex justify-between bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/5 z-10 hidden sm:flex">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">PV</span>
                    <span className="text-lg font-bold text-white">{poke.base.HP}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Attaque</span>
                    <span className="text-lg font-bold text-white">{poke.base.Attack}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Défense</span>
                    <span className="text-lg font-bold text-white">{poke.base.Defense}</span>
                  </div>
                </div>
              )}
            </Link>
          );
        })}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-wrap justify-center items-center mt-12 gap-4 pb-12">
        <button 
          onClick={handleFirst} 
          disabled={currentPage === 1}
          className="px-6 py-4 rounded-2xl font-semibold text-white bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xl"
        >
          &laquo; Première
        </button>

        <button 
          onClick={handlePrevious} 
          disabled={currentPage === 1}
          className="px-8 py-4 rounded-2xl font-semibold text-white bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xl"
        >
          Précédent
        </button>
        
        <button 
          onClick={handleNext} 
          disabled={currentPage === totalPages}
          className="px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400 transition-all shadow-[0_0_30px_-5px_rgba(239,68,68,0.4)] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Suivante
        </button>

        <button 
          onClick={handleLast} 
          disabled={currentPage === totalPages}
          className="px-6 py-4 rounded-2xl font-semibold text-white bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xl"
        >
          Dernière &raquo;
        </button>
      </div>
    </div>
  );
}