import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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

export default function PokemonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isShiny, setIsShiny] = useState(false);

  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    axios.get(`http://localhost:3000/api/pokemon/${id}`)
      .then(response => {
        setPokemon(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, [id]);

  const handleOpenTeamModal = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setShowModal(true);
    setModalLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await axios.get('http://localhost:3000/api/teams', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeams(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setMessage({ text: 'Erreur lors du chargement des équipes.', type: 'error' });
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleAddToTeam = async (team) => {
    if (team.pokemons.length >= 6) {
      setMessage({ text: 'Cette équipe est déjà complète (6 max).', type: 'error' });
      return;
    }

    const isAlreadyInTeam = team.pokemons.some(p => (p.id || p) === pokemon.id);
    if (isAlreadyInTeam) {
      setMessage({ text: `${pokemon.name.french} est déjà dans cette équipe !`, type: 'error' });
      return;
    }

    const currentPokemonIds = team.pokemons.map(p => p.id || p);
    const updatedPokemons = [...currentPokemonIds, pokemon.id];
    const token = localStorage.getItem('token');

    try {
      await axios.put(`http://localhost:3000/api/teams/${team._id}`, 
        { pokemons: updatedPokemons },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ text: `${pokemon.name.french} a été ajouté à ${team.name} !`, type: 'success' });
      setTimeout(() => setShowModal(false), 2000);
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Erreur lors de l\'ajout à l\'équipe.', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-emerald-400 text-xl font-mono tracking-widest animate-pulse">
          Analyse des données en cours...
        </div>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
        <h1 className="text-4xl font-bold mb-4">Pokémon introuvable</h1>
        <Link to="/" className="px-6 py-3 bg-white/10 rounded-full hover:bg-white/20 transition">Retour au Pokédex</Link>
      </div>
    );
  }

  const mainType = pokemon.type[0];
  const gradientClass = typeGradients[mainType] || "from-slate-400 to-gray-600";
  const imagePath = isShiny ? 'shiny/' : '';

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden p-4 md:p-8 font-sans text-white">
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[600px] bg-gradient-to-b ${gradientClass} rounded-full blur-[120px] opacity-20 pointer-events-none z-0`}></div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="inline-block px-6 py-3 rounded-2xl font-semibold bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all shadow-xl">
            &laquo; Retour
          </Link>
          <button 
            onClick={handleOpenTeamModal}
            className="px-6 py-3 rounded-2xl font-bold text-slate-900 bg-gradient-to-r from-indigo-400 to-purple-400 hover:from-indigo-300 hover:to-purple-300 transition-all shadow-[0_0_30px_-5px_rgba(129,140,248,0.4)]"
          >
            + Ajouter à une équipe
          </button>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl overflow-hidden relative">
          <span className="absolute top-8 right-8 text-white/10 font-black text-8xl md:text-9xl tracking-tighter pointer-events-none">
            #{String(pokemon.id).padStart(3, '0')}
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-center relative">
              <div className={`absolute inset-0 bg-gradient-to-tr ${gradientClass} rounded-full blur-[60px] opacity-30 animate-pulse`}></div>
              
              <img 
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${imagePath}${pokemon.id}.png`} 
                alt={pokemon.name.french} 
                className="relative z-10 w-64 h-64 md:w-96 md:h-96 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform duration-500 mb-8"
              />

              <button
                onClick={() => setIsShiny(!isShiny)}
                className={`relative z-10 px-6 py-3 rounded-full font-bold tracking-widest uppercase text-sm transition-all duration-300 flex items-center gap-2 ${isShiny ? 'bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900 shadow-[0_0_30px_-5px_rgba(251,191,36,0.6)]' : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'}`}
              >
                {isShiny ? '✨ Version Normale' : '✨ Version Shiny'}
              </button>
            </div>

            <div className="flex flex-col z-10">
              <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight drop-shadow-md">
                {pokemon.name.french}
              </h1>
              <h2 className="text-xl md:text-2xl text-slate-400 font-medium mb-6">
                {pokemon.name.english} / {pokemon.name.japanese}
              </h2>

              <div className="flex gap-3 mb-10">
                {pokemon.type.map(t => (
                  <span key={t} className={`bg-gradient-to-r ${typeGradients[t] || "from-gray-400 to-gray-500"} px-6 py-2 rounded-full text-white font-bold tracking-widest uppercase text-sm shadow-lg`}>
                    {t}
                  </span>
                ))}
              </div>

              <div className="space-y-6 bg-black/20 p-6 rounded-3xl border border-white/5">
                <h3 className="text-xl font-bold text-white/80 uppercase tracking-widest border-b border-white/10 pb-2">Statistiques de base</h3>
                
                {Object.entries(pokemon.base).map(([statName, statValue]) => {
                  const percentage = Math.min((statValue / 255) * 100, 100);
                  return (
                    <div key={statName}>
                      <div className="flex justify-between text-sm font-semibold mb-1">
                        <span className="text-slate-300 uppercase">{statName}</span>
                        <span className="text-white">{statValue}</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className={`h-2.5 rounded-full bg-gradient-to-r ${gradientClass}`} 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-white/10 rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            
            <h2 className="text-2xl font-bold mb-6 text-white text-center">
              Ajouter {pokemon.name.french} à...
            </h2>

            {message.text && (
              <div className={`mb-6 p-4 rounded-2xl border ${message.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'} text-sm font-semibold text-center`}>
                {message.text}
              </div>
            )}

            {modalLoading ? (
              <div className="text-center text-slate-400 py-8">Chargement de vos équipes...</div>
            ) : teams.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-400 mb-4">Vous n'avez aucune équipe.</p>
                <Link to="/teams" className="text-indigo-400 hover:text-indigo-300 font-bold">Créer une équipe</Link>
              </div>
            ) : (
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {teams.map(team => (
                  <button
                    key={team._id}
                    onClick={() => handleAddToTeam(team)}
                    disabled={team.pokemons.length >= 6 || team.pokemons.some(p => (p.id || p) === pokemon.id)}
                    className="w-full flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left group"
                  >
                    <span className="font-bold text-white group-hover:text-indigo-300 transition-colors">{team.name}</span>
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${team.pokemons.length >= 6 ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-slate-300'}`}>
                      {team.pokemons.length}/6
                    </span>
                  </button>
                ))}
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 rounded-full font-semibold text-slate-300 hover:bg-white/5 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}