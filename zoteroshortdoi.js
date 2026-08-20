ShortDOI = {
  notifierID: null,
  menuHandle: null,

  init() {
    this.notifierID = Zotero.Notifier.registerObserver(
      this.notifierCallback,
      ["item"],
      "shortdoi"
    );

    this.menuHandle = Menus.registerMenus((operation) =>
      this.updateSelectedItems(operation)
    );
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
};
