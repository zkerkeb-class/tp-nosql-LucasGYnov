import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [allPokemons, setAllPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  
  const [addingToTeamId, setAddingToTeamId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchTeams();
    fetchAllPokemons();
  }, []);

  const fetchTeams = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vous devez être connecté pour voir vos équipes.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://localhost:3000/api/teams', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeams(response.data);
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        setError('Votre session a expiré. Veuillez vous reconnecter.');
      } else {
        setError('Erreur lors du chargement des équipes.');
      }
      setLoading(false);
    }
  };

  const fetchAllPokemons = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/pokemons?limit=151');
      setAllPokemons(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const response = await axios.post(
        'http://localhost:3000/api/teams',
        { name: newTeamName, pokemons: [] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTeams([...teams, response.data]);
      setShowTeamModal(false);
      setNewTeamName('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette équipe ?')) return;
    
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3000/api/teams/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeams(teams.filter(t => t._id !== teamId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPokemonToTeam = async (pokemon) => {
    const team = teams.find(t => t._id === addingToTeamId);
    
    if (team.pokemons.some(p => p.id === pokemon.id)) {
      alert(`${pokemon.name.french} est déjà dans cette équipe !`);
      return;
    }

    const updatedPokemonIds = [...team.pokemons.map(p => p.id), pokemon.id];
    const token = localStorage.getItem('token');

    try {
      const response = await axios.put(
        `http://localhost:3000/api/teams/${team._id}`, 
        { pokemons: updatedPokemonIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setTeams(teams.map(t => t._id === team._id ? response.data : t));
      setAddingToTeamId(null);
      setSearchQuery('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemovePokemonFromTeam = async (teamId, pokemonIdToRemove) => {
    const team = teams.find(t => t._id === teamId);
    const updatedPokemonIds = team.pokemons.filter(p => p.id !== pokemonIdToRemove).map(p => p.id);
    const token = localStorage.getItem('token');

    try {
      const response = await axios.put(
        `http://localhost:3000/api/teams/${teamId}`, 
        { pokemons: updatedPokemonIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setTeams(teams.map(t => t._id === teamId ? response.data : t));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPokemons = allPokemons.filter(p => 
    p.name.french.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-indigo-400 text-xl font-mono tracking-widest animate-pulse">
          Synchronisation du PC...
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-950 p-4 md:p-8 font-sans text-white">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full blur-[150px] opacity-20 pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] shadow-2xl">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tight">
            Mes Équipes
          </h1>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/" className="px-6 py-3 rounded-full font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
              Retour au Pokédex
            </Link>
            {!error && (
              <button 
                onClick={() => setShowTeamModal(true)}
                className="px-6 py-3 rounded-full font-bold text-slate-900 bg-gradient-to-r from-indigo-400 to-purple-400 hover:from-indigo-300 hover:to-purple-300 transition-all shadow-[0_0_30px_-5px_rgba(129,140,248,0.4)]"
              >
                + Nouvelle Équipe
              </button>
            )}
          </div>
        </header>

        {error ? (
          <div className="bg-white/5 backdrop-blur-md border border-red-500/30 rounded-[2rem] p-12 text-center max-w-2xl mx-auto shadow-2xl">
            <h2 className="text-2xl font-bold text-red-400 mb-6">{error}</h2>
            <Link to="/login" className="inline-block px-8 py-4 rounded-full font-bold text-slate-900 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 transition-all shadow-[0_0_30px_-5px_rgba(52,211,153,0.4)]">
              Aller à la page de connexion
            </Link>
          </div>
        ) : teams.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-12 text-center shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-300 mb-4">Vous n'avez pas encore d'équipe.</h2>
            <p className="text-slate-500">Cliquez sur "+ Nouvelle Équipe" pour commencer.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {teams.map((team) => (
              <div key={team._id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 hover:bg-white/10 transition-all shadow-xl group">
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                  <h2 className="text-3xl font-bold text-white tracking-wide">{team.name}</h2>
                  <button 
                    onClick={() => handleDeleteTeam(team._id)}
                    className="text-red-400 hover:text-red-300 font-semibold px-4 py-2 bg-red-500/10 rounded-full border border-red-500/20 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                  {[...Array(6)].map((_, index) => {
                    const poke = team.pokemons && team.pokemons[index];
                    return (
                      <div key={index} className="aspect-square bg-black/20 rounded-2xl border border-white/5 flex items-center justify-center relative overflow-hidden group/slot transition-all">
                        {poke ? (
                          <>
                            <div className="absolute inset-0 bg-red-500/20 opacity-0 group-hover/slot:opacity-100 transition-opacity z-10 flex items-center justify-center backdrop-blur-sm cursor-pointer" onClick={() => handleRemovePokemonFromTeam(team._id, poke.id)}>
                              <span className="text-red-400 font-bold text-xl">&times;</span>
                            </div>
                            <img 
                              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png`} 
                              alt={poke?.name?.french || 'Pokemon'}
                              className="w-16 h-16 drop-shadow-md relative z-0"
                            />
                          </>
                        ) : (
                          <button 
                            onClick={() => setAddingToTeamId(team._id)}
                            className="w-full h-full text-white/10 font-bold text-2xl hover:bg-white/5 hover:text-white/40 transition-all"
                          >
                            +
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-white/10 rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            <h2 className="text-2xl font-bold mb-6 text-white">Nom de l'équipe</h2>
            <form onSubmit={handleCreateTeam}>
              <input
                type="text"
                required
                autoFocus
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Ex: Équipe Ligue Indigo..."
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 mb-8"
              />
              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => setShowTeamModal(false)}
                  className="px-6 py-2 rounded-full font-semibold text-slate-300 hover:bg-white/5 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full font-bold text-slate-900 bg-gradient-to-r from-indigo-400 to-purple-400 hover:from-indigo-300 hover:to-purple-300 transition-all"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {addingToTeamId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-white/10 rounded-[2rem] p-6 w-full max-w-2xl shadow-2xl relative overflow-hidden flex flex-col h-[80vh]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-cyan-400"></div>
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Ajouter un Pokémon</h2>
              <button onClick={() => setAddingToTeamId(null)} className="text-slate-400 hover:text-white text-2xl">&times;</button>
            </div>

            <input
              type="text"
              placeholder="Rechercher un Pokémon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 mb-6"
            />

            <div className="flex-1 overflow-y-auto custom-scrollbar grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 pr-2">
              {filteredPokemons.map(poke => (
                <button
                  key={poke.id}
                  onClick={() => handleAddPokemonToTeam(poke)}
                  className="bg-white/5 border border-white/10 rounded-xl p-2 flex flex-col items-center hover:bg-white/10 transition-colors group"
                >
                  <img 
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png`} 
                    alt={poke.name.french}
                    className="w-16 h-16 group-hover:scale-110 transition-transform"
                  />
                  <span className="text-xs font-bold text-slate-300 mt-2 text-center">{poke.name.french}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}