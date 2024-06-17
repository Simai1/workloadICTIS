import { Router } from 'express';
import commentContorller from '../controllers/comment.js';
import { asyncRoute } from '../utils/errors.js';
import verify from '../middlewares/verify-token.js';
import checkRole from '../middlewares/checkRoles.js';
import role from '../config/roles.js';

const router = Router();
router.use(verify.general);

router
    .route('/createComment')
    .post(
        asyncRoute(checkRole([role.DEPARTMENT_HEAD, role.DIRECTORATE, role.EDUCATOR, role.LECTURER, role.METHODIST])),
        asyncRoute(commentContorller.createComment)
    );
router
    .route('/delete/:commentId')
    .delete(
        asyncRoute(checkRole([role.DEPARTMENT_HEAD, role.DIRECTORATE, role.METHODIST])),
        asyncRoute(commentContorller.deleteComment)
    );
router
    .route('/getAllComment')
    .get(
        asyncRoute(checkRole([role.DEPARTMENT_HEAD, role.DIRECTORATE, role.METHODIST, role.LECTURER])),
        asyncRoute(commentContorller.getAllComments)
    );
router
    .route('/getOwnComments')
    .get(asyncRoute(checkRole([role.LECTURER])), asyncRoute(commentContorller.getOwnComments));
router
    .route('/deleteAllComments/:workloadId')
    .delete(
        asyncRoute(checkRole([role.DEPARTMENT_HEAD, role.DIRECTORATE, role.METHODIST])),
        asyncRoute(commentContorller.deleteAllComments)
    );

export default router;
