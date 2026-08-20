/**
 * DOI validation, normalisation, URL construction, and response parsing.
 */

const API_URLS = Object.freeze({
  SHORT_DOI: "https://shortdoi.org/",
  DOI_API: "https://doi.org/api/handles/",
  CROSSREF: "https://www.crossref.org/openurl?pid=zoteroDOI@wiernik.org&",
});

const SHORT_DOI_PATTERN = /10\/[^\s]*[^\s.,]/;

const SUPPORTED_ITEM_TYPES = Object.freeze([
  "journalArticle",
  "conferencePaper",
  "book",
  "bookSection",
  "report",
  "thesis",
  "preprint",
  "dataset",
  "document",
  "presentation",
  "standard",
  "encyclopediaArticle",
  "dictionaryEntry",
  "magazineArticle",
  "newspaperArticle",
]);

function isShortDoi(doi) {
  return typeof doi === "string" && SHORT_DOI_PATTERN.test(doi);
}

function buildDoiLookupUrl(rawDoi, operation) {
  if (!rawDoi) return null;
  if (typeof rawDoi !== "string") return { kind: "invalid" };

  const cleaned = Zotero.Utilities.cleanDOI(rawDoi);
  if (!cleaned) return { kind: "invalid" };

  const url =
    operation === "short" && !isShortDoi(cleaned)
      ? `${API_URLS.SHORT_DOI}${encodeURIComponent(cleaned)}?format=json`
      : `${API_URLS.DOI_API}${encodeURIComponent(cleaned)}`;

  return { kind: "lookup", url };
}

function buildCrossrefUrl(contextObject) {
  return `${API_URLS.CROSSREF}${contextObject}&multihit=true`;
}

function buildCrossrefLinkUrl(contextObject) {
  return `${API_URLS.CROSSREF}${contextObject}`;
}

function parseShortDoiResponse(response) {
  const value = (response.ShortDOI || response.handle || "").toLowerCase();
  return value || null;
}

function parseLongDoiResponse(response, fromShortDoi) {
  if (response.responseCode !== 1) {
    return { ok: false, reason: "invalid" };
  }

  const longDoi =
    fromShortDoi && response.values?.["1"]?.data?.value
      ? response.values["1"].data.value.toLowerCase()
      : (response.handle || "").toLowerCase();

  return longDoi
    ? { ok: true, doi: longDoi }
    : { ok: false, reason: "missing" };
}

function parseCheckDoiResponse(response, existingDoi) {
  if (response.responseCode === 200) return { kind: "invalid" };
  if (!response.handle) return { kind: "invalid" };
  if (response.handle === existingDoi) return { kind: "unchanged" };
  return { kind: "updated", doi: response.handle.toLowerCase() };
}

function parseCrossrefResponse(responseXml) {
  const query = responseXml.getElementsByTagName("query")[0];
  if (!query) return { status: "unknown" };

  const status = query.getAttribute("status");

  if (status === "resolved") {
    const doi = query.getElementsByTagName("doi")[0]?.childNodes[0]?.nodeValue;
    return doi ? { status: "resolved", doi } : { status: "unknown" };
  }

  if (status === "unresolved" || status === "multiresolved") {
    return { status };
  }

  return { status: "unknown" };
}

var DoiService = Object.freeze({
  API_URLS,
  SUPPORTED_ITEM_TYPES,
  isShortDoi,
  buildDoiLookupUrl,
  buildCrossrefUrl,
  buildCrossrefLinkUrl,
  parseShortDoiResponse,
  parseLongDoiResponse,
  parseCheckDoiResponse,
  parseCrossrefResponse,
});
