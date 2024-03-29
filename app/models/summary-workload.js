import { DataTypes, Model } from 'sequelize';

export default class SummaryWorkload extends Model {
    static initialize(sequelize) {
        SummaryWorkload.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    allowNull: false,
                    primaryKey: true,
                },
                totalKafedralHours: {
                    type: DataTypes.REAL,
                    allowNull: false,
                    defaultValue: 0,
                },
                totalOidHours: {
                    type: DataTypes.REAL,
                    allowNull: false,
                    defaultValue: 0,
                },
                totalHours: {
                    type: DataTypes.REAL,
                    allowNull: false,
                    defaultValue: 0,
                },
                educatorId: {
                    type: DataTypes.UUID,
                    allowNull: false,
                },
                kafedralAutumnWorkload: {
                    type: DataTypes.REAL,
                    allowNull: true,
                    defaultValue: 0,
                },
                kafedralSpringWorkload: {
                    type: DataTypes.REAL,
                    allowNull: true,
                    defaultValue: 0,
                },
                kafedralAdditionalWorkload: {
                    type: DataTypes.REAL,
                    allowNull: true,
                    defaultValue: 0,
                },
                instituteAutumnWorkload: {
                    type: DataTypes.REAL,
                    allowNull: true,
                    defaultValue: 0,
                },
                instituteSpringWorkload: {
                    type: DataTypes.REAL,
                    allowNull: true,
                    defaultValue: 0,
                },
                instituteManagementWorkload: {
                    type: DataTypes.REAL,
                    allowNull: true,
                    defaultValue: 0,
                },
            },
            {
                sequelize,
                schema: 'public',
                modelName: 'SummaryWorkload',
                tableName: 'summary-workload',
                paranoid: true,
            }
        );

        // При обновлении нагрузки просчитывать часы
    }
}
