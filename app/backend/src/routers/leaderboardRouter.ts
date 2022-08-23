import { Router } from 'express';
import LeaderboardController from '../controllers/leaderBoardController';

const router = Router();

router.get('/home', (req, res) => LeaderboardController.getResultsHomeTeams(req, res));
router.get('/away', (req, res) => LeaderboardController.getResultsAwayTeams(req, res));

export default router;
