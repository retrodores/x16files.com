(() => {
  const share = document.querySelector("[data-share-page]");
  const canonical = document.querySelector('link[rel="canonical"]');
  if (!share || !canonical) return;

  const url = canonical.href;
  const title = document.querySelector('meta[property="og:title"]')?.content || document.title;
  const destinations = [
    ["Facebook", "https://www.facebook.com/sharer/sharer.php", { u: url }],
    ["X", "https://x.com/intent/tweet", { text: title, url }],
    ["Bluesky", "https://bsky.app/intent/compose", { text: `${title} ${url}` }],
    ["Reddit", "https://www.reddit.com/submit", { title, url }],
  ];

  const row = document.createElement("div");
  row.className = "share-links";
  const label = document.createElement("span");
  label.textContent = "Share";
  row.append(label);

  for (const [name, endpoint, params] of destinations) {
    const destination = new URL(endpoint);
    destination.search = new URLSearchParams(params);
    const link = document.createElement("a");
    link.href = destination.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = name;
    link.setAttribute("aria-label", `Share on ${name}`);
    row.append(link);
  }

  const discord = document.createElement("button");
  discord.type = "button";
  discord.textContent = "Discord";
  discord.setAttribute("aria-label", "Copy link for Discord");

  const status = document.createElement("span");
  status.className = "share-status";
  status.setAttribute("role", "status");
  const manual = document.createElement("input");
  manual.type = "url";
  manual.readOnly = true;
  manual.hidden = true;
  manual.value = url;
  manual.setAttribute("aria-label", "Page link to copy and paste into Discord");

  discord.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(url);
      manual.hidden = true;
      status.textContent = "Link copied. Paste it into Discord.";
    } catch {
      manual.hidden = false;
      manual.focus();
      manual.select();
      status.textContent = "Copy the selected link and paste it into Discord.";
    }
  });

  row.append(discord, status, manual);
  share.append(row);
})();
