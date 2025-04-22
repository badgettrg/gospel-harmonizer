// modules/dom.js
import { normalizePassageStr } from './utils.js';
import { harmonyData } from '../data/harmonyData.js';

export const renderPassageToBox = (book, content) => {
  const wrapper = document.getElementById(`${book}-box`);
  const box = document.getElementById(book);

  if (!wrapper || !box) return;

  // Hide boxes that don't have verses
  if (!content) {
    wrapper.style.display = 'none';
    box.innerHTML = '';
    return;
  }

  wrapper.style.display = 'block';
  box.innerHTML = content;
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

export const updateBoxHeaders = (scene) => {
  ['Matthew', 'Mark', 'Luke', 'John'].forEach((book) => {
    const wrapper = document.getElementById(`${book}-box`);
    const header = wrapper?.querySelector('h2');
    const passageId = scene[book.toLowerCase()];
    if (header) {
      header.textContent = passageId ? normalizePassageStr(passageId) : book;
    }
  });
};

export const highlightSelection = () => {
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
};

export const clearHighlights = () => {
  document.querySelectorAll('mark').forEach((mark) => {
    const parent = mark.parentNode;
    while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
    parent.removeChild(mark);
  });
};
