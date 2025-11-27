// load-authors-yaml.js
// Render authors + alphabetical 2-letter index + author name list

async function loadAuthorsYAML(file = "authors") {
  const res  = await fetch(`data/${file}.yaml`);
  const text = await res.text();
  const data = jsyaml.load(text);
  renderAuthorsTable(data);
}

function esc(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderAuthorsTable(data) {
  const container = document.getElementById("pkg-list");
  const h2 = document.querySelector("h2");
  h2.textContent = "Packages by Author";

  const authors = data.authors || {};

  // ---- BUILD 2-LETTER GROUPING ----
  let indexMap = {};  // { "AI": ["Aiee5"], "BO": ["Borgar Olsen"], ... }

  Object.keys(authors).forEach(name => {
    const key = name.substring(0, 2).toUpperCase();
    if (!indexMap[key]) indexMap[key] = [];
    indexMap[key].push(name);
  });

  const sortedKeys = Object.keys(indexMap).sort();

  // ---- RENDER INDEX + AUTHOR NAME LIST ----
  let indexHTML = `<div id="author-index" class="author-index">`;

  sortedKeys.forEach(key => {
    const names = indexMap[key].sort();

    indexHTML += `
      <div class="index-block">
        <a class="index-letter" href="#idx-${key}">${key}</a>
        <div class="index-names">
          ${names
            .map(
              n =>
                `<a href="#author-${esc(n).replace(/\s+/g, "-")}">${esc(n)}</a>`
            )
            .join(", ")}
        </div>
      </div>
    `;
  });

  indexHTML += `</div>`;

  // ---- RENDER AUTHORS + PACKAGES ----

  let html = indexHTML; // put index at top

  sortedKeys.forEach(key => {
    html += `<h2 id="idx-${key}" class="index-section">${key}</h2>`;

    indexMap[key].sort().forEach(authorKey => {
      const pkgs = authors[authorKey] || [];
      const authorHeading = esc(authorKey);

      html += `<h3 id="author-${authorHeading.replace(/\s+/g, "-")}">${authorHeading}</h3>`;
      html += "<table><tr>";

      pkgs.forEach((pkg, i) => {
        const cls = `c${(i % 9) + 1}`;
        const name = esc(pkg.name || "");

        let url = "#";
        if (pkg.urls)
          url = pkg.urls.x16forum || pkg.urls.source || "#";

        const ver  = esc(pkg.version || "");
        const cat  = esc(pkg.category || "");
        const desc = esc(pkg.description || "");

        const mainAuthor =
          (pkg.author && pkg.author.name) || authorKey;

        let coAuthor = "";
        if (pkg.coauthors && pkg.coauthors.name)
          coAuthor = ` & ${pkg.coauthors.name}`;

        const auth = esc(mainAuthor + coAuthor);

        html += `
          <td>
            <div class="card-top ${cls}"></div>
            <div class="card-mid">
              <a href="${url}" target="_blank" rel="noopener">${name}</a>
            </div>
            <div class="card-desc">${desc}</div>
            <div class="card-bot">
              ${cat}${cat && ver ? " · " : ""}${ver}
              ${(ver || cat) && auth ? " ~@ " : ""}${auth}
            </div>
          </td>
        `;

        if ((i + 1) % 3 === 0) html += "</tr><tr>";
      });

      html += "</tr></table>";
    });
  });

  container.innerHTML = html;
}

// Auto-load on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  loadAuthorsYAML("authors");
});

