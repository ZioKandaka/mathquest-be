'use strict';

module.exports = {
    async up(queryInterface) {
        console.log(`Start seeding 20250823_000001-user.cjs`);

        const now = new Date();
        await queryInterface.bulkInsert('users', [{
            display_name: 'Student',
            email: 'student@mathquest.com',
            password: 'this should be hashed',
            created_at: now,
            updated_at: now,
            created_by: 'system@mathquest.com',
            updated_by: 'system@mathquest.com',
        }]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('users', { email: 'student@mathquest.com' });
    }
};
