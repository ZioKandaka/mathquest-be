import { createHash } from 'node:crypto';

export function getHash(algorithm, data) {
  return createHash(algorithm)
    .update(data)
    .digest('hex');
}
