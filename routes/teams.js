    import express from 'express';
    import { auth } from '../middlewares/auth.js';
    import * as teamCtrl from '../Controller/teamController.js';

    const router = express.Router();

    router.get('/', auth, teamCtrl.getMyTeams);
    router.get('/:id', auth, teamCtrl.getTeamById);
    router.post('/', auth, teamCtrl.createTeam);
    router.put('/:id', auth, teamCtrl.updateTeam);
    router.delete('/:id', auth, teamCtrl.deleteTeam);

    export default router;