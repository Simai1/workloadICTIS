import { Router } from 'express';
import workloadController from '../controllers/workload.js';
import { asyncRoute } from '../utils/errors.js';
import verify from '../middlewares/verify-token.js';
import role from '../config/roles.js';
import checkRole from '../middlewares/checkRoles.js';
// import checkHours from '../utils/notification.js';

const router = Router();
router.use(verify.general);

router.route('/:department').get(asyncRoute(workloadController.getDepartment));
router.route('/split').post(asyncRoute(workloadController.splitRow));
router
    .route('/faculty')
    .patch(asyncRoute(workloadController.facultyEducator))
    .delete(asyncRoute(workloadController.unfacultyEducator));
router.route('/unFaculty').delete(asyncRoute(workloadController.unfacultyEducator));
router.route('/:id/update').get(asyncRoute(workloadController.getOne)).patch(asyncRoute(workloadController.update));
router.route('/map').post(asyncRoute(workloadController.mapRow));
router.route('/delete/:id').delete(asyncRoute(workloadController.deleteWorkload));
router.route('/deleteSeveralWorkloads').delete(asyncRoute(workloadController.deleteSeveralWorkloads));
router.route('/').get(asyncRoute(workloadController.getAllWorkload));
router.route('/getSummaryWorkload/:id').get(asyncRoute(workloadController.getSummaryWorkload));
// router.route('/hours/:id').get(asyncRoute(workloadController.getHours));
router
    .route('/get/departments')
    .get(
        asyncRoute(checkRole([role.DEPARTMENT_HEAD, role.DIRECTORATE, role.LECTURER, role.METHODIST])),
        asyncRoute(workloadController.getAllDepartment)
    );
router
    .route('/get/department')
    .get(
        asyncRoute(checkRole([role.LECTURER, role.DIRECTORATE])),
        asyncRoute(workloadController.getDepartmentWorkload)
    );
export default router;
