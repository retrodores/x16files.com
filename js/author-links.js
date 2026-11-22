// Keep the Authors page's existing IDs, including accents and punctuation.
function authorAnchorId(name) {
  return "author-" + name.replace(/\s+/g, "-");
}

function authorFragment(name) {
  return "#" + encodeURIComponent(authorAnchorId(name));
}
