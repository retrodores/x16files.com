// load-yaml.js
// Adds only a top alphabetical 2-letter directory.
// Actual card layout stays exactly 3 columns with no grouping.

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

  // ---- BUILD 2-LETTER GROUPS FOR DIRECTORY ONLY ----
  let groups = {};  // { "CH": [...], "ED": [...], ... }

  pkgs.forEach(pkg => {
    const key = (pkg.name || "").substring(0, 2).toUpperCase();
    if (!groups[key]) groups[key] = [];
    groups[key].push(pkg);
  });

  const sortedKeys = Object.keys(groups).sort();

  // ---- BUILD TOP DIRECTORY (5 columns) ----
  let indexHTML = `<div id="pkg-index" class="pkg-index">`;

  sortedKeys.forEach(key => {
    const arr = groups[key].sort((a, b) => a.name.localeCompare(b.name));

    indexHTML += `
      <div class="index-block">
        <span class="index-letter">${key}</span>
        <div class="index-names">
          ${arr.map(p =>
            `<a href="#pkg-${esc(p.name).replace(/\s+/g, "-")}">${esc(p.name)}</a>`
          ).join(", ")}
        </div>
      </div>
    `;
  });

  indexHTML += `</div>`;

  // ---- ORIGINAL 3-COLUMN PROGRAM LISTING (unchanged) ----
  let html = indexHTML;  // index above the table

  html += `<table><tr>`;
  pkgs.forEach((pkg, i) => {
    const cls      = `c${(i % 9) + 1}`;
    const name     = esc(pkg.name);
    const forumurl = pkg.urls?.x16forum || "#";
    const ver      = esc(pkg.version || "");
    const auth     = esc(pkg.author?.name || "");
    const desc     = esc(pkg.description || "");

    const anchorId = `pkg-${name.replace(/\s+/g, "-")}`;

    html += `
      <td id="${anchorId}">
        <div class="card-top ${cls}"></div>
        <div class="card-mid">
          <a href="${forumurl}" target="_blank" rel="noopener">${name}</a>
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
}

