// Zotero 8+ bootstrap: Zotero, Services, Cc, Ci are available in this scope.

var ShortDOI;
var DoiService;
var DoiHttp;
var DoiUpdater;
var Menus;
var chromeHandle;

const FTL_FILE = "zoteroshortdoi.ftl";

function log(msg) {
  Zotero.debug(`DOI Manager: ${msg}`);
}

async function install() {
  await Zotero.initializationPromise;
  log("Installed");
}

async function startup({ resourceURI, rootURI = resourceURI.spec }) {
  await Zotero.initializationPromise;
  log("Starting");

  const aomStartup = Cc["@mozilla.org/addons/addon-manager-startup;1"]
    .getService(Ci.amIAddonManagerStartup);
  const manifestURI = Services.io.newURI(`${rootURI}manifest.json`);
  chromeHandle = aomStartup.registerChrome(manifestURI, [
    ["content", "zoteroshortdoi", "content/"],
    ["locale", "zoteroshortdoi", "en-US", "locale/en-US/"],
    ["locale", "zoteroshortdoi", "de", "locale/de/"],
  ]);

  Services.scriptloader.loadSubScript(`${rootURI}lib/doi-service.js`);
  Services.scriptloader.loadSubScript(`${rootURI}lib/doi-http.js`);
  Services.scriptloader.loadSubScript(`${rootURI}lib/doi-updater.js`);
  Services.scriptloader.loadSubScript(`${rootURI}lib/menus.js`);
  Services.scriptloader.loadSubScript(`${rootURI}zoteroshortdoi.js`);

  setDefaultPrefs(rootURI);

  Zotero.PreferencePanes.register({
    pluginID: "zoteroshortdoi@wiernik.org",
    src: `${rootURI}content/options.xhtml`,
  });

  for (const win of Zotero.getMainWindows()) {
    if (win.MozXULElement) win.MozXULElement.insertFTLIfNeeded(FTL_FILE);
  }

  ShortDOI.init();
  log("Startup complete");
}

function setDefaultPrefs(rootURI) {
  const branch = Services.prefs.getDefaultBranch("");
  const obj = {
    pref(pref, value) {
      switch (typeof value) {
        case "boolean":
          branch.setBoolPref(pref, value);
          break;
        case "string":
          branch.setStringPref(pref, value);
          break;
        case "number":
          branch.setIntPref(pref, value);
          break;
        default:
          Zotero.logError(`Invalid type '${typeof value}' for pref '${pref}'`);
      }
    },
  };
  Services.scriptloader.loadSubScript(`${rootURI}prefs.js`, obj);
}

function onMainWindowLoad({ window }) {
  window.MozXULElement.insertFTLIfNeeded(FTL_FILE);
}

function shutdown() {
  log("Shutting down");
  if (ShortDOI) ShortDOI.shutdown();
  if (chromeHandle) {
    chromeHandle.destruct();
    chromeHandle = null;
  }
  ShortDOI = undefined;
  Menus = undefined;
  DoiUpdater = undefined;
  DoiHttp = undefined;
  DoiService = undefined;
}

function uninstall() {
  log("Uninstalled");
}
