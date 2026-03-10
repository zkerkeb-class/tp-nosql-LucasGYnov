import express from 'express';
import { auth } from '../middlewares/auth.js';
import * as favoriteCtrl from '../Controller/favoriteController.js';

const router = express.Router();

router.get('/', auth, favoriteCtrl.getMyFavorites);
router.post('/:pokemonId', auth, favoriteCtrl.addFavorite);
router.delete('/:pokemonId', auth, favoriteCtrl.removeFavorite);

export default router;