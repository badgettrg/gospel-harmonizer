import { API_KEY } from '/config.js';

export const fetchPassage = async (passageId, bibleId, includeVerseNumbers = true) => {
  if (!passageId) return null;

  const includeVerseParam = includeVerseNumbers ? 'true' : 'false';
  const url = `https://api.scripture.api.bible/v1/bibles/${bibleId}/passages/${passageId}?content-type=html&include-verse-numbers=${includeVerseParam}`;

  try {
    const res = await fetch(url, {
      headers: { 'api-key': API_KEY }
    });
    const data = await res.json();
    return data?.data?.content || null;
  } catch (e) {
    console.error('Error fetching passage:', e);
    return null;
  }
};
