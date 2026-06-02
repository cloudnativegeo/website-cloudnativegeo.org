# Contributing to the CNG Website

We welcome contributions of blog posts to this site using the following editorial guidelines.

## What we're looking for

**Evergreen topics** - We are always open to content about new ways of using geospatial data, case studies that show the benefits of using cloud-native approaches, technical tutorials, open-source tools, best practices in geospatial data management, and tools that help data users share, access, and work with geospatial data more effectively.

**Current priorities** - This year, we are also interested in blog posts that address the following common community challenges that we've identified:

- Education and workforce development
- Ways to simplify data licensing to accelerate data usage
- Creating better shared data resources
- Ways to improve government partnerships
- Sustainable funding models for collaborative projects
- Marketing to communicate the value of cloud-native approaches

**Tone** - Collaborative and community-centric. Always try to include ways that readers can engage and contribute to your topic.

**Length** - 700-1,500 words, depending on the complexity of the topic.

**Visuals** - We encourage visuals such as relevant diagrams, screenshots, or code snippets where appropriate to make the content more visually engaging. We will not include decorative imagery or stock photography.

**Avoid** - Pitching products or approaches without showing clear value to the community and ways that they can contribute to it. Note that CNG Commercial Members are eligible to publish one branded blog post per year, and they should still follow the spirit of these guidelines.

## Blog submission process

1. **Propose blog topic**
   Create an issue in GitHub using the "Blog Post Proposal for Writers" issue template at [github.com/cloudnativegeo/cloudnativegeo.org/issues](https://github.com/cloudnativegeo/cloudnativegeo.org/issues).

2. **Board discussion / voting**
   Get approval from the Board — at least two CNG Board members must approve the proposal. Board members may vote as follows by commenting on the GitHub issue:
   - `+1` indicates strong support and a willingness to help implement the proposal.
   - `+0` indicates mild support, but has no effect.
   - `0` indicates no opinion and has no effect.
   - `-0` indicates mild disagreement, but has no effect.
   - `-1` indicates opposition and acts as a veto; however, the voter must provide clear reasoning and suggest alternate solutions.

   Two +1's will mark the blog proposal as accepted.

3. **Write blog post**

   Write your blog post. You can either:
   - Directly submit a PR for your blog at https://github.com/cloudnativegeo/cloudnativegeo.org/pulls.
   - Write it in a Google Doc if you anticipate needing a lot of feedback. 

5. **Seeking board review / submit a pull request**
   - After writing, if you went the Google Doc route, share your Google Doc with the CNG Editorial Board via email: editorial-board@cloudnativegeo.org 
   - If you are directly submitting the PR, add the board members who approved your blog post submission as reviewers.

Whether you submit your PR immediately or after receiving feedback on the Google Doc version of your blog post, here is the process for submitting the PR: 
   - Create a pull request at [https://github.com/cloudnativegeo/cloudnativegeo.org/pulls](https://github.com/cloudnativegeo/cloudnativegeo.org/pulls).
   - Do this by creating a branch / forking the repository and editing your own fork.
   - Markdown content for the blog belongs in the ‎content/blog/ section of the repository.
   - The file should be named “YYMMDD-name-of-desired-blog-url.md”
   - Any photos for the blog should be located at “assets/images” and use the naming convention “YYMMDD-name-of-photo”
 

5. **Final approval and publishing**
   Once the PR is approved, your post will be published on the CNG blog.

## Event agendas

Event pages can carry a structured agenda in their front matter. It renders as a branded three-column table — time · talk · speaker — via `layouts/partials/agenda.html`, with styling in `assets/css/main.css` (the `.agenda` rules). Authors write data only; there is no HTML or CSS in the content file. `hugo new events/<file>.md` scaffolds the skeleton from `archetypes/events.md`.

The `agenda` key is a list of blocks. Each block has an optional `section` heading (and optional `note`) plus a list of `items`. Each item has an optional `time`, a required `title`, an optional `description` (plain text), and an optional `speakers` list of `{ name, affiliation }`. An item with no `speakers` renders as a muted break row (lunch, coffee, reception); a `speakers` list with more than one entry renders as a panel.

```yaml
agenda:
  - section: "Morning session"
    note: "15-minute talks + 5 minutes Q&A"
    items:
      - time: "09:15"
        title: "A World Without Public Data"
        description: "An overview of innovations made possible by public data."
        speakers:
          - name: "Craig Mills"
            affiliation: "WRI"
      - time: "10:30"
        title: "Coffee break"
  - section: "Panel discussion"
    items:
      - time: "15:00"
        title: "More is Different"
        speakers:
          - name: "David Eaves"
            affiliation: "University College London"
          - name: "Jack Kelly"
            affiliation: "dynamical.org"
```

Titles, names, and descriptions are emitted as plain text (HTML is escaped automatically), so write them literally — `Q&A`, not `Q&amp;A`. Descriptions don't currently render inline Markdown such as links; keep them to a single plain sentence.
