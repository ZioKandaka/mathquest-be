// migrations/20250823_000004-create-problem-options.cjs
'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('problem_options', {
            problem_option_id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            problem_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: { model: 'problems', key: 'problem_id' },
                onDelete: 'CASCADE',
            },
            body: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            position: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            is_correct: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
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

        // one active correct option max per problem
        await queryInterface.addIndex(
            'problem_options',
            ['problem_id'],
            {
                name: 'problem_options_one_correct_per_problem_uk',
                unique: true,
                where: { is_correct: true, deleted_at: null },
            }
        );

        // active ordering per problem
        await queryInterface.addIndex(
            'problem_options',
            ['problem_id', 'position'],
            {
                name: 'problem_options_problem_position_active_uk',
                unique: true,
                where: { deleted_at: null },
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.removeIndex('problem_options', 'problem_options_one_correct_per_problem_uk');
        await queryInterface.removeIndex('problem_options', 'problem_options_problem_position_active_uk');
        await queryInterface.dropTable('problem_options');
    },
};
