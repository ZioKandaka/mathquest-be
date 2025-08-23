'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('submissions', {
            submission_id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            attempt_id: {
                type: Sequelize.UUID,
                allowNull: false,
                unique: true,
            },
            user_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: { model: 'users', key: 'user_id' },
            },
            lesson_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: { model: 'lessons', key: 'lesson_id' },
            },
            submitted_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW'),
            },
            activity_utc_date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            correct_count: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            earned_xp: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            answers_fingerprint: {
                type: Sequelize.TEXT,
            },
            processing_version: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1,
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

        await queryInterface.addIndex(
            'submissions',
            ['user_id', 'lesson_id', 'submitted_at'],
            {
                name: 'submissions_user_id_lesson_id_submitted_active_idx',
                where: {
                    deleted_at: null
                }
            }
        );

        await queryInterface.addIndex(
            'submissions',
            ['user_id', 'activity_utc_date'],
            {
                name: 'submissions_user_Id_date_active_idx',
                where: {
                    deleted_at: null
                }
            }
        );

    },
    async down(queryInterface) {
        await queryInterface.dropTable('submissions');
    },
};
