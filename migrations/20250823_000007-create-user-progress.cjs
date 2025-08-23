'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('user_progress', {
            user_progress_id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: { model: 'users', key: 'user_id' },
                onDelete: 'CASCADE',
            },
            lesson_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: { model: 'lessons', key: 'lesson_id' },
                onDelete: 'CASCADE',
            },
            problems_total: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            best_correct_count: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            progress_fraction: {
                type: Sequelize.DECIMAL,
                allowNull: false,
                defaultValue: 0,
            },
            completed: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            last_submitted_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },

            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW'),
            },
            created_by: {
                type: Sequelize.STRING,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW'),
            },
            updated_by: {
                type: Sequelize.STRING,
            },
            deleted_at: {
                type: Sequelize.DATE,
            },
            deleted_by: {
                type: Sequelize.STRING,
            },
        });

        await queryInterface.addIndex('user_progress', ['user_id', 'completed'], {
            name: 'user_progress_user_id_completed_idx',
            where: { deleted_at: null }
        });
        await queryInterface.addIndex('user_progress', ['user_id', 'lesson_id'], {
            name: 'user_progress_user_id_lesson_id_idx',
            where: { deleted_at: null }
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable('user_progress');
    },
};
