'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('lessons', {
            lesson_id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            title: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
            },
            position: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            is_published: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
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

        await queryInterface.addIndex('lessons', ['is_published', 'position'], {
            name: 'lessons_is_published_position_idx',
            where: { deleted_at: null }
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable('lessons');
    },
};
