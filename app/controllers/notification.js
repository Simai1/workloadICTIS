import Educator from '../models/educator.js';
import Notification from '../models/notifications.js';
import NotificationDto from '../dtos/notification-dto.js';
import User from '../models/user.js';
import { Op, Sequelize } from 'sequelize';

const order = [
    'Превышены максимальные часы для преподавателя',
    'Превышены рекомендуемые максимальные часы для преподавателя',
    'Нужно увеличить нагрузку для преподавателя'
];

function getPosition(message) {
    return order.indexOf(message);
  }

export default {
    async getAllNotifications(req, res) {
        try {
            const _user = await User.findByPk(req.user, { include: Educator });
            let notifications;
            if (_user.role === 3 || _user.role === 8) {
                notifications = await Notification.findAll({
                    include: [
                        {
                            model: Educator,
                            attributes: { exclude: ['EducatorId'] },
                            where: {
                                department: _user.Educator.department,
                            },
                        },
                    ],
                });
                notifications.sort((a, b) => getPosition(a.message) - getPosition(b.message));
            } else if (_user.role === 6) {
                notifications = await Notification.findAll({
                    include: {
                        model: Educator,
                        where: {
                            department: {
                                [Sequelize.Op.in]: _user.allowedDepartments,
                            },
                        },
                        attributes: { exclude: ['EducatorId'] }, // Исключаем EducatorId из результата
                    },
                    attributes: { exclude: ['EducatorId'] }, // Исключаем EducatorId из результата
                });
                notifications.sort((a, b) => getPosition(a.message) - getPosition(b.message));
            } else if (_user.role === 4 || _user.role === 7) {
                if (!_user.institutionalAffiliation) {
                    throw new Error('Нет привязки (institutionalAffiliation) к институту у директора');
                }
                const allowedDepartments = [];

                const start = _user.institutionalAffiliation === 1 ? 0 : _user.institutionalAffiliation === 2 ? 13 : 17;
                const end = _user.institutionalAffiliation === 1 ? 12 : _user.institutionalAffiliation === 2 ? 16 : 24;

                for (let i = start; i <= end; i++) {
                    allowedDepartments.push(i);
                }
                notifications = await Notification.findAll({
                    include: {
                        model: Educator,
                        where: {
                            department: {
                                [Sequelize.Op.in]: allowedDepartments,
                            },
                        },
                        attributes: { exclude: ['EducatorId'] }, // Исключаем EducatorId из результата
                    },
                    attributes: { exclude: ['EducatorId'] }, // Исключаем EducatorId из результата
                });
                notifications.sort((a, b) => getPosition(a.message) - getPosition(b.message));
            } else {
                notifications = await Notification.findAll({
                    include: { model: Educator },
                    attributes: { exclude: ['EducatorId'] },
                });
                notifications.sort((a, b) => getPosition(a.message) - getPosition(b.message));
            }
            const notificationDtos = [];
            for (const notification of notifications) {
                if (notification.Educator !== null) {
                    notificationDtos.push(new NotificationDto(notification));
                }
            }
            // const notificationDto = Array.isArray(notifications)? notifications.map(notification => new NotificationDto(notification)) : [];

            res.json(notificationDtos);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    },
};
