'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
            user_id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            display_name: {
                type: Sequelize.STRING(255),
            },
            email: {
                type: Sequelize.STRING(255),
                unique: true,
            },
            password: {
                type: Sequelize.STRING(),
                allowNull: false,
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

        await queryInterface.addIndex('users', ['email'], {
            name: 'users_email_idx',
            where: { deleted_at: null }
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable('users');
    },
};
