const REQUEST_TIMEOUT_MS = 30_000;

async function fetchJsonOrDoc(url, responseType) {
  try {
    const xhr = await Zotero.HTTP.request("GET", url, {
      responseType,
      timeout: REQUEST_TIMEOUT_MS,
      successCodes: [200],
    });
    const response = responseType === "json" ? xhr.response : xhr.responseXML;
    return { status: "ok", response };
  } catch (error) {
    if (error instanceof Zotero.HTTP.UnexpectedStatusException) {
      const code = error.xmlhttp?.status;
      if (code === 400 || code === 404) {
        return { status: "invalid" };
      }
    }
    return { status: "error", error };
  }
}

function fetchDoiHandle(url) {
  return fetchJsonOrDoc(url, "json");
}

function fetchCrossref(url) {
  return fetchJsonOrDoc(url, "document");
}

var DoiHttp = Object.freeze({
  fetchDoiHandle,
  fetchCrossref,
});
