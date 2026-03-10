import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pokemonsRouter from './routes/pokemons.js';
import connectDB from './db/connect.js'; 
import authRouter from './routes/auth.js';
import pokemonRoutes from './routes/pokemons.js';
import authRoutes from './routes/auth.js';
import favoriteRoutes from './routes/favorites.js';
import statsRoutes from './routes/stats.js';
import teamRoutes from './routes/teams.js';

const app = express();

// Connexion à la base de données
connectDB(); 

app.use(cors());
app.use(express.json());
app.use('/assets', express.static('assets'));
app.use('/api', pokemonRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/teams', teamRoutes);

app.use('/', pokemonsRouter);

app.get('/', (req, res) => {
    res.send('API Pokémon opérationnelle !');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});