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


## Publishing the homepage and social previews

The directory checkout is served at `/directory/`. The root homepage is kept
in `site-root/index.html`. From the live directory checkout, install that
file as the document root's index with
`install -m 0644 site-root/index.html ../index.html`.

The social card uses the public image in `assets/social-preview-v1.jpg` on
GitHub. This lets preview crawlers fetch it without a site referrer.
