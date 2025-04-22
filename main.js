import { buildSceneDropdown } from './modules/dom.js';
import { fetchPassage } from './modules/api.js';
import { renderPassageToBox, updateBoxHeaders, clearHighlights, highlightSelection } from './modules/dom.js';

buildSceneDropdown();

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

  document.getElementById('scene-title-display').textContent = `Currently Viewing: ${sceneTitle}`;
  updateBoxHeaders(scene);

  await Promise.all(
    ['Matthew', 'Mark', 'Luke', 'John'].map(async (book) => {
      const passageId = scene[book.toLowerCase()];
      const content = await fetchPassage(passageId, bibleId, showVerses);
      renderPassageToBox(book, content);
    })
  );
});

document.getElementById('textSize').addEventListener('input', (e) => {
  const size = `${e.target.value}px`;
  document.querySelectorAll('.verse-box').forEach((box) => {
    box.style.fontSize = size;
  });
});

document.getElementById('lineHeight').addEventListener('input', (e) => {
  const lh = e.target.value;
  document.querySelectorAll('.verse-box').forEach((box) => {
    box.style.lineHeight = lh;
  });
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
