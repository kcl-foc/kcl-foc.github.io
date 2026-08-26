# Foundations of Computing

Jekyll site for the Foundations of Computing group, Department of Informatics,
King's College London. Everything on the site is edited through YAML files in
`_data/` — no HTML editing needed for routine updates.

## Where the content lives

| File | What it controls |
| --- | --- |
| `_data/site.yml` | **Every piece of text on the site**: titles, headings, section descriptions, button labels, footer. |
| `_data/people.yml` | Everyone on the site, in four groups: `organisers`, `seminar_organiser`, `members`, `affiliate_members`. |
| `_data/news.yml` | Group news items. Optional — the section is hidden when this file has no entries. |
| `_data/talks.yml` | Seminar talks (upcoming and past). |

Longer text fields support markdown: links, `**bold**`, `*italic*`, and blank
lines for new paragraphs.

## Pages

- `/` — group home page: description, organisers, members, affiliate members,
  seminar blurb, and the two talks closest to today (always including the next
  upcoming one), with a link to the full seminar page.
- `/seminar/` — full seminar page: all upcoming talks (soonest first) followed
  by all past talks (most recent first).

## Adding a member

Add an entry under `members:` (or `affiliate_members:`) in `_data/people.yml`:

```yaml
members:
  - name: "Dr. Jane Doe"
    email: "jane.doe@kcl.ac.uk"
    job_title: "Lecturer in Computer Science"   # optional
    website: "https://example.com/~jdoe"        # optional
```

People appear in the order they are listed. Entries under `organisers:` take a
`role:` (e.g. "Group Head") instead of a `job_title:`.

Email and website show as small icons beside the name, keeping each entry to
two lines. `website` takes one link per person — a personal homepage or a KCL
profile page, whichever you prefer.

## Adding a news item

Add an entry to `_data/news.yml`:

```yaml
- date: "2026-08-10"
  title: "Best Paper Award at ICALP 2026"   # optional
  text: "Congratulations to ..."            # supports markdown
  link: "https://example.com"               # optional
  link_text: "Read more"                    # optional
```

Items are sorted by date, most recent first. The home page shows the newest
`home.news.limit` items (set it to `0` in `_data/site.yml` to show all). Delete
every entry to hide the News section entirely.

## Adding a talk

Add an entry to `_data/talks.yml`:

```yaml
- title: "Talk Title"
  speaker: "Speaker Name"
  date: "2026-12-01"         # YYYY-MM-DD format required
  time: "14:00-15:00"        # Use hyphen for time range
  room: "K5.10"
  abstract: "Description here"   # Supports markdown
  video_link: "https://..."  # Optional: Teams/Zoom meeting link
  person_url: "https://..."  # Optional: Speaker homepage
  paper_url: "https://..."   # Optional: Related paper
```

Only `title` and `speaker` are required. Talks are sorted automatically: those
dated today or later show as upcoming, earlier ones as past. Order within the
file does not matter.

Each talk gets an "Add to Calendar" button that downloads an `.ics` file. To
remove it, delete the `<button class="btn-add-calendar">` element in
[_includes/talk.html](_includes/talk.html).

## Password gate

The site can be hidden behind a simple password prompt, configured under
`gate:` in `_data/site.yml`. The current password is **`informatics`**.

> **This is not security.** The page content is in the HTML that has already
> been sent to the browser, so anyone using view-source, DevTools or `curl` can
> read the site without entering the password. It only stops casual visitors
> from glancing at an unfinished site. Do not put anything confidential behind
> it.

To change the password, generate a new hash and paste it into
`gate.password_hash`:

```bash
echo -n 'your-new-password' | shasum -a 256
```

To switch the gate off, set `gate.enabled: false` — the prompt and its script
are then left out of the built pages entirely.

Notes:
- The unlock lasts for the browser session, so it is entered once, not per page.
- Gated pages carry `noindex, nofollow` so search engines skip them.
- Password checking needs `https` or `localhost` (it uses the browser's crypto
  API), which covers GitHub Pages and local development.
- Consider keeping the GitHub repository private while the gate is up;
  otherwise the content is readable straight from the repo.

## Setup for GitHub Pages

1. Push to GitHub.
2. Go to Settings → Pages and set the source to the `main` branch.
3. Update `_config.yml` with your URL:

   ```yaml
   url: "https://username.github.io"
   baseurl: "/repository-name"     # leave empty for a user/org site
   ```

## Local development

```bash
bundle config set --local path vendor/bundle   # one-off, remembered in .bundle/config
bundle install
bundle exec jekyll serve
```

Visit `http://localhost:4000`.

## Customisation

- **Colours:** the KCL red `#C8102E` and link blue `#2c5282` in
  [assets/css/style.css](assets/css/style.css).
- **Layout:** [_layouts/default.html](_layouts/default.html) (shared header and
  footer), [index.html](index.html), [seminar.html](seminar.html).
- **Password gate:** [assets/js/gate.js](assets/js/gate.js), styled under
  "Password gate" in [assets/css/style.css](assets/css/style.css).
- **Reusable pieces:** [_includes/talk.html](_includes/talk.html) (one talk),
  [_includes/talk_lists.html](_includes/talk_lists.html) (splits talks into
  `upcoming` and `past`), [_includes/people.html](_includes/people.html) (a list
  of people), [_includes/person.html](_includes/person.html) (one person),
  [_includes/news.html](_includes/news.html) (news items) and
  [_includes/section_head.html](_includes/section_head.html) (a section heading
  plus its optional intro).
