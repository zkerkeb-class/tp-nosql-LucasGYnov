import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function EditPokemon() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({
    name: { french: '', english: '', japanese: '' },
    type: '',
    base: { HP: 0, Attack: 0, Defense: 0, SpecialAttack: 0, SpecialDefense: 0, Speed: 0 }
  });

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/pokemon/${id}`);
        const data = response.data;
        
        setFormData({
          name: {
            french: data.name.french || '',
            english: data.name.english || '',
            japanese: data.name.japanese || ''
          },
          type: data.type.join(', '),
          base: {
            HP: data.base.HP || 0,
            Attack: data.base.Attack || 0,
            Defense: data.base.Defense || 0,
            SpecialAttack: data.base.SpecialAttack || 0,
            SpecialDefense: data.base.SpecialDefense || 0,
            Speed: data.base.Speed || 0
          }
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setMessage({ text: 'Erreur lors du chargement des données.', type: 'error' });
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('name.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({ ...prev, name: { ...prev.name, [field]: value } }));
    } else if (name.startsWith('base.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({ ...prev, base: { ...prev.base, [field]: Number(value) } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const payload = {
      ...formData,
      type: formData.type.split(',').map(t => t.trim()).filter(t => t !== '')
    };

    try {
      await axios.put(`http://localhost:3000/api/pokemon/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ text: 'Modifications sauvegardées avec succès !', type: 'success' });
      setTimeout(() => navigate('/admin'), 1500);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setMessage({ text: 'Erreur lors de la sauvegarde.', type: 'error' });
      }
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-amber-400 text-xl font-mono tracking-widest animate-pulse">
          Chargement des données génétiques...
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden p-4 md:p-8 font-sans text-white">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[600px] bg-gradient-to-b from-amber-500 to-orange-500 rounded-full blur-[150px] opacity-10 pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] shadow-2xl">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 tracking-tight">
            Édition : #{String(id).padStart(3, '0')}
          </h1>
          <Link to="/admin" className="mt-4 md:mt-0 px-6 py-3 rounded-full font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
            Annuler
          </Link>
        </header>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
          {message.text && (
            <div className={`mb-8 p-4 rounded-2xl border ${message.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'} text-sm font-bold text-center`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            <div>
              <h2 className="text-xl font-bold text-slate-300 uppercase tracking-widest border-b border-white/10 pb-2 mb-6">Identité</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2 ml-2">Nom (FR)</label>
                  <input
                    type="text"
                    name="name.french"
                    value={formData.name.french}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2 ml-2">Nom (EN)</label>
                  <input
                    type="text"
                    name="name.english"
                    value={formData.name.english}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2 ml-2">Nom (JP)</label>
                  <input
                    type="text"
                    name="name.japanese"
                    value={formData.name.japanese}
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-300 uppercase tracking-widest border-b border-white/10 pb-2 mb-6">Caractéristiques</h2>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2 ml-2">Types (séparés par des virgules)</label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Fire, Flying"
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-300 uppercase tracking-widest border-b border-white/10 pb-2 mb-6">Statistiques de base</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {Object.keys(formData.base).map((stat) => (
                  <div key={stat}>
                    <label className="block text-sm font-bold text-slate-400 mb-2 ml-2">{stat}</label>
                    <input
                      type="number"
                      name={`base.${stat}`}
                      value={formData.base[stat]}
                      onChange={handleChange}
                      required
                      min="1"
                      max="255"
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-4 rounded-2xl font-bold text-slate-900 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 transition-all shadow-[0_0_30px_-5px_rgba(251,191,36,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Sauvegarde...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}