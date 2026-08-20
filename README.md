# DOI Manager

DOI Manager retrieves, validates, cleans, and converts DOI names in Zotero. It supports shortDOI conversion, long DOI resolution, DOI validation, Crossref lookup for items without a DOI, automatic processing of newly added items, monthly DOI verification, and configurable result tags.

This repository is an independent continuation of [Zotero DOI Manager](https://github.com/bwiernik/zotero-shortdoi) by Brenton M. Wiernik and incorporates the Zotero 8/9 modernisation by Julius Bairaktaris. It is not an official upstream release.

## Compatibility

- Zotero 8.0
- Zotero 9.0
- Zotero 10.0.*

The Zotero 10 compatibility range follows Zotero's current plug-in guidance. Zotero 10 uses the same Firefox 140 ESR base as Zotero 9, and this code does not use the Zotero 10 APIs identified as removed or changed for collection selection or the local HTTP server.

## Functions

- **Get shortDOIs** retrieves a shortDOI for each selected item and stores it in the DOI field.
- **Get long DOIs** resolves shortDOIs, validates existing DOI names, and searches Crossref when the DOI field is empty.
- **Verify and clean DOIs** validates stored DOI names, resolves canonical long DOI names, and removes DOI URL or text prefixes.
- Automatic processing can retrieve, convert, or validate DOIs for newly added supported items.
- **Monthly DOI verification** checks all supported top-level items in My Library once each calendar month. DOI Manager checks the schedule once per day while Zotero is running and performs the monthly verification without opening progress windows.
- Configurable tags indicate an invalid DOI, multiple possible matches, or no DOI match.

## Installation

1. Download `zotero-doi-manager-2.2.0.xpi` from the latest release.
2. In Zotero, open **Tools → Plugins**.
3. Select the gear menu and choose **Install Plugin From File…**.
4. Select the downloaded `.xpi` file.
5. Restart Zotero if requested.

Releases: https://github.com/reginalluna/zotero-doi-manager/releases/latest

## Use

Select one or more supported library items, right-click the selection, and open **Manage DOIs**. Automatic processing can be configured from the DOI Manager preference pane and the Zotero Tools menu.

Monthly DOI verification is enabled by default. In the DOI Manager preference pane, clear **Verify all DOIs in My Library every month** to disable it. The first automatic verification runs after the updated plug-in starts if no previous monthly verification timestamp exists. After a successful run, the next run becomes due one calendar month later.

The plug-in communicates with the DOI Handle API, shortDOI service, and Crossref OpenURL service. Network access is required for DOI retrieval and validation.

## Development

Requirements: Node.js 20 or later and npm.

```bash
npm install
npm test
npm run xpi
```

`npm run xpi` writes `dist/zotero-doi-manager-<version>.xpi`. Tests use Node's built-in test runner. A release workflow runs the tests, builds the XPI, and publishes the version from `manifest.json` when that file changes on `main`.

## Privacy

Bibliographic metadata required for a DOI query, such as title, author, year, and publication title, is sent to Crossref when an item has no stored DOI. Existing DOI names are sent to DOI.org or shortDOI.org for validation and conversion. The plug-in does not transmit Zotero account credentials, notes, attachments, or annotation contents.

## Licence and attribution

The upstream-derived source is distributed under the Mozilla Public License 2.0. See `LICENSE`.

Original DOI Manager: Brenton M. Wiernik. Zotero 8/9 modernisation: Julius Bairaktaris. This repository is maintained independently by `reginalluna`.

## Disclaimer

This is an independent Zotero plug-in and is not affiliated with or endorsed by the Zotero project, Crossref, or the DOI Foundation.
