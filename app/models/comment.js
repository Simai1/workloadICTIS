import { DataTypes, Model } from 'sequelize';

export default class Comment extends Model {
    static initialize(sequelize) {
        Comment.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    allowNull: false,
                    primaryKey: true,
                },
                text: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                educatorId: {
                    type: DataTypes.UUID,
                    allowNull: false,
                },
                workloadId: {
                    type: DataTypes.UUID,
                    allowNull: false,
                },
                isChecked: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
            },
            {
                sequelize,
                schema: 'public',
                modelName: 'Comment',
                tableName: 'comments',
                paranoid: true,
            }
        );
    }
}
