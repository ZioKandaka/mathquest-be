export default (sequelize, DataTypes) => {
    const Problem = sequelize.define('Problem', {
        problem_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        lesson_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('multiple_choice', 'input'),
            allowNull: false
        },
        prompt: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        position: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        xp_value: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 10
        },
        explanation: {
            type: DataTypes.TEXT
        },
        correct_option_id: {
            type: DataTypes.BIGINT
        },
        correct_input_value: {
            type: DataTypes.STRING
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
    }, { tableName: 'problems' });


    Problem.associate = (models) => {
        models.Problem.belongsTo(models.Lesson, { foreignKey: 'lesson_id' });
        models.Problem.hasMany(models.ProblemOption, { foreignKey: 'problem_id' });
    };


    return Problem;
};