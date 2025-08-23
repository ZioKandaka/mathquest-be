export default (sequelize, DataTypes) => {
    const UserProgress = sequelize.define('UserProgress', {
        user_progress_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        lesson_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        problems_total: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        best_correct_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        progress_fraction: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: 0
        },
        completed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        last_submitted_at: {
            type: DataTypes.DATE
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
    }, { tableName: 'user_progress' });
    return UserProgress;
};