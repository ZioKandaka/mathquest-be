// migrations/20250823_000003-create-problems.cjs
'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('problems', {
            problem_id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            lesson_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: { model: 'lessons', key: 'lesson_id' },
                onDelete: 'CASCADE',
            },
            type: {
                type: Sequelize.ENUM('multiple_choice', 'input'),
                allowNull: false,
            },
            prompt: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            position: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            xp_value: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 10,
            },
            explanation: {
                type: Sequelize.TEXT,
            },
            correct_input_value: {
                type: Sequelize.TEXT,
                allowNull: true,
            },

            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW'),
            },
            created_by: { type: Sequelize.STRING },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW'),
            },
            updated_by: { type: Sequelize.STRING },
            deleted_at: { type: Sequelize.DATE },
            deleted_by: { type: Sequelize.STRING },
        });

        await queryInterface.addIndex(
            'problems',
            ['lesson_id', 'position'],
            {
                name: 'problems_lesson_position_active_uk',
                unique: true,
                where: { deleted_at: null },
            }
        );

        await queryInterface.sequelize.query(`
      ALTER TABLE problems
      ADD CONSTRAINT problems_answer_mode_ck
      CHECK (
        (type = 'multiple_choice' AND correct_input_value IS NULL)
        OR
        (type = 'input' AND correct_input_value IS NOT NULL)
      );
    `);
    },

    async down(queryInterface) {
        await queryInterface.sequelize.query('ALTER TABLE problems DROP CONSTRAINT IF EXISTS problems_answer_mode_ck;');
        await queryInterface.dropTable('problems');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_problems_type";');
    },
};
