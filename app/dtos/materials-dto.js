import EducatorDto from './educator-dto.js';
import { map as departmentsMap } from '../config/departments.js';

export default class MaterialsDto {
    department;
    discipline;
    workload;
    groups;
    block;
    semester;
    period;
    curriculum;
    curriculumUnit;
    formOfEducation;
    levelOfTraining;
    specialty;
    core;
    hours;
    audienceHours;
    ratingControlHours;
    isActual;
    educator;

    constructor(model) {
        this.department = departmentsMap[model.department];
        this.discipline = model.discipline;
        this.workload = model.workload;
        this.groups = model.groups;
        this.block = model.block;
        this.semester = model.semester;
        this.period = model.period;
        this.curriculum = model.curriculum;
        this.curriculumUnit = model.curriculumUnit;
        this.formOfEducation = model.formOfEducation;
        this.levelOfTraining = model.levelOfTraining;
        this.specialty = model.specialty;
        this.core = model.core;
        this.hours = model.hours;
        this.audienceHours = model.audienceHours;
        this.ratingControlHours = model.ratingControlHours;
        this.isActual = model.isActual;
        this.educator = model.Educator ? new EducatorDto(model.Educator) : null;
    }
}
