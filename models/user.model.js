export default (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        user_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        display_name: {
            type: DataTypes.TEXT
        },
        email: {
            type: DataTypes.TEXT,
            unique: true
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
    return User;
};