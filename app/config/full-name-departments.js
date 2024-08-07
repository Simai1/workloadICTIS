import { mapObjectKeys } from "../utils/map.js";

const FullNameDepartments = {
    // ИКТИБ
    "Институт компьютерных технологий и информационной безопасности": 0,
    "Кафедра безопасности информационных технологий": 1,
    //2 Кафедра информационных измерительных технологий и систем
    "Кафедра информационных измерительных технологий и систем": 2,
    "Кафедра вычислительной техники": 3,
    "Кафедра информационно-аналитических систем безопасности": 4,
    "Кафедра информационной безопасности телекоммуникационных систем": 5,
    "Кафедра интеллектуальных и многопроцессорных систем": 6,
    "Кафедра математического обеспечения и применения ЭВМ": 7,
    "Кафедра психологии и безопасности жизнедеятельности": 8,
    "Кафедра системного анализа и телекоммуникаций": 9,
    "Кафедра систем автоматизированного проектирования": 10,
    "Кафедра синергетики и процессов управления": 11,
    "Кафедра физико-математических основ инженерного образования": 12,
    // ИНЕП
    "Кафедра нанотехнологий и микросистемной техники": 13,
    "Кафедра радиотехнической электроники и наноэлектроники" : 14,

    "Кафедра техносферной безопасности и химии": 15,
    "Кафедра электрогидроакустической и медицинской техники": 16,
    // ИРТСУ
    "Кафедра антенн и радиопередающих устройств" : 17 ,
    "Кафедра теоретических основ радиотехники" : 18,
    "Кафедра радиотехнических и телекоммуникационных систем" : 19,
    "Кафедра встраиваемых и радиоприемных систем" : 20,
    "Кафедра летательных аппаратов" : 21,
    "Кафедра инженерной графики и компьютерного дизайна" : 22,
    "Кафедра систем автоматического управления": 23,
    "Кафедра электротехники и мехатроники" : 24,
    // Дирекция лучших людей
    "Дирекция": 99,
};

export default FullNameDepartments;

export const map = mapObjectKeys(FullNameDepartments);