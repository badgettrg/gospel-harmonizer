import { harmonyData } from './data/harmonyData.js';

export const fetchPassage = async (book, passageId, bibleId) => {
  const box = document.getElementById(book);
  const wrapper = document.getElementById(`${book}-box`);
  if (!passageId || !box || !wrapper) {
    if (wrapper) wrapper.style.display = 'none';
    return;
  }

  const url = `https://api.scripture.api.bible/v1/bibles/${bibleId}/passages/${passageId}?content-type=html&include-verse-numbers=true`;
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
    console.log(data.data.content);
  } catch (e) {
    console.error(e);
    wrapper.style.display = 'none';
  }
};

export const buildOptionsElement = () => {
  const allOptions = [];
  const sceneDropdown = document.getElementById('scene');
  const grouped = {};

  for (const [category, scenes] of Object.entries(harmonyData)) {
    scenes.forEach((scene) => {
      allOptions.push({ category, title: scene.title, data: scene });
    });
  }

  allOptions.forEach(({ category, title }, i) => {
    if (!grouped[category]) {
      grouped[category] = document.createElement('optgroup');
      grouped[category].label = category;
      sceneDropdown.appendChild(grouped[category]);
    }
    const option = document.createElement('option');
    option.value = i;
    option.textContent = title;
    grouped[category].appendChild(option);
  });

  new TomSelect('#scene', {
    placeholder: 'Search Gospel event...',
    maxOptions: 500
  });

  return allOptions;
};
