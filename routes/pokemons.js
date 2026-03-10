import express from 'express';
import { auth } from '../middlewares/auth.js';
import * as pokemonCtrl from '../Controller/pokemonController.js';

const router = express.Router();

router.get('/pokemons', pokemonCtrl.getAll);
router.get('/pokemon/:id', pokemonCtrl.getOne);
router.post('/pokemons', auth, pokemonCtrl.create);
router.put('/pokemon/:id', auth, pokemonCtrl.update);
router.delete('/pokemon/:id', auth, pokemonCtrl.remove);

export default router;