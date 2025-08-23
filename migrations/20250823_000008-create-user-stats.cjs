'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('user_stats', {
            user_stat_id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
            },
            user_id: {
                type: Sequelize.BIGINT,
                unique: true,
                references: { model: 'users', key: 'user_id' },
                onDelete: 'CASCADE',
            },
            total_xp: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            current_streak: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            best_streak: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            last_active_utc_date: {
                type: Sequelize.DATEONLY,
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

        await queryInterface.addIndex(
            'user_stats',
            ['user_id'],
            {
                name: 'user_stats_user_id_idx',
                unique: true,
                where: { deleted_at: null }
            }
        );
    },
    async down(queryInterface) {
        await queryInterface.dropTable('user_stats');
    },
};
