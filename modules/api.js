export const fetchPassage = async (passageId, bibleId, includeVerseNumbers = true) => {
  if (!passageId) return null;

  const includeVerseParam = includeVerseNumbers ? 'true' : 'false';
  const url = `https://api.scripture.api.bible/v1/bibles/${bibleId}/passages/${passageId}?content-type=html&include-verse-numbers=${includeVerseParam}`;

  try {
    const res = await fetch(url, {
      headers: { 'api-key': '29debb9a8eae0ecb2959ebe64d754bb3' }
    });
    const data = await res.json();
    return data?.data?.content || null;
  } catch (e) {
    console.error('Error fetching passage:', e);
    return null;
  }
};
