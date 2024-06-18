import { mapObjectKeys } from "../utils/map.js";

const FullNameDepartments = {
    "Институт компьютерных технологий и информационной безопасности": 0,
    "Кафедра безопасности информационных технологий": 1,
    //2 кафедра измерительных технологий и систем
    "Кафедра высшей математики": 2,
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
};

export default FullNameDepartments;

export const map = mapObjectKeys(FullNameDepartments);