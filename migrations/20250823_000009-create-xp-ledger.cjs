'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('xp_ledger', {
            xp_ledger_id: {
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
            source_type: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            source_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
            },
            amount: {
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

        await queryInterface.addConstraint('xp_ledger', {
            fields: ['source_type', 'source_id'],
            type: 'unique',
            name: 'xp_ledger_source_uk',
        });

        await queryInterface.addIndex(
            'xp_ledger',
            ['user_id'],
            {
                name: 'xp_ledger_user_id',
                where: { deleted_at: null }
            }
        );
    },
    async down(queryInterface) {
        await queryInterface.removeConstraint('xp_ledger', 'xp_ledger_source_uk');
        await queryInterface.dropTable('xp_ledger');
    },
};
