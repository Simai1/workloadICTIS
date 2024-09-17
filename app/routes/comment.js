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
        asyncRoute(
            checkRole([
                role.GOD,
                role.GIGA_ADMIN,
                role.UNIT_ADMIN,
                role.DEPARTMENT_HEAD,
                role.DIRECTORATE,
                role.EDUCATOR,
                role.LECTURER,
                role.METHODIST,
                role.DEPUTY_DIRECTORATE,
                role.DEPUTY_DEPARTMENT_HEAD,
            ])
        ),
        asyncRoute(commentContorller.createComment)
    );
router
    .route('/delete/:commentId')
    .delete(
        asyncRoute(
            checkRole([
                role.GOD,
                role.LECTURER,
                role.GIGA_ADMIN,
                role.UNIT_ADMIN,
                role.DEPARTMENT_HEAD,
                role.DIRECTORATE,
                role.METHODIST,
                role.DEPUTY_DIRECTORATE,
                role.DEPUTY_DEPARTMENT_HEAD,
            ])
        ),
        asyncRoute(commentContorller.deleteComment)
    );
router
    .route('/getAllComment')
    .get(
        asyncRoute(
            checkRole([
                role.GOD,
                role.GIGA_ADMIN,
                role.UNIT_ADMIN,
                role.DEPARTMENT_HEAD,
                role.DIRECTORATE,
                role.METHODIST,
                role.LECTURER,
                role.DEPUTY_DIRECTORATE,
                role.DEPUTY_DEPARTMENT_HEAD,
            ])
        ),
        asyncRoute(commentContorller.getAllComments)
    );
router
    .route('/getOwnComments')
    .get(asyncRoute(checkRole([role.GIGA_ADMIN, role.LECTURER])), asyncRoute(commentContorller.getOwnComments));
router
    .route('/deleteAllComments/:workloadId')
    .delete(
        asyncRoute(
            checkRole([
                role.GOD,
                role.GIGA_ADMIN,
                role.UNIT_ADMIN,
                role.DEPARTMENT_HEAD,
                role.DIRECTORATE,
                role.METHODIST,
                role.DEPUTY_DIRECTORATE,
                role.DEPUTY_DEPARTMENT_HEAD,
            ])
        ),
        asyncRoute(commentContorller.deleteAllComments)
    );
router
    .route('/getCommentWorkload/:workloadId')
    .get(
        asyncRoute(checkRole([role.DEPARTMENT_HEAD, role.DIRECTORATE, role.METHODIST, role.LECTURER, role.EDUCATOR])),
        asyncRoute(commentContorller.getCommentsWorkload)
    );
export default router;
