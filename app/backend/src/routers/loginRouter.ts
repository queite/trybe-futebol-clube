import { Router } from 'express';
import UserFactory from '../factories/UserFactory';

const loginController = UserFactory.make();

const router = Router();

router.post('/', (req, res) => loginController.login(req, res));
router.get('/validate', (req, res) => loginController.validate(req, res));

export default router;
