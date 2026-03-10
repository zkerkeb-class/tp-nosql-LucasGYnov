import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-red-600 text-white p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-wider">Pokédex</Link>
        <div className="space-x-4 flex items-center">
          <Link to="/" className="hover:text-red-200 transition">Accueil</Link>
          <Link to="/teams" className="hover:text-red-200 transition">Mes Équipes</Link>
          <Link to="/login" className="bg-white text-red-600 px-4 py-2 rounded-full font-bold hover:bg-gray-100 transition shadow">
            Connexion
          </Link>
        </div>
      </div>
    </nav>
  );
}