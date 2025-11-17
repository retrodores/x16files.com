async function loadYAML(category) {
  const res = await fetch(`data/${category}.yaml`);
  const text = await res.text();
  const data = jsyaml.load(text);
  renderTable(data);
}

function esc(s=""){
  return String(s)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#39;");
}

function renderTable(data) {
  const container = document.getElementById('pkg-list');
  document.querySelector('h2').textContent = data.category || "Packages";

  let html = '<table><tr>';
  data.packages.forEach((pkg, i) => {
    const cls = `c${(i % 9) + 1}`; // rotate band colors
    const name = esc(pkg.name);
    const url  = pkg.url || "#";
    const ver  = esc(pkg.version || "");
    const auth = esc(pkg.author  || "");
    const desc = esc(pkg.description || "");

    html += `
      <td>
        <div class="card-top ${cls}"></div>
        <div class="card-mid"><a href="${url}" target="_blank" rel="noopener">${name}</a></div>
        <div class="card-desc">${desc}</div>
        <div class="card-bot">${ver}${ver && auth ? " • " : ""}${auth}</div>
      </td>`;

    if ((i + 1) % 3 === 0) html += '</tr><tr>';
  });
  html += '</tr></table>';
  container.innerHTML = html;
}
