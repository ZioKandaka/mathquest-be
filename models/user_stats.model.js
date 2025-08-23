export default (sequelize, DataTypes) => {
    const UserStats = sequelize.define('UserStats', {
        user_stat_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            unique: true,
            references: { model: 'users', key: 'user_id' },
            onDelete: 'CASCADE',
        },
        total_xp: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        current_streak: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        best_streak: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        last_active_utc_date: {
            type: DataTypes.DATEONLY
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
    }, { tableName: 'user_stats' });
    return UserStats;
};