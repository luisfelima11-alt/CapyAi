const storyLanguages = ['pt', 'en', 'fr', 'tr'];
const params = new URLSearchParams(location.search);
const currentStory = STORIES.find(story => story.id === params.get('historia'));
const requestedLanguage = params.get('idioma');
const language = storyLanguages.includes(requestedLanguage) ? requestedLanguage : 'en';
const requestedPage = Number(params.get('pagina'));
const byId = id => document.getElementById(id);
const artPath = (story, page) => `assets/stories/${story.art}-${page}.webp`;
function readerLink(story, lang, page) {
  return `historias.html?${new URLSearchParams({ historia: story.id, idioma: lang, pagina: String(page) })}`;
}

if (!currentStory) {
  for (const story of STORIES) {
    const book = document.createElement('a');
    book.className = 'book';
    book.href = readerLink(story, 'en', 1);
    const cover = new Image(900, 600);
    cover.src = artPath(story, 1);
    cover.alt = '';
    const label = document.createElement('span');
    const genre = document.createElement('small');
    genre.textContent = `${story.genre} · ${story.level} · ${story.pages.length} páginas`;
    const title = document.createElement('strong');
    title.textContent = story.title[0];
    label.append(genre, title);
    book.append(cover, label);
    byId('story-list').append(book);
  }
} else {
  const page = Number.isInteger(requestedPage) && requestedPage >= 1 && requestedPage <= currentStory.pages.length ? requestedPage : 1;
  const storyPage = currentStory.pages[page - 1];
  const langIndex = storyLanguages.indexOf(language);
  byId('library').hidden = true;
  byId('reader').hidden = false;
  const title = byId('story-title');
  title.textContent = currentStory.title[langIndex];
  title.lang = language;
  document.title = `${title.textContent} | Capy English`;
  const illustration = byId('story-image');
  illustration.src = artPath(currentStory, page);
  illustration.alt = storyPage[4];
  byId('page-number').textContent = `Página ${page} de ${currentStory.pages.length}`;
  const copy = byId('page-text');
  copy.lang = language;
  copy.textContent = storyPage[langIndex];
  byId('translation').hidden = language === 'pt';
  byId('translation-text').textContent = storyPage[0];
  const select = byId('story-language');
  select.value = language;
  select.addEventListener('change', () => location.assign(readerLink(currentStory, select.value, page)));
  const previous = byId('previous-page');
  previous.hidden = page === 1;
  if (page > 1) previous.href = readerLink(currentStory, language, page - 1);
  const next = byId('next-page');
  const last = page === currentStory.pages.length;
  next.href = last ? 'historias.html' : readerLink(currentStory, language, page + 1);
  if (last) next.textContent = 'Concluir leitura';
}
