import { Router } from 'express';
import LeaderboardFactory from '../factories/LeaderBoardFactory';

const router = Router();

const leaderboardController = LeaderboardFactory.make();

router.get('/home', (req, res) => leaderboardController.getResultsHomeTeams(req, res));
router.get('/away', (req, res) => leaderboardController.getResultsAwayTeams(req, res));
router.get('/', (req, res) => leaderboardController.getResults(req, res));

export default router;
