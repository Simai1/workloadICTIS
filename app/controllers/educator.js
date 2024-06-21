import Educator from '../models/educator.js';
import EducatorDto from '../dtos/educator-dto.js';
import { AppErrorAlreadyExists, AppErrorForbiddenAction, AppErrorMissing, AppErrorNotExist } from '../utils/errors.js';
import { map as mapPositions } from '../config/position.js';
import associateEducator from '../utils/associate-educator.js';
import SummaryWorkload from '../models/summary-workload.js';
import EducatorListDto from '../dtos/educator-list-dto.js';
import User from '../models/user.js';
import EducatorProfileDto from '../dtos/educator-profile-dto.js';
import Workload from '../models/workload.js';
import departments from '../config/departments.js';
import WorkloadProfileDto from '../dtos/workload-profile-dto.js';

export default {
    async getAll(params, res) {
        const educators = await Educator.findAll({
            include: [
                {
                    model: SummaryWorkload,
                },
            ],
            order: [
                ['department', 'ASC'],
                ['name', 'ASC'],
            ],
        });
        const educatorDtos = [];
        for (const educator of educators) {
            const educatorDto = new EducatorListDto(educator);
            educatorDtos.push(educatorDto);
        }
        if (!educatorDtos.length) {
            // Если нет преподавателей, отправляем 404 и выходим из функции
            return res.status(404).json('Educator not found');
        }
        res.json(educatorDtos);
    },

    async getOne({ params: { educatorId } }, res) {
        if (!educatorId) throw new AppErrorMissing('educatorId');
        const educator = await Educator.findOne({
            where: { id: educatorId },
            include: {
                model: SummaryWorkload,
            },
        });
        if (!educator) throw new AppErrorNotExist('educator');
        const educatorProfileDto = new EducatorListDto(educator);

        res.json(educatorProfileDto);
    },

    async getOneLK({ params: { educatorId } }, res) {
        if (!educatorId) throw new AppErrorMissing('educatorId');
        const educator = await Educator.findOne({
            where: { id: educatorId },
            include: {
                model: SummaryWorkload,
            },
        });
        if (!educator) throw new AppErrorNotExist('educator');
        const educatorProfileDto = new EducatorProfileDto(educator);

        const workloads = await Workload.findAll({
            where: {
                educatorId,
            },
        });
        console.log(workloads.length);
        const workloadsDto = [];
        let flag;
        for (const workload of workloads) {
            flag = true;
            for (const workloadDto of workloadsDto) {
                if (
                    departments[workloadDto.department] === workload.department &&
                    workloadDto.discipline === workload.discipline
                ) {
                    workloadDto.hoursFirstPeriod += workload.period === 1 ? workload.hours : 0;
                    workloadDto.hoursSecondPeriod += workload.period === 2 ? workload.hours : 0;
                    workloadDto.hoursWithoutPeriod += workload.period === null ? workload.hours : 0;
                    flag = false;
                    console.log(workloadDto);
                    break;
                }
            }
            if (flag) workloadsDto.push(new WorkloadProfileDto(workload));
        }

        educatorProfileDto.workloads.push(workloadsDto);
        res.json(educatorProfileDto);
    },

    // Обновляем данные преподователя
    async update({ params: { educatorId }, body: { name, position, rate, email, department } }, res) {
        if (!educatorId) throw new AppErrorMissing('educatorId');
        const educator = await Educator.findByPk(educatorId);
        if (!educator) throw new AppErrorNotExist('educator');

        if (!name && !position && !rate) throw new AppErrorMissing('body');
        if (!name) name = educator.name;
        if (!position) position = educator.position;
        if (!rate) rate = educator.rate;
        if (!email) email = educator.email;
        if (!department) department = educator.department;

        await educator.update({
            name,
            position,
            rate,
            email,
            department,
        });

        res.json(educator);
    },
    // Создаем преподователя
    async create({ body: { name, position, rate, email, department }, user }, res) {
        if (!name) throw new AppErrorMissing('name');
        if (!position) throw new AppErrorMissing('position');
        if (!rate) throw new AppErrorMissing('rate');
        if (!email) throw new AppErrorMissing('email');
        if (!department) throw new AppErrorMissing('department');
        const checkEducator = await Educator.findOne({ where: { email } });
        if (checkEducator) throw new AppErrorAlreadyExists('educator');

        const educator = await Educator.create({
            name,
            email,
            position,
            rate,
            department,
        });
        const educatorDto = new EducatorDto(educator);
        try {
            const _user = await User.findOne({ where: { email } });
            if (_user) await associateEducator(_user);
        } catch (e) {
            console.log('Educator is not associated');
        }
        res.json(educatorDto);
    },
    async getPositions(params, res) {
        res.json(mapPositions);
    },

    async deleteEducator({ params: { educatorId }, user }, res) {
        if (!educatorId) throw new AppErrorMissing('educatorId');

        const thisEducator = await Educator.findOne({ where: { userId: user } });

        if (educatorId === thisEducator.id) throw AppErrorForbiddenAction();

        const educator = await Educator.findByPk(educatorId);

        if (!educator) {
            return res.status(404).json('Educator not found');
        }

        await educator.destroy({ force: true });

        res.status(200).json('Successfully deleted');
    },
    async getEducatorsByDepartment(req, res) {
        const userId = req.user;
        const educator = await Educator.findOne({
            where: { userId },
            include: [{ model: User }],
        });
        let educators;
        if (educator.User.role === 6) {
            educators = await Educator.findAll({
                where: { department: educator.User.allowedDepartments },
                include: [
                    {
                        model: SummaryWorkload,
                    },
                ],
            });
        } else {
            const department = educator.department;

            educators = await Educator.findAll({
                where: { department },
                include: [
                    {
                        model: SummaryWorkload,
                    },
                ],
            });
        }
        const educatorsDto = educators.map(educator => new EducatorListDto(educator));
        res.json(educatorsDto);
    },
};
