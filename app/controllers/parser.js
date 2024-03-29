import XLSX from "xlsx";
import Educator from "../models/educator.js";
import {DataTypes} from "sequelize";
import EnumDepartments from "../config/departments.js";
import {AppErrorNotExist} from "../utils/errors.js";
import Workload from "../models/workload.js";
import FullNameDepartments from "../config/full-name-departments.js"

export default {
    //departmen
    //
    async parseFromXlsx(fileLocation, res){
        let workbook = XLSX.readFile(fileLocation);
        const workload = [];

        Object.keys(workbook.Sheets).forEach((name) => {
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[name], {header: 1});
            workload.push({ name, data: sheetData });
        });

        const dataWorkload = workload[0].data;
        for (const element of dataWorkload) {
            const id = element[0];
            if(Number(id)) {
                console.log(id)
                try {
                    let department = element[1];
                    const discipline = element[2] ?? '-';
                    const workload = element[3];
                    const groups = element[4];
                    const block = element[5] ?? '-';
                    const semester = element[6] ?? '-';
                    const period = element[7] ?? 0;
                    const curriculum = element[8] ?? '-';
                    const curriculumUnit = element[9] ?? '-';
                    const formOfEducation = element[11] ?? '-';
                    const levelOfTraining = element[12] ?? '-';
                    const specialty = element[13] ?? '-';
                    const core = element[14] ?? '-';
                    const numberOfStudents = element[16] ? Number(element[16].replace(',00','')) : 0;
                    const hours = parseFloat(element[17].replace(',','.'));
                    const audienceHours = element[18] ? parseFloat(element[18].replace(',','.')): 0.00;
                    const ratingControlHours = hours - audienceHours;
                    const nameEducator = element[21] ?? '-';
                    const isSplit = false;
                    console.log(nameEducator)
                    department = FullNameDepartments[department];

                    const existEducator = await Educator.findOne({
                        where: {
                            name: nameEducator,
                        }
                    });
                    const educatorId = existEducator ? existEducator.id : null;

                    const newWorkload = await Workload.create({
                        discipline,
                        department,
                        workload,
                        groups,
                        block,
                        semester,
                        period,
                        curriculum,
                        curriculumUnit,
                        formOfEducation,
                        levelOfTraining,
                        specialty,
                        core,
                        numberOfStudents,
                        hours,
                        audienceHours,
                        ratingControlHours,
                        isSplit,
                        educatorId,
                    })

                } catch (e) {
                    console.log(e)
                    return res.status(400).json({status: "error", message: e.message});
                }

            }
            else console.log(id);
        }

        return res.json({status: "ok"});
    }
}
