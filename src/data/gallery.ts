export type GalleryEntry = {
  title: string;
  date: string;
  description: string;
  newsSlug?: string;
  galleryHref?: string;
  coverImage?: string;
};

export const galleryEntries: GalleryEntry[] = [
  {
    title: 'Lehrgang mit Daniel und Sonia Toutain',
    date: '2026-09-12',
    description: 'Ausschreibung und spaetere Eindruecke zum Lehrgang in Hochburg-Ach.',
    newsSlug: '2026/09/001-lehrgang-daniel-sonia-toutain',
  },
  {
    title: 'Ushi Deshi mit Daniel und Sonia Toutain',
    date: '2026-09-14',
    description: 'Ausschreibung und spaetere Galerie zur intensiven Trainingswoche in Birach.',
    newsSlug: '2026/09/002-ushi-deshi-birach',
  },
  {
    title: '1. Training',
    date: '2026-03-09',
    description: 'Das erste Training unseres neuen Dojo\'s fand voll motiviert am 9. März 2026, mit bester Aussicht auf die Burg, statt.',
    galleryHref: 'images/gallery/2026_03_09/1st_trainingsession.jpeg',
    coverImage: 'images/gallery/2026_03_09/1st_trainingsession.jpeg',
  },
];

export function sortGalleryNewestFirst(entries: GalleryEntry[]) {
  return [...entries].sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());
}
