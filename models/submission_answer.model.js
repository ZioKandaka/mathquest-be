export default (sequelize, DataTypes) => {
    const SubmissionAnswer = sequelize.define('SubmissionAnswer', {
        submission_answer_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        submission_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        problem_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        selected_option_id: {
            type: DataTypes.BIGINT
        },
        input_value: {
            type: DataTypes.STRING
        },
        is_correct: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        awarded_xp: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
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
    }, { tableName: 'submission_answers' });
    return SubmissionAnswer;
};