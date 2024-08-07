import { Router } from 'express';
import { asyncRoute } from '../utils/errors.js';
import materialsController from '../controllers/materials.js';
import verify from '../middlewares/verify-token.js';

const router = Router();
router.use(verify.general);

router.route('/').post(asyncRoute(materialsController.getAll)).patch(asyncRoute(materialsController.update));
router.route('/sync').get(asyncRoute(materialsController.sync));
router.route('/:materialId').delete(asyncRoute(materialsController.deleteMaterial));
router.route('/getUsableDepartments').get(asyncRoute(materialsController.getUsableDepartments));
router.route('/block').patch(asyncRoute(materialsController.blockMaterials));
router.route('/unblock').patch(asyncRoute(materialsController.unblockMaterials));
export default router;
