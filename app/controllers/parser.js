import XLSX from 'xlsx';
import Educator from '../models/educator.js';
import Workload from '../models/workload.js';
import FullNameDepartments from '../config/full-name-departments.js';
import HeaderTranslation from '../config/header_translation.js';
import HeaderTranslationEducators from '../config/header_translation_educators.js';
import positions from '../config/position.js';
import sendMail from '../services/email.js';
import fs from 'fs';
import User from '../models/user.js';
import { Op } from 'sequelize';
import History from '../models/history.js';
import EnumTypeOfEmployment from '../config/type-of-employment.js';

export default {
    async parseWorkload(req, res) {
        const numberDepartment = req.params.numberDepartment;
        console.log(req.file.path);
        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
            header: 1,
            defval: '',
            blankrows: true,
        });
        const headers = sheetData[0];
        const checkDepart = {};
        const checkRow = sheetData[1];
        headers.forEach((header, index) => {
            const englishHeader = HeaderTranslation[header];
            checkDepart[englishHeader] = checkRow[index];
        });
        checkDepart.department = checkDepart.department.trim();
        checkDepart.department = FullNameDepartments[checkDepart.department];
        if (checkDepart.department !== Number(numberDepartment)) {
            throw new Error('Загруженная нагрузка не совпадает с кафедрой, которую вы отправили');
        }

        const recordsToDelete = await Workload.findAll({
            where: {
                department: numberDepartment,
            },
        });

        for (const record of recordsToDelete) {
            await Workload.destroy({
                where: {
                    id: record.id,
                },
                individualHooks: true,
            });
        }

        const isOid = Number(numberDepartment) === 0;
        console.log('Total rows after slice:', sheetData.slice(1).length);
        for (const row of sheetData.slice(1, sheetData.length - 1)) {
            try {
                const obj = {};
                headers.forEach((header, index) => {
                    const englishHeader = HeaderTranslation[header];
                    obj[englishHeader] = row[index];
                });
                let typeOfEmployment = obj.typeOfEmployment.trim();
                obj.department = obj.department.trim();
                obj.educator = obj.educator.trim();
                obj.department = FullNameDepartments[obj.department];
                obj.numberOfStudents = obj.numberOfStudents ? Number(obj.numberOfStudents.replace(',00', '')) : 0;
                obj.hours = obj.hours ? parseFloat(obj.hours.replace(',', '.')) : 0.0;
                obj.audienceHours = obj.audienceHours ? parseFloat(obj.audienceHours.replace(',', '.')) : 0.0;
                const ratingControlHours = obj.hours - obj.audienceHours;
                obj.ratingControlHours = parseFloat(ratingControlHours.toFixed(2));
                obj.period = Number(obj.period);
                let existEducator;
                let resEducator;
                existEducator = await Educator.findOne({
                    where: {
                        name: obj.educator,
                        typeOfEmployment: { [Op.between]: [1, 3] }
                    },
                });

                let educatorId = existEducator ? existEducator.id : null;

                if(typeOfEmployment === 'На условиях почасовой оплаты труда'){
                    existEducator = await Educator.findOne({
                        where: {
                            name: obj.educator,
                            typeOfEmployment: 4,
                        },
                    });
                    if(existEducator === null){
                        existEducator = await Educator.findOne({
                            where: {
                                name: obj.educator,
                                typeOfEmployment: { [Op.between]: [1, 3] }
                            },
                        });
                        if(existEducator !== null){
                            resEducator = await Educator.create({
                                name: existEducator.name,
                                department: existEducator.department,
                                position: existEducator.position,
                                rate: existEducator.rate,
                                typeOfEmployment: 4,
                            });
                        }  else {
                            resEducator = await Educator.create({
                                name: obj.educator,
                                department:  obj.department,
                                position: positions[obj.position],
                                rate: 0,
                                typeOfEmployment: 4,
                            });
                            console.log("resEducator", resEducator)
                        }
                        educatorId = resEducator.id;
                    } else educatorId = existEducator.id;
                } 

                const isSplit = false;
                delete obj.educator;
                delete obj.undefined;
                delete obj.typeOfEmployment;
                await Workload.create(
                    {
                        ...obj,
                        educatorId,
                        isSplit,
                        isOid,
                    },
                    { individualHooks: true }
                );
            } catch (e) {
                console.log(e);
            }
        }

        try {
            fs.unlinkSync(req.file.path); // Синхронное удаление файла
            console.log('Файл успешно удален.');
        } catch (error) {
            console.error('Ошибка при удалении файла:', error);
        }

        if (process.env.NODE_ENV === 'production') {
            const recievers = await User.findAll({
                where: {
                    role: { [Op.in]: [3, 8] },
                },
                include: [
                    {
                        model: Educator,
                        where: {
                            department: numberDepartment,
                        },
                    },
                ],
            });
            for (const reciever of recievers) {
                sendMail(reciever.login, 'uploadedNewWorkload');
            }
        } else {
            sendMail(process.env.EMAIL_RECIEVER, 'uploadedNewWorkload');
        }

        await History.destroy({
            where: { department: numberDepartment },
            force: true,
        });

        await Workload.destroy({
            where: {
                department: numberDepartment,
                deletedAt: { [Op.ne]: null },
            },
            paranoid: false,
            force: true,
        });

        return res.json({ status: 'ok' });
    },

    async parseEducators(req, res) {
        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
            header: 1,
            defval: '',
            blankrows: true,
        });
        const headers = sheetData[0];
        // Только ассистенты, доценты, профессоры, зав кафедрой, директор, и научные сотрудники + старший преподаватель старший научный сотрудник
        const validPositions = [
            'Ассистент',
            'Доцент',
            'Ведущий научный сотрудник',
            'Главный научный сотрудник',
            'Научный сотрудник',
            'Старший преподаватель',
            'Профессор',
            'Старший научный сотрудник',
            'Заведующий кафедрой',
            'Директор',
            'Научный сотрудник',
            'Директор института',
        ];
        console.log(sheetData.length);
        for (const row of sheetData.slice(1)) {
            try {
                const newEducator = {};
                headers.forEach((header, index) => {
                    const englishHeader = HeaderTranslationEducators[header];
                    newEducator[englishHeader] = row[index];
                });
                const existEducator = await Educator.findOne({ where: { email: newEducator.email } });
                newEducator.department = FullNameDepartments[newEducator.department];
                console.log(newEducator);
                if (!existEducator && validPositions.includes(newEducator.position) && newEducator.department) {
                    delete newEducator.undefined;
                    newEducator.position = positions[newEducator.position];
                    const newRate = newEducator.rate.trim().split(' ');
                    let numberPart = parseFloat(newRate[0].replace(',', '.'));
                    if (!Number(numberPart) || Number(numberPart) < 0.1) {
                        numberPart = 1;
                    }
                    newEducator.rate = numberPart;
                    console.log(newEducator);
                    const resEducator = await Educator.create({
                        name: newEducator.name,
                        email: newEducator.email,
                        department: newEducator.department,
                        position: newEducator.position,
                        rate: newEducator.rate,
                    });
                    console.log('resEducator', resEducator.dataValues);
                }
            } catch (e) {
                // Обработка ошибок
            }
        }

        try {
            fs.unlinkSync(req.file.path); // Синхронное удаление файла
            console.log('Файл успешно удален.');
        } catch (error) {
            console.error('Ошибка при удалении файла:', error);
        }

        return res.json({ status: 'ok' });
    },
};
