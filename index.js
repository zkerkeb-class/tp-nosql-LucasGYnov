import 'dotenv/config'; // Charge le .env immédiatement
import express from 'express';
import cors from 'cors';
import pokemonsRouter from './routes/pokemons.js';
import connectDB from './db/connect.js'; // Un seul import suffit

const app = express();

// Connexion à la base de données
connectDB(); 

app.use(cors());
app.use(express.json());
app.use('/assets', express.static('assets'));

app.use('/', pokemonsRouter);

app.get('/', (req, res) => {
    res.send('API Pokémon opérationnelle !');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});