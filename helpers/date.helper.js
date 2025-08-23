export function getUtcDate() {
    let now = new Date()
    return new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate()
    )).toISOString().slice(0, 10);
}