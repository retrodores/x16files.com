// load-yaml.js
// Category pages: top 2-letter index (collapsible) + 3-column cards.
// Reuses the same CSS hooks as the authors page: #author-index, .author-index, .toggle-index.

async function loadYAML(category) {
  const res  = await fetch(`data/${category}.yaml`);
  const text = await res.text();
  const data = jsyaml.load(text);
  renderTable(data);
}

function esc(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderTable(data) {
  const container = document.getElementById("pkg-list");
  document.querySelector("h2").textContent = data.category || "Packages";

  const pkgs = data.packages || [];

  // ---- BUILD 2-LETTER GROUPS FOR DIRECTORY ----
  const groups = {}; // { "BI": [...], "IM": [...], ... }

  pkgs.forEach(pkg => {
    const key = (pkg.name || "").substring(0, 2).toUpperCase();
    if (!groups[key]) groups[key] = [];
    groups[key].push(pkg);
  });

  const sortedKeys = Object.keys(groups).sort();

  // --------------------------------------------------
  // COLLAPSIBLE 5-COLUMN INDEX (same hooks as authors)
  // --------------------------------------------------
  let html = `
    <button id="toggle-index" class="toggle-index">Show Package Index</button>
    <div id="author-index" class="author-index collapsed">
  `;

  sortedKeys.forEach(key => {
    const arr = groups[key].sort((a, b) => a.name.localeCompare(b.name));

    html += `
      <div class="index-block">
        <span class="index-letter">${key}</span>
        <div class="index-names">
          ${arr.map(p =>
            `<a href="#pkg-${esc(p.name).replace(/\s+/g, "-")}">${esc(p.name)}</a>`
          ).join(" ")}
        </div>
      </div>
    `;
  });

  html += `</div>`; // end #author-index

  // --------------------------------------------------
  // ORIGINAL 3-COLUMN PROGRAM CARD LISTING
  // --------------------------------------------------
  html += `<table><tr>`;

  pkgs.forEach((pkg, i) => {
    const cls     = `c${(i % 9) + 1}`;
    const name    = esc(pkg.name);
    const ver     = esc(pkg.version || "");
    const auth    = esc(pkg.author?.name || "");
    const desc    = esc(pkg.description || "");

    let url = "#";
    if (pkg.urls)
      url = pkg.urls.x16forum || pkg.urls.source || pkg.urls.website || pkg.urls.webemu || "#";

    const anchorId = `pkg-${name.replace(/\s+/g, "-")}`;

    html += `
      <td id="${anchorId}">
        <div class="card-top ${cls}"></div>
        <div class="card-mid">
          <a href="${url}" target="_blank" rel="noopener">${name}</a>
        </div>
        <div class="card-desc">${desc}</div>
        <div class="card-bot">
          ${ver}${ver && auth ? " ~@ " : ""}${auth}
        </div>
      </td>
    `;

    if ((i + 1) % 3 === 0) html += `</tr><tr>`;
  });

  html += `</tr></table>`;

  container.innerHTML = html;

  // ---- ENABLE COLLAPSE / EXPAND ----
  const btn = document.getElementById("toggle-index");
  const idx = document.getElementById("author-index");

  if (btn && idx) {
    btn.addEventListener("click", () => {
      idx.classList.toggle("collapsed");
      idx.classList.toggle("expanded");

      btn.textContent = idx.classList.contains("collapsed")
        ? "Show Package Index"
        : "Hide Package Index";
    });
  }
}

