import test from 'node:test';
import assert from 'node:assert/strict';
import { viennaDateKey, isShortNewsVisible, isChronicleVisible } from '../public/scripts/news-visibility.js';

test('Vienna date changes at local midnight across daylight saving time', () => {
  assert.equal(viennaDateKey(new Date('2026-03-28T22:59:00Z')), '2026-03-28');
  assert.equal(viennaDateKey(new Date('2026-03-28T23:00:00Z')), '2026-03-29');
  assert.equal(viennaDateKey(new Date('2026-10-25T22:59:00Z')), '2026-10-25');
  assert.equal(viennaDateKey(new Date('2026-10-25T23:00:00Z')), '2026-10-26');
});

test('short news stays through the event day and moves to chronicle next day', () => {
  assert.equal(isShortNewsVisible('2026-08-23', '2026-08-29', '2026-08-29'), true);
  assert.equal(isShortNewsVisible('2026-08-23', '2026-08-29', '2026-08-30'), false);
  assert.equal(isChronicleVisible('2026-08-29', '2026-08-29'), false);
  assert.equal(isChronicleVisible('2026-08-29', '2026-08-30'), true);
});
