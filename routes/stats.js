import express from 'express';
import * as statsCtrl from '../Controller/statsController.js';

const router = express.Router();

router.get('/', statsCtrl.getStats);

export default router;