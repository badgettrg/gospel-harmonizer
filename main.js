import { buildSceneDropdown, fetchPassage, normalizePassageStr } from './functions.js';

buildSceneDropdown();

const gospelGrid = document.getElementById('gospel-grid');
new Sortable(gospelGrid, {
  animation: 150,
  handle: '.drag-handle',
  ghostClass: 'bg-gray-300'
});

document.getElementById('sceneForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const gospelBooks = ['Matthew', 'Mark', 'Luke', 'John'];

  const selectedOption = document.querySelector('#scene option:checked');
  if (!selectedOption || !selectedOption.dataset.scene) return;

  const scene = JSON.parse(selectedOption.dataset.scene);
  const sceneTitle = selectedOption.textContent;
  const bibleId = document.getElementById('translation').value;

  document.getElementById('scene-title-display').textContent = `Currently Viewing: ${sceneTitle}`;

  gospelBooks.forEach((book) => {
    const passageId = scene[book.toLowerCase()];
    const wrapper = document.getElementById(`${book}-box`);
    const header = wrapper.querySelector('h2');
    header.textContent = passageId ? normalizePassageStr(passageId) : book;
  });

  await Promise.all(
    gospelBooks.map((book) => {
      const passageId = scene[book.toLowerCase()];
      return fetchPassage(book, passageId, bibleId);
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

function highlightSelection() {
  const selection = window.getSelection();
  if (selection && selection.toString().length > 0) {
    const range = selection.getRangeAt(0);
    const mark = document.createElement('mark');
    mark.className = 'bg-yellow-200';
    try {
      range.surroundContents(mark);
    } catch (e) {
      console.warn('Highlight failed:', e);
    }
    selection.removeAllRanges();
  }
}

document.querySelectorAll('.verse-box').forEach((box) => {
  box.addEventListener('mouseup', highlightSelection);
  box.addEventListener('touchend', () => {
    setTimeout(highlightSelection, 1);
  });
});

window.closeGrid = (book) => {
  const wrapper = document.getElementById(`${book}-box`);
  if (wrapper) wrapper.style.display = 'none';
};

window.clearHighlights = () => {
  document.querySelectorAll('mark').forEach((mark) => {
    const parent = mark.parentNode;
    while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
    parent.removeChild(mark);
  });
};
