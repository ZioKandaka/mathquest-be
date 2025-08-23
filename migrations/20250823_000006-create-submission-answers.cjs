'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('submission_answers', {
            submission_answer_id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            submission_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: { model: 'submissions', key: 'submission_id' },
                onDelete: 'CASCADE',
            },
            problem_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: { model: 'problems', key: 'problem_id' },
            },
            selected_option_id: {
                type: Sequelize.BIGINT,
                allowNull: true,
                references: { model: 'problem_options', key: 'problem_option_id' },
            },
            input_value: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            is_correct: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            awarded_xp: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },

            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW'),
            },
            created_by: {
                type: Sequelize.BIGINT,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW'),
            },
            updated_by: {
                type: Sequelize.BIGINT,
            },
            deleted_at: {
                type: Sequelize.DATE,
            },
            deleted_by: {
                type: Sequelize.BIGINT,
            },
        });

        await queryInterface.addConstraint('submission_answers', {
            fields: ['submission_id', 'problem_id'],
            type: 'unique',
            name: 'submission_answers_submission_id_problem_id_uk',
            where: { deleted_at: null }
        });

        // XOR shape: exactly one of selected_option_id or input_value
        await queryInterface.sequelize.query(`
            ALTER TABLE submission_answers
            ADD CONSTRAINT submission_answers_shape_ck
            CHECK (
                (selected_option_id IS NOT NULL AND input_value IS NULL)
                OR
                (selected_option_id IS NULL AND input_value IS NOT NULL)
            );
        `);
    },
    
    async down(queryInterface) {
        await queryInterface.sequelize.query('ALTER TABLE submission_answers DROP CONSTRAINT IF EXISTS submission_answers_shape_ck;');
        await queryInterface.removeConstraint('submission_answers', 'submission_answers_submission_id_problem_id_uk');
        await queryInterface.dropTable('submission_answers');
    },
};
