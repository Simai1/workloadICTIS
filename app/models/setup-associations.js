import { models } from './index.js';
import Notification from './notifications.js';
import SummaryWorkload from './summary-workload.js';

const { Educator, Workload, User, TokenSchema, Comment, Offers } = models;

export default function () {
    Educator.hasMany(Workload);
    Workload.belongsTo(Educator, { constraints: false });

    Educator.hasOne(SummaryWorkload);
    SummaryWorkload.belongsTo(Educator);

    User.hasOne(TokenSchema, { foreignKey: 'userId' });
    TokenSchema.belongsTo(User, { foreignKey: 'userId' });

    User.hasOne(Educator, { foreignKey: 'userId' });
    Educator.belongsTo(User, { foreignKey: 'userId' });

    Educator.hasMany(Notification);
    Notification.belongsTo(Educator);

    Workload.hasMany(Comment);
    Comment.belongsTo(Workload);

    Educator.hasMany(Comment);
    Comment.belongsTo(Educator);

    Educator.hasOne(Offers);
    Offers.belongsTo(Educator);
}
