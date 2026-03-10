import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const response = await axios.post(`http://localhost:3000${endpoint}`, {
        username,
        password
      });

      if (isLogin) {
        localStorage.setItem('token', response.data.token);
        navigate('/teams');
      } else {
        setIsLogin(true);
        setUsername('');
        setPassword('');
        setMessage({ text: 'Inscription réussie ! Veuillez vous connecter.', type: 'success' });
      }
    } catch (err) {
      setMessage({ 
        text: err.response?.data?.error || 'Une erreur de communication est survenue.', 
        type: 'error' 
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden flex items-center justify-center p-4 font-sans text-white">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[500px] bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full blur-[150px] opacity-20 pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-md">
        <Link to="/" className="inline-block mb-8 px-6 py-3 rounded-2xl font-semibold bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all shadow-xl">
          &laquo; Retour au Pokédex
        </Link>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight mb-2">
              {isLogin ? 'Connexion' : 'Inscription'}
            </h1>
            <p className="text-slate-400 font-medium">
              {isLogin ? 'Accédez à vos équipes et favoris.' : 'Créez votre compte dresseur.'}
            </p>
          </div>

          {message.text && (
            <div className={`mb-6 p-4 rounded-2xl border ${message.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'} text-sm font-semibold text-center`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-300 uppercase tracking-widest mb-2 ml-4">
                Nom de dresseur
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                placeholder="Ex: Red, Blue, Ash..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 uppercase tracking-widest mb-2 ml-4">
                Mot de passe
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-900 font-bold text-lg px-6 py-4 rounded-2xl transition-all shadow-[0_0_30px_-5px_rgba(52,211,153,0.4)] mt-4"
            >
              {isLogin ? 'Se connecter' : 'Créer mon compte'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage({ text: '', type: '' });
                setError('');
              }}
              className="text-slate-400 hover:text-white font-medium transition-colors text-sm"
            >
              {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}