import { DataTypes, Model } from 'sequelize';
import EnumTypes from '../config/position.js';
import EnumTypeOfEmployment from '../config/type-of-employment.js';
import EnumDepartment from '../config/departments.js';
import { setHours } from '../utils/educators-hours.js';
import createSummaryWorkload from '../utils/create-summary-workload.js';

export default class Educator extends Model {
    static initialize(sequelize) {
         Educator.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    allowNull: false,
                    primaryKey: true,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                userId: {
                  type: DataTypes.UUID,
                  allowNull: true,
                },
                position: {
                    type: DataTypes.SMALLINT,
                    allowNull: false,
                    validate: {
                        isIn: [Object.values(EnumTypes)],
                    },
                },
                typeOfEmployment: {
                    type: DataTypes.SMALLINT,
                    allowNull: false,
                    validate: {
                        isIn: [Object.values(EnumTypeOfEmployment)],
                    },
                },
                rate: {
                    type: DataTypes.REAL,
                    allowNull: false,
                },
                maxHours: {
                    type: DataTypes.REAL,
                    allowNull: false,
                    defaultValue: 0,
                    validate: {
                        isNumeric: true,
                    }
                },
                recommendedMaxHours: {
                    type: DataTypes.REAL,
                    allowNull: false,
                    defaultValue: 0,
                    validate: {
                        isNumeric: true,
                    }
                },
                minHours: {
                    type: DataTypes.REAL,
                    allowNull: false,
                    defaultValue: 0,
                    validate: {
                        isNumeric: true,
                    }
                },
                department: {
                    type: DataTypes.SMALLINT,
                    allowNull: false,
                    validate: {
                        isIn: [Object.values(EnumDepartment)],
                    },
                },
            },
            {
                sequelize,
                schema: 'public',
                modelName: 'Educator',
                tableName: 'educators',
                paranoid: true,
            }
        );
        Educator.beforeCreate(async educator => {
            setHours(educator);
            await createSummaryWorkload(educator.id);
        });
        Educator.beforeUpdate(educator => {
            setHours(educator);
        });
    }
}
