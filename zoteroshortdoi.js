const MONTHLY_VERIFY_PREF = "extensions.shortdoi.monthly_verify";
const MONTHLY_VERIFY_LAST_RUN_PREF = "extensions.shortdoi.monthly_verify_last_run";
const MONTHLY_VERIFY_CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000;

function nextMonthlyRun(lastRun) {
  const previous = new Date(lastRun);
  const year = previous.getUTCFullYear();
  const month = previous.getUTCMonth();
  const day = previous.getUTCDate();
  const hour = previous.getUTCHours();
  const minute = previous.getUTCMinutes();
  const second = previous.getUTCSeconds();
  const millisecond = previous.getUTCMilliseconds();
  const lastDayOfNextMonth = new Date(Date.UTC(year, month + 2, 0)).getUTCDate();

  return new Date(
    Date.UTC(
      year,
      month + 1,
      Math.min(day, lastDayOfNextMonth),
      hour,
      minute,
      second,
      millisecond
    )
  );
}

function isMonthlyVerificationDue(lastRun, now = new Date()) {
  if (!lastRun) return true;
  const previous = new Date(lastRun);
  if (Number.isNaN(previous.getTime())) return true;
  return now >= nextMonthlyRun(lastRun);
}

ShortDOI = {
  notifierID: null,
  menuHandle: null,
  monthlyVerifyTimer: null,

  init() {
    this.notifierID = Zotero.Notifier.registerObserver(
      this.notifierCallback,
      ["item"],
      "shortdoi"
    );

    this.menuHandle = Menus.registerMenus((operation) =>
      this.updateSelectedItems(operation)
    );

    this.startMonthlyVerification();
  },

  shutdown() {
    if (this.notifierID) {
      Zotero.Notifier.unregisterObserver(this.notifierID);
      this.notifierID = null;
    }
    if (this.menuHandle) {
      this.menuHandle.unregister();
      this.menuHandle = null;
    }
    if (this.monthlyVerifyTimer) {
      this.monthlyVerifyTimer.cancel();
      this.monthlyVerifyTimer = null;
    }
  },

  notifierCallback: {
    notify(event, type, ids) {
      if (event !== "add") return;
      const autoretrieve = Zotero.Prefs.get(
        "extensions.shortdoi.autoretrieve",
        true
      );
      if (!autoretrieve || autoretrieve === "none") return;
      DoiUpdater.updateItems(Zotero.Items.get(ids), autoretrieve);
    },
  },

  updateSelectedItems(operation) {
    const pane = Zotero.getActiveZoteroPane();
    if (!pane) return;
    DoiUpdater.updateItems(pane.getSelectedItems(), operation);
  },

  startMonthlyVerification() {
    this.maybeRunMonthlyVerification();
    this.monthlyVerifyTimer = Cc["@mozilla.org/timer;1"].createInstance(Ci.nsITimer);
    this.monthlyVerifyTimer.initWithCallback(
      () => this.maybeRunMonthlyVerification(),
      MONTHLY_VERIFY_CHECK_INTERVAL_MS,
      Ci.nsITimer.TYPE_REPEATING_SLACK
    );
  },

  async maybeRunMonthlyVerification() {
    if (!Zotero.Prefs.get(MONTHLY_VERIFY_PREF, true)) return;

    const lastRun = Zotero.Prefs.get(MONTHLY_VERIFY_LAST_RUN_PREF, true) || "";
    if (!isMonthlyVerificationDue(lastRun)) return;

    try {
      const items = await Zotero.Items.getAll(Zotero.Libraries.userLibraryID, true);
      const completed = await DoiUpdater.updateItems(items, "check", { silent: true });
      if (completed) {
        Zotero.Prefs.set(MONTHLY_VERIFY_LAST_RUN_PREF, new Date().toISOString(), true);
        Zotero.debug(`DOI Manager: monthly DOI verification completed for ${items.length} items`);
      }
    } catch (error) {
      Zotero.debug(`DOI Manager: monthly DOI verification failed: ${error}`);
    }
  },
};
