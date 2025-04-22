export const normalizePassageStr = (passage) => {
  if (!passage) return '';

  const bookMap = { MAT: 'Matthew', MRK: 'Mark', LUK: 'Luke', JHN: 'John' };

  const parts = passage.split('-');
  const [startBookAbbr, startChapter, startVerse] = parts[0].split('.');
  const startBook = bookMap[startBookAbbr] || startBookAbbr;

  if (parts.length === 1) {
    // Single verse
    return `${startBook} ${startChapter}:${startVerse}`;
  }

  const [, endChapter, endVerse] = parts[1].split('.');
  if (startChapter === endChapter) {
    return `${startBook} ${startChapter}:${startVerse}-${endVerse}`;
  }

  return `${startBook} ${startChapter}:${startVerse}-${endChapter}:${endVerse}`;
};
