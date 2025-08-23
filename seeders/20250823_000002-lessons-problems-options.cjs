'use strict';

const { Op } = require('sequelize');

module.exports = {
    async up(queryInterface) {
        console.log(`Start seeding 20250823_000002-lessons-problems-options.cjs`);
        const t = await queryInterface.sequelize.transaction();
        try {
            const now = new Date();

            // 1) Insert lessons and RETURN their generated IDs (Postgres)
            const lessons = await queryInterface.bulkInsert(
                'lessons',
                [
                    {
                        title: 'Basic Arithmetic',
                        description: 'Add, subtract, multiply, divide basics',
                        position: 1,
                        is_published: true,

                        created_at: now,
                        updated_at: now,
                        created_by: 'system@mathquest.com',
                        updated_by: 'system@mathquest.com',
                    },
                    {
                        title: 'Multiplication Mastery',
                        description: 'Practice times tables',
                        position: 2,
                        is_published: true,

                        created_at: now,
                        updated_at: now,
                        created_by: 'system@mathquest.com',
                        updated_by: 'system@mathquest.com',
                    },
                    {
                        title: 'Division Basics',
                        description: 'Division with integers',
                        position: 3,
                        is_published: true,

                        created_at: now,
                        updated_at: now,
                        created_by: 'system@mathquest.com',
                        updated_by: 'system@mathquest.com',
                    }
                ],
                { returning: true, transaction: t }
            );

            // 2) Problem blueprints (no hardcoded IDs)
            const blueprints = [
                // Lesson 1
                {
                    lessonId: lessons[0].lesson_id,
                    problems: [
                        { type: 'multiple_choice', prompt: '2 + 3 = ?', position: 1, explanation: '2 + 3 = 5', mc: ['4', '5', '6', '7'], correctIdx: 1 },
                        { type: 'input', prompt: '7 - 4 = ?', position: 2, explanation: '7 - 4 = 3', inputAnswer: '3' },
                        { type: 'multiple_choice', prompt: '5 + 5 = ?', position: 3, explanation: '5 + 5 = 10', mc: ['8', '9', '10', '11'], correctIdx: 2 },
                        { type: 'input', prompt: '9 ÷ 3 = ?', position: 4, explanation: '9 ÷ 3 = 3', inputAnswer: '3' },
                        { type: 'multiple_choice', prompt: '12 + 8 = ?', position: 5, explanation: '12 + 8 = 20', mc: ['18', '19', '20', '21'], correctIdx: 2 },
                    ]
                },
                // Lesson 2
                {
                    lessonId: lessons[1].lesson_id,
                    problems: [
                        { type: 'multiple_choice', prompt: '3 × 4 = ?', position: 1, explanation: '3 × 4 = 12', mc: ['11', '12', '13', '14'], correctIdx: 1 },
                        { type: 'input', prompt: '7 × 5 = ?', position: 2, explanation: '7 × 5 = 35', inputAnswer: '35' },
                        { type: 'multiple_choice', prompt: '6 × 7 = ?', position: 3, explanation: '6 × 7 = 42', mc: ['36', '42', '49', '40'], correctIdx: 1 },
                        { type: 'input', prompt: '9 × 9 = ?', position: 4, explanation: '9 × 9 = 81', inputAnswer: '81' },
                        { type: 'multiple_choice', prompt: '8 × 8 = ?', position: 5, explanation: '8 × 8 = 64', mc: ['56', '64', '72', '63'], correctIdx: 1 },
                    ]
                },
                // Lesson 3
                {
                    lessonId: lessons[2].lesson_id,
                    problems: [
                        { type: 'multiple_choice', prompt: '10 ÷ 2 = ?', position: 1, explanation: '10 ÷ 2 = 5', mc: ['4', '5', '6', '8'], correctIdx: 1 },
                        { type: 'input', prompt: '20 ÷ 5 = ?', position: 2, explanation: '20 ÷ 5 = 4', inputAnswer: '4' },
                        { type: 'multiple_choice', prompt: '9 ÷ 3 = ?', position: 3, explanation: '9 ÷ 3 = 3', mc: ['2', '3', '4', '5'], correctIdx: 1 },
                        { type: 'input', prompt: '15 ÷ 3 = ?', position: 4, explanation: '15 ÷ 3 = 5', inputAnswer: '5' },
                        { type: 'multiple_choice', prompt: '12 ÷ 4 = ?', position: 5, explanation: '12 ÷ 4 = 3', mc: ['1', '2', '3', '4'], correctIdx: 2 },
                    ]
                }
            ];

            // 3) Insert problems per lesson (return rows so we know their IDs)
            const allInsertedProblems = [];
            for (const bp of blueprints) {
                const problemsPayload = bp.problems.map(p => ({
                    lesson_id: bp.lessonId,
                    type: p.type,
                    prompt: p.prompt,
                    position: p.position,
                    xp_value: 10,
                    explanation: p.explanation,
                    correct_input_value: p.type === 'input' ? String(p.inputAnswer) : null,

                    created_at: now,
                    updated_at: now,
                    created_by: 'system@mathquest.com',
                    updated_by: 'system@mathquest.com',
                }));

                const inserted = await queryInterface.bulkInsert(
                    'problems',
                    problemsPayload,
                    { returning: true, transaction: t }
                );

                // Attach IDs back by matching position (we inserted in the same order)
                for (let i = 0; i < inserted.length; i++) {
                    const insertedProblem = inserted[i];
                    const spec = bp.problems[i];
                    allInsertedProblems.push({ spec, row: insertedProblem });
                }
            }

            // 4) Build all MC options (4 per MC) using returned problem_ids
            const optionsPayload = [];
            for (const { spec, row } of allInsertedProblems) {
                if (spec.type !== 'multiple_choice') continue;

                for (let idx = 0; idx < spec.mc.length; idx++) {
                    optionsPayload.push({
                        problem_id: row.problem_id,
                        body: spec.mc[idx],
                        position: idx + 1,
                        is_correct: idx === spec.correctIdx,

                        created_at: now,
                        updated_at: now,
                        created_by: 'system@mathquest.com',
                        updated_by: 'system@mathquest.com',
                    });
                }
            }

            await queryInterface.bulkInsert(
                'problem_options',
                optionsPayload,
                { transaction: t }
            );

            await t.commit();
        } catch (e) {
            await t.rollback();
            throw e;
        }
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('lessons', {
            title: {
                [Op.in]: ['Basic Arithmetic', 'Multiplication Mastery', 'Division Basics']
            }
        });
    }
};
