import EducatorForWorkload from "../models/educator-for-workload.js";

export default class WorkloadDto {
    id;
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
    numberOfStudents;
    hours;
    audienceHours;
    ratingControlHours;
    comment;
    educator;

    constructor(model) {
        this.id = model.id;
        this.department = model.department;
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
        this.numberOfStudents = model.numberOfStudents;
        this.hours = model.hours;
        this.audienceHours = model.audienceHours;
        this.ratingControlHours = model.ratingControlHours;
        this.comment = model.comment;
        // this.educator = model.EducatorForWorkloads[0].Educator.id;
        this.educator = model.EducatorForWorkloads;
    }
}
