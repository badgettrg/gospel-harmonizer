import { buildSceneDropdown } from './modules/dom.js';
import { fetchPassage } from './modules/api.js';
import { renderPassageToBox, updateBoxHeaders, clearHighlights, highlightSelection } from './modules/dom.js';

const tomSceneDropdown = buildSceneDropdown();

new Sortable(document.getElementById('gospel-grid'), {
  animation: 150,
  handle: '.drag-handle',
  ghostClass: 'bg-gray-300'
});

document.getElementById('sceneForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const selectedOption = document.querySelector('#scene option:checked');
  if (!selectedOption || !selectedOption.dataset.scene) return;

  const scene = JSON.parse(selectedOption.dataset.scene);
  const sceneTitle = selectedOption.textContent;
  const bibleId = document.getElementById('translation').value;
  const showVerses = document.getElementById('toggleVerses')?.checked ?? true;

  localStorage.setItem('selectedScene', sceneTitle);
  localStorage.setItem('selectedTranslation', bibleId);

  document.getElementById('scene-title-display').textContent = `Currently Viewing: ${sceneTitle}`;
  updateBoxHeaders(scene);

  await Promise.all(
    ['Matthew', 'Mark', 'Luke', 'John'].map(async (book) => {
      const passageId = scene[book.toLowerCase()];
      const content = await fetchPassage(passageId, bibleId, showVerses);
      console.log(content);
      renderPassageToBox(book, content);
    })
  );
});

document.getElementById('textSize').addEventListener('input', (e) => {
  const size = `${e.target.value}px`;
  document.querySelectorAll('.verse-box').forEach((box) => {
    box.style.fontSize = size;
    localStorage.setItem('fontSize', size);
  });
});

document.getElementById('lineHeight').addEventListener('input', (e) => {
  const lh = e.target.value;
  document.querySelectorAll('.verse-box').forEach((box) => {
    box.style.lineHeight = lh;
    localStorage.setItem('lineHeight', lh);
  });
});

document.getElementById('toggleVerses').addEventListener('change', (e) => {
  localStorage.setItem('toggleVerses', e.target.checked);
  const form = document.getElementById('sceneForm');
  const event = new Event('submit');
  form.dispatchEvent(event);
});

document.querySelectorAll('.verse-box').forEach((box) => {
  box.addEventListener('mouseup', highlightSelection);
  box.addEventListener('touchend', () => setTimeout(highlightSelection, 1));
});

window.closeGrid = (book) => {
  const wrapper = document.getElementById(`${book}-box`);
  if (wrapper) wrapper.style.display = 'none';
};

window.clearHighlights = clearHighlights;

window.addEventListener('load', () => {
  // load previous scene and translation
  const savedSceneTitle = localStorage.getItem('selectedScene');
  const savedTranslation = localStorage.getItem('selectedTranslation');
  const translationSelect = document.getElementById('translation');

  if (savedTranslation && translationSelect) {
    translationSelect.value = savedTranslation;
  }

  if (savedSceneTitle && tomSceneDropdown) {
    const match = Object.values(tomSceneDropdown.options).find((opt) => opt.text === savedSceneTitle);
    if (match) {
      tomSceneDropdown.setValue(savedSceneTitle);
      const form = document.getElementById('sceneForm');
      form.dispatchEvent(new Event('submit'));
    }
  }

  // load previous options
  const savedLineHeight = localStorage.getItem('lineHeight');
  const savedFontSize = localStorage.getItem('fontSize');
  const savedToggleVerses = localStorage.getItem('toggleVerses');

  document.querySelectorAll('.verse-box').forEach((box) => {
    if (savedLineHeight) box.style.lineHeight = savedLineHeight;
    if (savedFontSize) box.style.fontSize = savedFontSize;
  });

  document.getElementById('textSize').value = savedFontSize.replace('px', '');
  document.getElementById('lineHeight').value = savedLineHeight;
  document.getElementById('toggleVerses').checked = savedToggleVerses === 'true';
});
