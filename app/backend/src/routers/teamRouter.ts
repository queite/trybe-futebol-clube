import { Router } from 'express';
import TeamFactory from '../factories/TeamFActory';

const router = Router();

const teamController = TeamFactory.make();

router.get('/', (req, res) => teamController.getAll(req, res));
router.get('/:id', (req, res) => teamController.getById(req, res));

export default router;
