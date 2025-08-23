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

        await queryInterface.addConstraint('problem_options', {
            fields: ['problem_id', 'position'],
            type: 'unique',
            name: 'problem_options_problem_position_uk',
            where: { deleted_at: null }
        });

        // Add FK now that options table exists
        await queryInterface.sequelize.query(`
            ALTER TABLE problems
            ADD CONSTRAINT problems_correct_option_fk
            FOREIGN KEY (correct_option_id) REFERENCES problem_options(problem_option_id)
            ON DELETE SET NULL;
        `);
    },
    async down(queryInterface) {
        await queryInterface.sequelize.query('ALTER TABLE problems DROP CONSTRAINT IF EXISTS problems_correct_option_fk;');
        await queryInterface.removeConstraint('problem_options', 'problem_options_problem_position_uk');
        await queryInterface.dropTable('problem_options');
    },
};
