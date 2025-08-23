// models/problem_option.js (ESM)
export default (sequelize, DataTypes) => {
    const ProblemOption = sequelize.define(
        'ProblemOption',
        {
            problem_option_id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            problem_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },
            body: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            position: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            is_correct: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            created_by: { type: DataTypes.STRING },
            updated_by: { type: DataTypes.STRING },
            deleted_by: { type: DataTypes.STRING },
        },
        { tableName: 'problem_options' }
    );

    ProblemOption.associate = (models) => {
        models.ProblemOption.belongsTo(models.Problem, { foreignKey: 'problem_id' });
    };

    return ProblemOption;
};
