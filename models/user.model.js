export default (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        user_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        display_name: {
            type: DataTypes.STRING(255)
        },
        email: {
            type: DataTypes.STRING(255),
            unique: true
        },
        password: {
            type: DataTypes.STRING(),
            allowNull: false
        },
        created_by: {
            type: DataTypes.STRING
        },
        updated_by: {
            type: DataTypes.STRING
        },
        deleted_by: {
            type: DataTypes.STRING
        },
    }, { tableName: 'users' });

    User.associate = (models) => {
        models.User.hasMany(models.Submission, { foreignKey: 'user_id' });
        models.User.hasMany(models.UserProgress, { foreignKey: 'user_id' });
        models.User.hasMany(models.UserStats, { foreignKey: 'user_id' });
        models.User.hasMany(models.XpLedger, { foreignKey: 'user_id' });
    };

    return User;
};