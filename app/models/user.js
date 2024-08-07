import { DataTypes, Model, SMALLINT } from 'sequelize';
import EnumRoles from '../config/roles.js';
import EnumInstitutionalAffiliation from '../config/institutional-affiliations.js';
import associateEducator from '../utils/associate-educator.js';
import associateInstAffiliation from '../utils/associate-inst-affilation.js';

export default class User extends Model {
    static initialize(sequelize) {
        User.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    allowNull: false,
                    primaryKey: true,
                },
                login: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: 'login',
                    validate: { isEmail: { msg: 'Must be a valid email address' } },
                },
                role: {
                    type: DataTypes.SMALLINT,
                    allowNull: false,
                    validate: {
                        isIn: [Object.values(EnumRoles)],
                    },
                    defaultValue: EnumRoles.LECTURER,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                allowedDepartments: {
                    type: DataTypes.ARRAY(SMALLINT),
                    defaultValue: [],
                },
                institutionalAffiliation: {
                    type: DataTypes.SMALLINT,
                    allowNull: false,
                    defaultValue: 1,
                    validate: {
                        isIn: [Object.values(EnumInstitutionalAffiliation)],
                    },
                },
            },
            {
                sequelize,
                schema: 'public',
                modelName: 'User',
                tableName: 'users',
                paranoid: true,
            }
        );
        User.afterCreate(async user => {
            await associateEducator(user);
        });
        User.afterCreate(async user => {
            associateInstAffiliation(user);
        });
    }
}

