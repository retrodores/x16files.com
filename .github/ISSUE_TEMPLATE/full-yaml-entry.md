---
name: Full YAML Entry
about: Full YAML format to add
title: ''
labels: ''
assignees: ''

---

```
- appid: cx16chess
  name: CX16 Chess
  description: "Chess game for the Commander X16"
  author:
    - name: "Irmen de Jong"
      email: ""                                # can be blank
  version: "None"                              # free-form text; e.g., "1.0.0"
  license: ""                                  # optional (e.g., MIT, GPL-3.0)
  status: "active"                             # one of: active, abandoned

  # platforms allowed: x16, x16gs, otterx, emulator, any
  # "any" = runs on any X16-family target (covers x16/x16gs/otterx/emulator)
  platforms:
    - "any"

  system_requirements:
    memory:
      min_kb: 64                               # X16 RAM minimum in KB (use null if unknown)
      max_kb: null                             # set if there is a known upper bound; else null
    cpu: "either"                              # one of: 6502, 65C02, either

  rom_able: false                              # true if suitable for cartridge/ROM

  categories:
    - types: ["free", "freemium"]              # any of: free, freemium, paid
      group: "games"
      subcategories:
        - "strategy"
        - "boardgames"

  urls:
    source: "https://github.com/irmen/cx16chess"      # if exists
    download: "https://../path/to/PRG-BIN-or-ZIP"     # if exists
    x16forum: "https://..."                           # optional
    website: ""                                       # optional (itch.io, homepage)

  extra:
    notes: "Example of using the 'extra' field for arbitrary metadata or comments."
    last_updated: "2025-11-17"
    keywords:
      - "chess"
      - "ai"
      - "board game"
```
