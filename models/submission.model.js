export default (sequelize, DataTypes) => {
    const Submission = sequelize.define('Submission', {
        submission_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        attempt_id: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        lesson_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        submitted_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        activity_utc_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        correct_count: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        earned_xp: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        answers_fingerprint: {
            type: DataTypes.TEXT
        },
        processing_version: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
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
    }, { tableName: 'submissions' });

    Submission.associate = (models) => {
        models.Submission.belongsTo(models.User, { foreignKey: 'user_id' });
        models.Submission.belongsTo(models.Lesson, { foreignKey: 'lesson_id' });
        models.Submission.hasMany(models.SubmissionAnswer, { foreignKey: 'submission_id' });
    };

    return Submission;
};