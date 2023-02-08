// https://stackoverflow.com/questions/61964265/getting-error-this-document-requires-trustedhtml-assignment-in-chrome
escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {
  createHTML: (to_escape) => to_escape
});

moveCursorToEndOfEditor = (editor) => {
  editor.focus();
  window.getSelection().selectAllChildren(editor);
  window.getSelection().collapseToEnd();
}

getEmojiDescription = (emojiHtml) => {
  // TODO detect emoji and use common emojis
  // https://stackoverflow.com/questions/6639770/how-do-i-get-the-unicode-hex-representation-of-a-symbol-out-of-the-html-using-ja
  // https://emojipedia.org/pt/pessoas/
  const attr = 'data-emoji';
  const regex = new RegExp(`${attr}="(.*?)"`);
  const match = emojiHtml[0].match(regex);
  const value = match && match[1];
  // maybe this should be moved to another file since it'll be a huge list
  const descriptions = {
    '😀': 'rosto sorrindo',
    '🙂': 'rosto sorrindo levemente',
    '🙁': 'rosto triste',
    '😢': 'rosto chorando',
    '🫤': 'rosto com boca diagonal',
    '❤️': 'coração',
    '➕': 'símbolo de adição',
  };

  const description = descriptions[value];

  if (description) {
    return `(${description})`;
  } else {
    return '(emoji sem descrição)';
  }
}

// TODO: can we use this while writing emails?
document.addEventListener("input", function(event) {
  if (event.inputType == 'deleteContentBackward') {
    return;
  }

  let editor = event.target;

  if (editor.getAttribute('role') == 'textbox') {
    let text = editor.innerHTML.trim();
  
    const regexWithSpan = /<span[^<>]*>(.*<img[^<>]*data-emoji[^<>]*>)+.*<\/span[^<>]*>$/;
    const regexWithoutSpan = /<img[^<>]*data-emoji[^<>]*>$/;
    let emoji = text.match(regexWithSpan) || text.match(regexWithoutSpan);

    if (emoji) {
      let emojiDescription = getEmojiDescription(emoji);
      editor.innerHTML = escapeHTMLPolicy.createHTML(text + ` <font color="#9e9e9e">${emojiDescription}</font> `);
  
      moveCursorToEndOfEditor(editor);
    }
  }
});
