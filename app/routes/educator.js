import { Router } from 'express';
import eduController from '../controllers/educator.js';
import { asyncRoute } from '../utils/errors.js';
import verify from '../middlewares/verify-token.js';
import checkRole from '../middlewares/checkRoles.js';
import role from '../config/roles.js';

const router = Router();
router.use(verify.general);

router
    .route('/:educatorId')
    .get(
        asyncRoute(
            checkRole([
                role.UNIT_ADMIN,
                role.LECTURER,
                role.EDUCATOR,
                role.DIRECTORATE,
                role.METHODIST,
                role.DEPARTMENT_HEAD,
                role.DEPUTY_DEPARTMENT_HEAD,
                role.DEPUTY_DIRECTORATE,
            ])
        ),
        asyncRoute(eduController.getOne)
    )
    .patch(
        asyncRoute(
            checkRole([
                role.UNIT_ADMIN,
                role.DEPARTMENT_HEAD,
                role.DIRECTORATE,
                role.METHODIST,
                role.DEPUTY_DIRECTORATE,
                role.DEPUTY_DEPARTMENT_HEAD,
            ])
        ),
        asyncRoute(eduController.update)
    )
    .delete(
        asyncRoute(
            checkRole([
                role.UNIT_ADMIN,
                role.DEPARTMENT_HEAD,
                role.DIRECTORATE,
                role.METHODIST,
                role.DEPUTY_DIRECTORATE,
                role.DEPUTY_DEPARTMENT_HEAD,
            ])
        ),
        asyncRoute(eduController.deleteEducator)
    );
router
    .route('/')
    .get(
        asyncRoute(
            checkRole([
                role.UNIT_ADMIN,
                role.DIRECTORATE,
                role.DEPARTMENT_HEAD,
                role.METHODIST,
                role.DEPUTY_DIRECTORATE,
                role.DEPUTY_DEPARTMENT_HEAD,
            ])
        ),
        asyncRoute(eduController.getAll)
    )
    .post(
        asyncRoute(
            checkRole([
                role.UNIT_ADMIN,
                role.DEPARTMENT_HEAD,
                role.DIRECTORATE,
                role.METHODIST,
                role.DEPUTY_DIRECTORATE,
                role.DEPUTY_DEPARTMENT_HEAD,
            ])
        ),
        asyncRoute(eduController.create)
    );
router
    .route('/lk/:educatorId')
    .get(
        asyncRoute(
            checkRole([
                role.UNIT_ADMIN,
                role.DEPARTMENT_HEAD,
                role.DIRECTORATE,
                role.METHODIST,
                role.DEPUTY_DIRECTORATE,
                role.DEPUTY_DEPARTMENT_HEAD,
            ])
        ),
        asyncRoute(eduController.getOneLK)
    );
router
    .route('/get/positions')
    .get(
        asyncRoute(
            checkRole([
                role.UNIT_ADMIN,
                role.DEPARTMENT_HEAD,
                role.DIRECTORATE,
                role.METHODIST,
                role.DEPUTY_DIRECTORATE,
                role.DEPUTY_DEPARTMENT_HEAD,
            ])
        ),
        asyncRoute(eduController.getPositions)
    );
router.route('/get/educatorsByDepartment').get(asyncRoute(eduController.getEducatorsByDepartment));

export default router;
