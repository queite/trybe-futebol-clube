import { Router } from 'express';
import LeaderboardController from '../controllers/leaderBoardController';

const router = Router();

router.get('/home', (req, res) => LeaderboardController.getResults(req, res));

export default router;
