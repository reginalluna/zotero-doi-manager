# DOI Manager for Zotero 9

DOI Manager for Zotero 9 retrieves, validates, cleans, and converts DOI names for journal articles and conference papers in Zotero 9.

This package is an independent Zotero 9 compatibility port of [Zotero DOI Manager](https://github.com/bwiernik/zotero-shortdoi) by Brenton M. Wiernik. It is not an official upstream release.

## Functions

- **Get shortDOIs** retrieves a shortDOI for each selected item and stores it in the DOI field.
- **Get long DOIs** resolves shortDOIs, validates existing DOI names, and searches Crossref when the DOI field is empty.
- **Verify and clean DOIs** validates stored DOI names, resolves canonical long DOI names, and removes prefixes such as `doi:` and `https://doi.org/`.
- Automatic processing can be enabled for newly added journal articles and conference papers.
- Configurable automatic tags indicate an invalid DOI, multiple possible matches, or no DOI match.

## Compatibility

- Zotero 9.0.x

## Installation

1. Download `zotero-doi-manager-z9-2.0.0.xpi`.
2. In Zotero, open **Tools → Plugins**.
3. Select the gear menu and choose **Install Plugin From File…**.
4. Select the downloaded `.xpi` file.
5. Restart Zotero if requested.

## Use

Select one or more journal articles or conference papers, right-click the selection, and open **Manage DOIs**.

The plugin communicates with the DOI Handle API, shortDOI service, and Crossref REST API. Network access is therefore required for DOI retrieval and validation.

## Privacy

Bibliographic metadata needed for a DOI query, such as title, author, year, and publication title, is sent to Crossref when an item has no stored DOI. Existing DOI names are sent to DOI.org or shortDOI.org for validation and conversion. The plugin does not transmit Zotero account credentials, notes, attachments, or annotation contents.


## Disclaimer

This is an independent Zotero plugin and is not affiliated with or endorsed by the Zotero project, Crossref, or the DOI Foundation.
