import { AppErrorInvalid, AppErrorMissing, AppErrorNotExist } from "../utils/errors.js";
// eslint-disable-next-line import/no-duplicates
import departments from '../config/departments.js';
import Workload from '../models/workload.js';
import Educator from '../models/educator.js';
import Notification from '../models/notifications.js';
import User from '../models/user.js';
// eslint-disable-next-line import/no-duplicates
import {map as mapDepartments} from "../config/departments.js";
import WorkloadDto from '../dtos/workload-dto.js';
import SummaryWorkload from '../models/summary-workload.js';
import checkHours from '../utils/notification.js';
import History from "../models/history.js";
import sendMail from '../services/email.js';
import { Op, Sequelize } from "sequelize";

const getIds = (modelsArr) => {
    const arr = [];
    for (const el of modelsArr){
        arr.push(el.id);
    }
    return arr;
};


export default {
    // Получение нагрузки
    async getAllWorkload({query: {isOid, department}, user}, res) {
        const _user = await User.findByPk(user, { include: Educator });
        try {
            let workloads;
            if (!(typeof isOid === "undefined")){
                if (_user.role === 5 || _user.role === 2){
                    workloads = await Workload.findAll({
                        where: { isOid, educatorId: _user.Educator.id, isBlocked: false},
                        include: { model: Educator },
                        order: [
                            ['discipline', 'ASC'],
                            ['workload', 'ASC'],
                            ['updatedAt', 'ASC'],
                        ],
                    });
                }  else {
                    workloads = await Workload.findAll({
                        where: { isOid },
                        include: { model: Educator },
                        order: [
                            ['updatedAt', 'ASC'],
                            ['discipline', 'ASC'],
                            ['workload', 'ASC'],
                        ],
                    });
                }
                const workloadsDto = workloads.map(workload => new WorkloadDto(workload));
                res.json(workloadsDto);
            } else if (department){
                if (_user.role === 5 || _user.role === 2){
                    workloads = await Workload.findAll({
                        where: {
                            isOid: false,
                            department,
                            educatorId: _user.Educator.id,
                        },
                        include: { model: Educator },
                        order: [
                            ['discipline', 'ASC'],
                            ['workload', 'ASC'],
                            ['updatedAt', 'ASC'],
                        ],
                    });
                } else {
                    workloads = await Workload.findAll({
                        where: {
                            isOid: false,
                            department,
                        },
                        include: { model: Educator },
                        order: [
                            ['discipline', 'ASC'],
                            ['workload', 'ASC'],
                            ['updatedAt', 'ASC'],
                        ],
                    });
                }
                const workloadsDto = workloads.map(workload => new WorkloadDto(workload));
                res.json(workloadsDto);
            } else {
                if (_user.role === 5 || _user.role === 2){
                    workloads = await Workload.findAll({
                        where: {
                            educatorId: _user.Educator.id,
                            isBlocked: false
                        },
                        include: { model: Educator },
                        order: [
                            ['discipline', 'ASC'],
                            ['workload', 'ASC'],
                            ['updatedAt', 'ASC'],
                        ],
                    });
                } else if (_user.role === 3) {
                    workloads = await Workload.findAll({
                        where: { department: _user.Educator.department, isBlocked: false},
                        include: { model: Educator },
                        order: [
                            ['discipline', 'ASC'],
                            ['workload', 'ASC']
                        ],
                    });
                } else {
                    workloads = await Workload.findAll({
                        where: {
                            isBlocked: false
                        },
                        include: { model: Educator },
                        order: [
                            ['discipline', 'ASC'],
                            ['workload', 'ASC'],
                            ['updatedAt', 'ASC'],
                        ],
                    });
                }
                const workloadsDto = workloads.map(workload => new WorkloadDto(workload));
                res.json(workloadsDto);
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async getAllDepartment(req, res) {
        res.json(departments);
    },

    async getDepartment({ params: { department } }, res) {
        if (!department) throw new AppErrorMissing('department');
        if (typeof department !== 'number') department = parseInt(department);
        if (!Object.values(departments).includes(department)) throw new AppErrorInvalid(department);
        const workloads = await Workload.findAll({
            where: { department },
            include: { model: Educator },
            order: ["name", "ASC"],
        });
        // res.json(workloads);
        const workloadsDto = [];
        for (const workload of workloads) {
            const workloadDto = new WorkloadDto(workload);
            workloadsDto.push(workloadDto);
        }
        res.json(workloadsDto);
    },

    async splitRow({ body: { ids, n } }, res) {
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            throw new Error('Укажите идентификаторы нагрузок для разделения');
        }
        if (!n || isNaN(n) || n < 1) {
            throw new Error('Укажите количество групп для разделения нагрузки');
        }
        if (n > 4) {
            throw new Error('Максимальное количество групп для разделения нагрузки - 4');
        }

        // Проверяем существование всех нагрузок
        const existingWorkloads = await Workload.findAll({ where: { id: ids } });

        if (existingWorkloads.length !== ids.length) {
            const existingIds = existingWorkloads.map(workload => workload.id);
            const nonExistingIds = ids.filter(id => !existingIds.includes(id));
            res.status(404).json({ error: `Нагрузки с идентификаторами ${nonExistingIds.join(', ')} не найдены` });
            return;
        }

        // Разделяем нагрузки
        const newWorkloads = [];

        for (const workload of existingWorkloads) {
            const studentsCount = workload.numberOfStudents;
            const studentsPerGroup = Math.floor(studentsCount / n);
            const remainder = studentsCount % n;
            // Создаем и сохраняем новые нагрузки в базу данных
            for (let i = 0; i < n; i++) {
                const copyWorkload = { ...workload.get() };
                copyWorkload.isSplit = true;
                copyWorkload.originalId = workload.id;
                delete copyWorkload.id;
                delete copyWorkload.educatorId;
                delete copyWorkload.EducatorId;
                // Распределение студентов между группами
                if (i < remainder) {
                    // Если индекс группы меньше остатка, добавляем по одному студенту
                    copyWorkload.numberOfStudents = studentsPerGroup + 1;
                } else {
                    // В остальных случаях добавляем студентов равномерно
                    copyWorkload.numberOfStudents = studentsPerGroup;
                }

                const newWorkload = await Workload.create(copyWorkload);
                newWorkloads.push(newWorkload);
            }

            // Удаляем изначальную нагрузку
            await workload.destroy();
        }

        await History.create({
            type: 1,
            before: getIds(existingWorkloads),
            after: getIds(newWorkloads),
        })

        res.json(newWorkloads);
    },

    // Получение нагрузки
    async getOne({ params: { id } }, res) {
        const workload = await Workload.findByPk(id);
        if (!workload) throw new Error('Нет такой нагрузки');
        const workloadDto = new WorkloadDto(workload);
        res.json(workloadDto);
    },

    async update({ params: { id }, body: { numberOfStudents, hours, comment } }, res) {
        try {
            const workload = await Workload.findByPk(id, {
                include: { model: Educator },
            });

            if (!id) throw new Error('Не указан ID');
            if (!workload) {
                throw new Error('Нет такой нагрузки');
            }

            if (!numberOfStudents) numberOfStudents = workload.numberOfStudents;
            if (!hours) hours = workload.hours;
            if (!comment) comment = workload.comment;
            // Обновляем запись в таблице Workload
            await workload.update({
                numberOfStudents,
                hours,
                comment,
            });

            res.json(workload);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async facultyEducator({ body: { educatorId, workloadId } }, res) {
        if (!educatorId) throw new AppErrorMissing('educatorId');
        if (!workloadId) throw new AppErrorMissing('workloadId');
        const checkWorkload = await Workload.findByPk(workloadId);
        if (!checkWorkload) throw new AppErrorNotExist('workload');

         await Workload.update(
            { educatorId },
            {
                where: { id: workloadId },
                individualHooks: true,
            }
        );

        await History.create({
            type: 3,
            before: [],
            after: [workloadId],
        })

        res.json({ status: 'OK' });
    },

    async unfacultyEducator({ body: { workloadId } }, res) {
        if (!workloadId) throw new AppErrorMissing('workloadId');
        const workload = await Workload.findByPk(workloadId);
        if (!workload) throw new AppErrorInvalid('workload');
        const educatorId = workload.educatorId;
        await workload.update({ educatorId: null });

        const remainingWorkloads = await Workload.count({ where: { educatorId } });
        console.log(remainingWorkloads);

        if (remainingWorkloads === 0) {
            // Если нет нагрузок, удаляем предупреждение
            await Notification.destroy({ where: { educatorId }}); // Предположим, что у вас есть метод для удаления summaryWorkload по educatorId
        } else {
            // Если остались нагрузки, все равно вызываем проверку часов
            const summaryWorkload = await SummaryWorkload.findOne({ where: { educatorId } });
            await checkHours(summaryWorkload); // Передаем summaryWorkload в функцию checkHours
        }

        await History.create({
            type: 3,
            before: [workloadId],
            after: [],
        })

        res.json({ status: 'OK' });
    },

    async mapRow({ body: { ids } }, res) {
        const workloads = await Workload.findAll({ where: { id: ids } }, { include: { model: Educator } });

        if (!ids) {
            throw new AppErrorMissing('id');
        }
        // Проверка массива нагрузок на идентичность полей для соединения
        const firstWorkload = workloads[0];
        if (
            workloads.some(
                workload =>
                    workload.department !== firstWorkload.department ||
                    workload.workload !== firstWorkload.workload ||
                    workload.discipline !== firstWorkload.discipline ||
                    workload.core !== firstWorkload.core ||
                    workload.specialty !== firstWorkload.specialty ||
                    workload.hours !== firstWorkload.hours
            )
        ) {
            return res.status(400).json({
                error: 'Invalid request. Department, workload, and discipline must be the same for all workloads.',
            });
        }

        // Совмещаем часы
        let totalStudents = 0;

        workloads.forEach(workload => {
            totalStudents += workload.numberOfStudents;
        });

        // Создаем совмещенную нагрузку
        const mergeWorkload = {
            department: firstWorkload.get('department'),
            discipline: firstWorkload.get('discipline'),
            workload: firstWorkload.get('workload'),
            groups: firstWorkload.get('groups'),
            block: firstWorkload.get('block'),
            semester: firstWorkload.get('semester'),
            period: firstWorkload.get('period'),
            curriculum: firstWorkload.get('curriculum'),
            curriculumUnit: firstWorkload.get('curriculumUnit'),
            formOfEducation: firstWorkload.get('formOfEducation'),
            levelOfTraining: firstWorkload.get('levelOfTraining'),
            specialty: firstWorkload.get('specialty'),
            core: firstWorkload.get('core'),
            numberOfStudents: totalStudents,
            hours: firstWorkload.get('hours'),
            audienceHours: firstWorkload.get('audienceHours'),
            ratingControlHours: firstWorkload.get('ratingControlHours'),
            comment: firstWorkload.get('comment'),
            isSplit: false,
            originalId: null,
            isOid: firstWorkload.get('isOid'),
            kafedralAutumnWorkload: firstWorkload.get('kafedralAutumnWorkload'),
            kafedralSpringWorkload: firstWorkload.get('kafedralSpringWorkload'),
            kafedralAdditionalWorkload: firstWorkload.get('kafedralAdditionalWorkload'),
            instituteAutumnWorkload: firstWorkload.get('instituteAutumnWorkload'),
            instituteSpringWorkload: firstWorkload.get('instituteSpringWorkload'),
            instituteManagementWorkload: firstWorkload.get('instituteManagementWorkload'),
        };

        const createdWorkload = await Workload.create(mergeWorkload);
        // Удаляем записи которые учавствовали в совмещении
        await Promise.allSettled(workloads.map(workload => workload.destroy()));

        await History.create({
            type: 2,
            before: getIds(workloads),
            after: [createdWorkload.id],
        })

        const responseData = {
            id: createdWorkload.id,
            ...mergeWorkload,
        };
        res.json(responseData);
    },

    async deleteWorkload({ params: { id } }, res) {
        if (!id) throw new AppErrorMissing('id');

        const workload = await Workload.findByPk(id);

        if (!workload) {
            return res.status(404).json('Workload not found');
        }

        // Delete the instance from the database
        await workload.destroy({ force: true });

        res.status(200).json('Successfully deleted');
    },
    async deleteSeveralWorkloads({ body: { ids } }, res) {
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            throw new Error('Укажите идентификаторы нагрузок для удаления');
        }

        // Проверяем существование всех нагрузок
        const existingWorkloads = await Workload.findAll({ where: { id: ids } });

        if (existingWorkloads.length !== ids.length) {
            const existingIds = existingWorkloads.map(workload => workload.id);
            const nonExistingIds = ids.filter(id => !existingIds.includes(id));
            res.status(404).json({ error: `Нагрузки с идентификаторами ${nonExistingIds.join(', ')} не найдены` });
            return;
        }

        // Удаляем нагрузки
        await Promise.allSettled(existingWorkloads.map(workload => workload.destroy({ force: true })));

        res.status(200).json('Successfully deleted');
    },

    async getDepartmentWorkload(req, res) {
        const userId = req.user;
        const educator = await Educator.findOne({ where: { userId } });

        const department = educator.department;

        const workloads = await Workload.findAll({
            where: { department, isOid: false },
            order: [
                ['discipline', 'ASC'],
                ['workload', 'ASC'],
                ['updatedAt', 'ASC'],
            ],
            include: { model: Educator },
        });
        const workloadsDto = workloads.map(workload => new WorkloadDto(workload));
        res.json(workloadsDto);
    },
    async getUsableDepartments(req, res){
        const userId = req.user;
        const checkUser = await User.findByPk(userId);
        if (!checkUser) throw new AppErrorNotExist('User');
        const role = checkUser.role;
        const usableDepartments = [];

        // const queryResult = await sequelize.query('SELECT DISTINCT department FROM workloads WHERE department <> 13 ORDER BY department ASC;');
        if(role === 2 || role === 3 ||  role === 5){
            const educator = await Educator.findOne({ where: { userId } });
            const department = educator.department;
            const workload = await Workload.findOne({ where: { department } });
            if (workload?.isBlocked === true){
                usableDepartments.push({
                    id: department,
                    name: mapDepartments[department],
                    blocked: true,
                })
            } else {
                usableDepartments.push({
                    id: department,
                    name: mapDepartments[department],
                    blocked: false,
                })
            }
        } else {
            const departments = await Workload.findAll({
                where: {
                    department: {
                        [Op.ne]: 0,
                    }
                },
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('department')) ,'department'],
                ],
                order: [
                    ['department', 'ASC'],
                ]
            })
            for (const usableDepartment of departments) {
                const department = mapDepartments[usableDepartment.department];
                const workload = await Workload.findOne({ where: { department: usableDepartment.department } });
                if (workload.isBlocked === true){
                    usableDepartments.push({
                        id: usableDepartment.department,
                        name: department,
                        blocked: true,
                    })
                } else {
                    usableDepartments.push({
                        id: usableDepartment.department,
                        name: department,
                        blocked: false,
                    })
                }
            }
        }
        res.json(usableDepartments);
    },
    async changeColorWorkload(req, res) {},

    async blockWorkload({ params: { department } }, res){
        if (!department) throw new AppErrorMissing('department');
        department = parseInt(department);
        if (department === 0) {
            const checkWorkload = await Workload.findOne({ where: { isOid: true } });
            if (checkWorkload.isBlocked === true) throw new Error('Already blocked');
            await Workload.update({ isBlocked: true }, { where: { isOid: true } });
            try {
                sendMail(process.env.EMAIL_RECIEVER, 'blocking', 'Общеинститутская нагрузка');
            } catch (e){
                console.log('Email bad creditionals')
            }
        } else {
            if (!Object.values(departments).includes(department)) throw new AppErrorInvalid('department');
            await Workload.update({ isBlocked: true }, { where: { department } });
            try {
                sendMail(process.env.EMAIL_RECIEVER, 'blocking', `Нагрузка кафедры ${mapDepartments[department]}`);
            } catch (e){
                console.log('Email bad creditionals')
            }
        }
        res.json({ status: 'OK' });
    },

    async unblockWorkload({ params: { department } }, res){
        if (!department) throw new AppErrorMissing('department');
        department = parseInt(department);
        if (department === 0) {
            const checkWorkload = await Workload.findOne({ where: { isOid: true } });
            if (checkWorkload.isBlocked === false) throw new Error('Already unblocked');
            await Workload.update({ isBlocked: false }, { where: { isOid: true } });
        } else {
            if (!Object.values(departments).includes(department)) throw new AppErrorInvalid('department');
            await Workload.update({ isBlocked: false }, { where: { department } });
        }
        res.json({ status: 'OK' });
    },
};
