# DOI Manager

DOI Manager retrieves, validates, cleans, and converts DOI names in Zotero. It supports shortDOI conversion, long DOI resolution, DOI validation, Crossref lookup for items without a DOI, processing of newly added items, monthly DOI verification, and result tags.

This repository continues [Zotero DOI Manager](https://github.com/bwiernik/zotero-shortdoi) by Brenton M. Wiernik and incorporates the Zotero 8/9 work by Julius Bairaktaris. It is not an upstream Zotero release.

## Compatibility

- Zotero 8.0
- Zotero 9.0
- Zotero 10.0.*

The extension uses Zotero's bootstrap extension model, `Zotero.MenuManager`, `Zotero.HTTP.request`, item APIs, preference panes, and Fluent localisation.

## Functions

- **Get shortDOIs** retrieves a shortDOI for each selected item and stores it in the DOI field.
- **Get long DOIs** resolves shortDOIs, validates DOI names, and searches Crossref when the DOI field is empty.
- **Verify and clean DOIs** validates DOI names, resolves canonical long DOI names, and removes DOI URL or text prefixes.
- Processing of new items can retrieve shortDOIs, retrieve long DOIs, verify DOI names, or remain disabled.
- **Monthly DOI verification** checks supported top-level items in My Library once per calendar month.
- Result tags identify an invalid DOI, multiple DOI matches, or no DOI match.

## Monthly DOI verification

Monthly verification is enabled by default in version 2.2.0.

DOI Manager checks once per day while Zotero is running. When one calendar month has elapsed since the previous completed monthly verification, DOI Manager runs **Verify and clean DOIs** across supported top-level items in **My Library**.

The monthly task does not open progress windows. If Zotero is closed when the monthly date passes, the task runs after Zotero next starts and the scheduler check occurs. If another DOI Manager operation is running, the monthly task remains due and a later scheduler check can run it.

The completion time is stored in the Zotero preference `extensions.shortdoi.monthly_verify_last_run`. A completed run sets the next due date one calendar month later. Month-end dates are clamped to the final day of the following month; for example, a run on 31 January becomes due on 28 February, or 29 February in a leap year.

To disable monthly verification:

1. Open Zotero preferences.
2. Open the **DOI Manager** preference pane.
3. Clear **Verify all DOIs in My Library every month**.

Monthly verification currently applies to My Library. Group libraries are not included.

## Installation

1. Open the [latest release](https://github.com/reginalluna/zotero-doi-manager/releases/latest).
2. Download `zotero-doi-manager-2.2.0.xpi`.
3. In Zotero, open **Tools → Plugins**.
4. Open the gear menu and select **Install Plugin From File…**.
5. Select the downloaded `.xpi` file.
6. Restart Zotero if requested.

## Use

Select one or more supported library items, right-click the selection, and open **Manage DOIs**.

The DOI Manager preference pane controls processing of new items, monthly verification, and result-tag names. The Zotero **Tools** menu also provides the processing mode for newly added items.

The extension communicates with DOI.org, shortDOI.org, and Crossref. Network access is required for DOI retrieval and validation.

## Updates

The extension manifest reads update metadata from:

`https://github.com/reginalluna/zotero-doi-manager/raw/refs/heads/main/updates.json`

Release packages are published at:

`https://github.com/reginalluna/zotero-doi-manager/releases`

## Development

Requirements: Node.js 20 or later and npm.

```bash
npm install
npm test
npm run xpi
```

`npm test` runs the DOI service, release metadata, and monthly scheduling tests with Node's test runner.

`npm run xpi` writes `dist/zotero-doi-manager-<version>.xpi`.

The GitHub Actions release workflow runs the tests, builds the XPI, and creates the release whose version is declared in `manifest.json` when that file changes on `main`.

## Privacy

When an item has no DOI, bibliographic metadata required for the lookup, including title, author, year, and publication title, can be sent to Crossref. DOI names are sent to DOI.org or shortDOI.org for validation and conversion.

The extension does not send Zotero account credentials, notes, attachments, or annotation contents.

Monthly verification performs the same DOI and Crossref requests as a manual **Verify and clean DOIs** operation across the items it processes.

## Licence and attribution

The upstream-derived source is distributed under the Mozilla Public License 2.0. See `LICENSE`.

Original DOI Manager: Brenton M. Wiernik. Zotero 8/9 work: Julius Bairaktaris. This repository is maintained by `reginalluna`.

## Disclaimer

This is an independent Zotero extension and is not affiliated with or endorsed by the Zotero project, Crossref, or the DOI Foundation.
