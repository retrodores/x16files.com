(() => {
  const nav = document.querySelector(".directory-nav");
  if (!nav) return;

  const groups = [
    [
      ["Directory Home", "/directory/index.html"],
      ["Author Leaderboard", "/directory/leaderboard.html"],
      ["By Author", "/directory/authors.html"],
      ["Full Text Search", "/cgi-bin/search-x16files.pl"],
      ["References", "/directory/references.html"],
    ],
    [
      ["Editors", "/directory/editors.html"],
      ["File & Disk", "/directory/files.html"],
      ["Games", "/directory/games.html"],
      ["Graphics", "/directory/graphics.html"],
      ["Internet", "/directory/internet.html"],
      ["Programming", "/directory/programming.html"],
      ["Sound", "/directory/sound.html"],
      ["System", "/directory/system.html"],
      ["Tools", "/directory/tools.html"],
    ],
  ];

  for (const destinations of groups) {
    const row = document.createElement("ul");

    for (const [label, path] of destinations) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = path;
      link.textContent = label;
      if (location.pathname === path) link.setAttribute("aria-current", "page");
      item.append(link);
      row.append(item);
    }

    nav.append(row);
  }
})();
