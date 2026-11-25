# Let's Index X16 Programs!

Help needed

- please submit PRs to the YAML files in the `./data/` directory.
- submit Issues with information to add

Curated information will appear at https://X16files.com/directory!

# Data Use

These JSON and YAML files are provided for community reference only. Do NOT deploy,
distribute, or integrate it without prior authorization. We plan on making resources
available after the site is established so that people can write clients using the data
and search capabilities we're planning.


## X16 For All Time catalog feed

X16 For All Time is authorized to consume the feed at
https://x16files.com/directory/data/launcher.json. The existing catalog-wide
data-use policy still applies.

`bin/merge` generates `data/launcher.json` from `files/**/meta.json`.
The JSON object has `schema_version: 1` and a `programs` array sorted by
`appid`. Each entry has an `appid` and an absolute `page_url` for its
catalog listing. The feed copies `name`, `category`, `author.name`,
`version`, and `description` when present.

Every program can be browsed. A single verified download appears as
`package`. Several verified downloads appear as `packages`. Each package
has a direct `url` and an explicit `format` of `prg` or `zip`, including
for URLs without file extensions. An optional ZIP `prg` is the exact,
case-sensitive relative path to an author-identified startup PRG. Omit it
when the launcher should offer a choice. Keep the archive's companion
files and directory structure when extracting it.

For one download, record the verified `format` and optional ZIP `prg`
in the program's `launcher_package` object. The URL defaults to
`urls.download`. For several downloads, use an array of these objects
with an explicit `url` for each distribution. A bare `urls.download`
link does not create a package in the feed.

Meteor Defender v1.0.0 has this package:

```json
{
  "url": "https://github.com/voidstar78/METDEFX16/releases/download/v1.0.0/METDEFX16_V1.ZIP",
  "format": "zip",
  "prg": "METDEFX16.PRG"
}
```

## Publishing the homepage and social previews

The directory checkout is served at `/directory/`. The root homepage is kept
in `site-root/index.html`. From the live directory checkout, install that
file as the document root's index with
`install -m 0644 site-root/index.html ../index.html`.

The social card uses the public image in `assets/social-preview-v1.jpg` on
GitHub. This lets preview crawlers fetch it without a site referrer.
