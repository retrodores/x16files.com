// load-authors-yaml.js
// Render authors + A–Z alphabetical index + collapsible index block

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

  // ---- BUILD A–Z GROUPING ----
  let indexMap = {}; // { A: ["Alice"], B: ["Borgar"], ... }

  Object.keys(authors).forEach(name => {
    const key = name.charAt(0).toUpperCase();
    if (!indexMap[key]) indexMap[key] = [];
    indexMap[key].push(name);
  });

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // ---- BUILD COLLAPSIBLE INDEX HTML ----
  let indexHTML = `
  <div id="author-index-wrapper">
    <button id="toggle-index" class="toggle-index">Show Author Index</button>

    <div id="author-index" class="author-index collapsed">
`;


  letters.forEach(letter => {
    const names = (indexMap[letter] || []).sort();

    if (names.length === 0) {
      indexHTML += `
        <div class="index-block disabled">
          <span class="index-letter disabled">${letter}</span>
        </div>
      `;
    } else {
      indexHTML += `
        <div class="index-block">
          <a class="index-letter" href="#idx-${letter}">${letter}</a>
          <div class="index-names">
            ${names
              .map(
                n =>
                  `<a href="#author-${esc(n).replace(/\s+/g, "-")}">${esc(n)}</a>`
              )
              .join(" ")}
          </div>
        </div>
      `;
    }
  });

  indexHTML += `
      </div> <!-- /author-index -->
    </div>   <!-- /author-index-wrapper -->
  `;


  // ---- RENDER AUTHORS + PACKAGES BELOW ----
  let html = indexHTML;

  letters.forEach(letter => {
    if (!indexMap[letter]) return;

    html += `<h2 id="idx-${letter}" class="index-section">${letter}</h2>`;

    indexMap[letter].sort().forEach(authorKey => {
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

  // ---- ENABLE COLLAPSIBLE BEHAVIOR ----
  const idx = document.getElementById("author-index");
  const btn = document.getElementById("toggle-index");
  
  if (idx && btn) {
    btn.addEventListener("click", () => {
      idx.classList.toggle("collapsed");
      idx.classList.toggle("expanded");
  
      btn.textContent = idx.classList.contains("collapsed")
        ? "Show Author Index"
        : "Hide Author Index";
    });
  }
}

// Auto-load
document.addEventListener("DOMContentLoaded", () => {
  loadAuthorsYAML("authors");
});
