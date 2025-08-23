export default (sequelize, DataTypes) => {
    const Lesson = sequelize.define('Lesson', {
        lesson_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        position: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        is_published: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
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
    }, { tableName: 'lessons' });


    Lesson.associate = (models) => {
        models.Lesson.hasMany(models.Problem, { foreignKey: 'lesson_id' });
    };


    return Lesson;
};