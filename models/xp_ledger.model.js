export default (sequelize, DataTypes) => {
    const XpLedger = sequelize.define('XpLedger', {
        xp_ledger_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        source_type: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        source_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        amount: {
            type: DataTypes.INTEGER,
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
    }, { tableName: 'xp_ledger' });
    return XpLedger;
};