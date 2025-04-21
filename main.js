import { fetchPassage, buildOptionsElement } from './functions.js';

let allOptions = buildOptionsElement();

const sceneForm = document.getElementById('sceneForm');
const sceneSelect = document.getElementById('scene');
const translationSelect = document.getElementById('translation');
const sceneTitleDisplay = document.getElementById('scene-title-display');
const gospelGrid = document.getElementById('gospel-grid');
const textSizeSlider = document.getElementById('textSize');
const lineHeightSlider = document.getElementById('lineHeight');
const gospelBooks = ['Matthew', 'Mark', 'Luke', 'John'];

const loadScene = async () => {
  const selectedIndex = parseInt(sceneSelect.value);
  if (isNaN(selectedIndex)) return;

  const selectedScene = allOptions[selectedIndex].data;
  const bibleId = translationSelect.value;
  const sceneTitle = allOptions[selectedIndex].title;

  sceneTitleDisplay.textContent = `Currently Viewing: ${sceneTitle}`;

  // Reset and update gospel headers
  gospelBooks.forEach((book) => {
    const passageId = selectedScene[book.toLowerCase()];
    const wrapper = document.getElementById(`${book}-box`);
    const header = wrapper?.querySelector('h2');

    if (header) {
      header.textContent = passageId ? `${book} (${passageId})` : book;
    }
  });

  // Fetch all relevant gospel passages
  await Promise.all(
    gospelBooks.map((book) => {
      const passageId = selectedScene[book.toLowerCase()];
      return fetchPassage(book, passageId, bibleId);
    })
  );
};

const updateTextSize = (e) => {
  const size = `${e.target.value}px`;
  document.querySelectorAll('.verse-box').forEach((box) => {
    box.style.fontSize = size;
  });
};

const updateLineHeight = (e) => {
  const lh = e.target.value;
  document.querySelectorAll('.verse-box').forEach((box) => {
    box.style.lineHeight = lh;
  });
};

window.closeGrid = (book) => {
  const wrapper = document.getElementById(`${book}-box`);
  if (wrapper) wrapper.style.display = 'none';
};

sceneForm.addEventListener('submit', (e) => {
  e.preventDefault();
  loadScene();
});

textSizeSlider.addEventListener('input', updateTextSize);
lineHeightSlider.addEventListener('input', updateLineHeight);

// Enable drag-and-drop
new Sortable(gospelGrid, {
  animation: 150,
  handle: '.drag-handle',
  ghostClass: 'bg-gray-300'
});
