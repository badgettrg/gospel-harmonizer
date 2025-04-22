import { harmonyData } from './data/harmonyData.js';

export const normalizePassageStr = (passage) => {
  if (!passage) return '';

  const bookMap = { MAT: 'Matthew', MRK: 'Mark', LUK: 'Luke', JHN: 'John' };
  const parts = passage.split('-');
  const [startBookAbbr, startChapter, startVerse] = parts[0].split('.');
  const startBook = bookMap[startBookAbbr] || startBookAbbr;

  if (parts.length === 1) {
    return `${startBook} ${startChapter}:${startVerse}`;
  }

  const [, endChapter, endVerse] = parts[1].split('.');
  return `${startBook} ${startChapter}:${startVerse}–${endChapter}:${endVerse}`;
};

export const fetchPassage = async (book, passageId, bibleId) => {
  const box = document.getElementById(book);
  const wrapper = document.getElementById(`${book}-box`);
  if (!passageId || !box || !wrapper) {
    if (wrapper) wrapper.style.display = 'none';
    return;
  }

  const showVerseNumbers = document.getElementById('toggleVerses')?.checked ?? true;
  const includeVerseParam = showVerseNumbers ? 'true' : 'false';

  const url = `https://api.scripture.api.bible/v1/bibles/${bibleId}/passages/${passageId}?content-type=html&include-verse-numbers=${includeVerseParam}`;

  try {
    const res = await fetch(url, {
      headers: { 'api-key': '29debb9a8eae0ecb2959ebe64d754bb3' }
    });

    const data = await res.json();
    if (!data.data?.content) {
      wrapper.style.display = 'none';
      return;
    }

    wrapper.style.display = 'block';
    box.innerHTML = data.data.content;
  } catch (e) {
    console.error(e);
    wrapper.style.display = 'none';
  }
};

export const buildSceneDropdown = () => {
  const dropdown = document.getElementById('scene');
  const grouped = {};

  for (const [category, scenes] of Object.entries(harmonyData)) {
    scenes.forEach((scene) => {
      if (!grouped[category]) {
        const group = document.createElement('optgroup');
        group.label = category;
        grouped[category] = group;
        dropdown.appendChild(group);
      }

      const option = document.createElement('option');
      option.textContent = scene.title;
      option.dataset.scene = JSON.stringify(scene);
      grouped[category].appendChild(option);
    });
  }

  new TomSelect('#scene', {
    placeholder: 'Search Gospel event...',
    maxOptions: 500
  });
};
