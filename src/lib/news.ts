import type { CollectionEntry } from 'astro:content';

export type NewsEntry = CollectionEntry<'news'>;

export function getNewsSlug(entry: NewsEntry) {
  return entry.id.replace(/\.md$/, '');
}

export function sortByDateDescending(entries: NewsEntry[]) {
  return [...entries].sort((left, right) => right.data.date.getTime() - left.data.date.getTime());
}

export function sortByDateAscending(entries: NewsEntry[]) {
  return [...entries].sort((left, right) => left.data.date.getTime() - right.data.date.getTime());
}

export function isEvent(entry: NewsEntry) {
  return entry.data.type === 'event';
}

export function isNews(entry: NewsEntry) {
  return entry.data.type === 'news';
}

export function isUpcoming(entry: NewsEntry, today = new Date()) {
  const start = new Date(today);
  start.setHours(0, 0, 0, 0);
  return entry.data.date.getTime() >= start.getTime();
}

export function formatDate(date: Date, locale = 'de-DE') {
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateRange(startDate: Date, endDate?: Date, locale = 'de-DE') {
  if (!endDate) {
    return formatDate(startDate, locale);
  }

  const sameMonth =
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth();

  if (sameMonth) {
    return `${startDate.getDate()}.-${endDate.getDate()}. ${startDate.toLocaleDateString(locale, {
      month: 'long',
      year: 'numeric',
    })}`;
  }

  return `${formatDate(startDate, locale)} - ${formatDate(endDate, locale)}`;
}

export function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function buildMonthLabel(date: Date, locale = 'de-DE') {
  return date.toLocaleDateString(locale, {
    month: 'long',
    year: 'numeric',
  });
}

export function getMonthMatrix(referenceDate: Date) {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const firstWeekday = (firstDay.getDay() + 6) % 7;
  const daysInMonth = lastDay.getDate();
  const weeks: Array<Array<number | null>> = [];

  let currentWeek: Array<number | null> = Array.from({ length: 7 }, () => null);

  for (let index = 0; index < firstWeekday; index += 1) {
    currentWeek[index] = null;
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const weekdayIndex = (firstWeekday + day - 1) % 7;
    currentWeek[weekdayIndex] = day;

    if (weekdayIndex === 6 || day === daysInMonth) {
      weeks.push(currentWeek);
      currentWeek = Array.from({ length: 7 }, () => null);
    }
  }

  return weeks;
}
