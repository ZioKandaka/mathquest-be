// docs/components.js

/**
 * @openapi
 * components:
 *   schemas:
 *     Answer:
 *       type: object
 *       oneOf:
 *         - required: [problem_id, selected_option_id]
 *         - required: [problem_id, input_value]
 *       properties:
 *         problem_id: { type: integer }
 *         selected_option_id: { type: integer, nullable: true }
 *         input_value: { type: string, nullable: true }
 *
 *     SubmitPayload:
 *       type: object
 *       required: [user_id, attempt_id, answers]
 *       properties:
 *         user_id: { type: integer }
 *         attempt_id: { type: string, format: uuid }
 *         answers:
 *           type: array
 *           items: { $ref: '#/components/schemas/Answer' }
 *     Profile:
 *       type: object
 *       properties:
 *         total_xp: { type: integer, example: 120 }
 *         current_streak: { type: integer, example: 3 }
 *         best_streak: { type: integer, example: 7 }
 *         progress_percentage: { type: number, format: float, example: 62.5 }
 */
