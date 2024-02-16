import Workload from '../models/workload.js';
import SummaryWorkload from '../models/summary-workload.js';

//Устанавливаем итоговые часы
async function setHours(workload) {
    const summaryWorkload = await SummaryWorkload.findOne({ where: { educatorId: workload.educatorId } });
    const educatorHours = await Workload.findAll({
        where: {
            educatorId: workload.educatorId,
        },
        attributes: ['isOID', 'period', 'hours'],
    });

    console.log('Start')
    const hours = {
        kafedralAutumnWorkload: 0,
        kafedralSpringWorkload: 0,
        kafedralAdditionalWorkload: 0,
        instituteAutumnWorkload: 0,
        instituteSpringWorkload: 0,
        instituteManagementWorkload: 0,
        totalKafedralHours: 0,
        totalOIDHours: 0,
        totalHours: 0,
    };
    console.log(hours);
    //Проверяем предмет на общеинститутский ли он и период и устанавливаем часы для кафедральных или институтских дисциплин
    for (const x of educatorHours) {
        if (x.isOID === false && x.period === 1) hours.kafedralAutumnWorkload += x.hours;
        if (x.isOID === false && x.period === 2) hours.kafedralSpringWorkload += x.hours;
        if (x.isOID === false && !x.period) hours.kafedralAdditionalWorkload += x.hours;
        if (x.isOID === true && x.period === 1) hours.instituteAutumnWorkload += x.hours;
        if (x.isOID === true && x.period === 2) hours.instituteSpringWorkload += x.hours;
        if (x.isOID === true && !x.period) hours.instituteManagementWorkload += x.hours;
    }

    console.log(hours.instituteAutumnWorkload, hours.instituteManagementWorkload)

    //Итоговые часы для кафедральных, общеинститутских предметов и общей нагрузки
    hours.totalKafedralHours =
        hours.kafedralAutumnWorkload + hours.kafedralSpringWorkload + hours.kafedralAdditionalWorkload;
    hours.totalOIDHours =
        hours.instituteAutumnWorkload + hours.instituteSpringWorkload + hours.instituteManagementWorkload;
    hours.totalHours = hours.totalKafedralHours + hours.totalOIDHours;


    console.log(hours.totalKafedralHours, hours.totalOIDHours, hours.totalHours)
    //TODO: Нужно доделать правильное обновление часов, при нагрузке >1
    //Заполняем бд этими данными
    summaryWorkload.set('totalKafedralHours', hours.totalKafedralHours);
    summaryWorkload.set('totalOIDHours', hours.totalOIDHours);
    summaryWorkload.set('totalHours', hours.totalHours);
    summaryWorkload.set('kafedralAutumnWorkload', hours.kafedralAutumnWorkload);
    summaryWorkload.set('kafedralSpringWorkload', hours.kafedralSpringWorkload);
    summaryWorkload.set('kafedralAdditionalWorkload', hours.kafedralAdditionalWorkload);
    summaryWorkload.set('instituteAutumnWorkload', hours.instituteAutumnWorkload);
    summaryWorkload.set('instituteSpringWorkload', hours.instituteSpringWorkload);
    summaryWorkload.set('instituteManagementWorkload', hours.instituteManagementWorkload);

    await summaryWorkload.save();
}

export default setHours;
