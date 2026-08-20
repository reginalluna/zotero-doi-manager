const PLUGIN_ID = "zoteroshortdoi@wiernik.org";

const MENU_IDS = Object.freeze({
  ITEMS: "shortdoi-items-menu",
  TOOLS: "shortdoi-tools-menu",
});

const AUTORETRIEVE_OPTIONS = Object.freeze(["short", "long", "check", "none"]);
const SELECTED_MARKER = "✓ ";
const UNSELECTED_MARKER = "    ";

function getAutoretrievePref() {
  return Zotero.Prefs.get("extensions.shortdoi.autoretrieve", true);
}

function setAutoretrievePref(value) {
  Zotero.Prefs.set("extensions.shortdoi.autoretrieve", value, true);
}

function buildAutoretrieveItem(option) {
  return {
    menuType: "menuitem",
    l10nID: `zoteroshortdoi-tools-autoretrieve-${option}`,
    onShowing: (_event, context) => {
      const isSelected = getAutoretrievePref() === option;
      context.setL10nArgs(
        JSON.stringify({ marker: isSelected ? SELECTED_MARKER : UNSELECTED_MARKER })
      );
    },
    onCommand: () => setAutoretrievePref(option),
  };
}

function buildItemsMenu(dispatch) {
  return [
    {
      menuType: "submenu",
      l10nID: "zoteroshortdoi-menu-manage",
      onShowing: (_event, context) => {
        const pane = Zotero.getActiveZoteroPane();
        const items = pane?.getSelectedItems() ?? [];
        context.setVisible(items.some((item) => item.isRegularItem?.()));
      },
      menus: [
        {
          menuType: "menuitem",
          l10nID: "zoteroshortdoi-menu-short",
          onCommand: () => dispatch("short"),
        },
        {
          menuType: "menuitem",
          l10nID: "zoteroshortdoi-menu-long",
          onCommand: () => dispatch("long"),
        },
        {
          menuType: "menuitem",
          l10nID: "zoteroshortdoi-menu-check",
          onCommand: () => dispatch("check"),
        },
      ],
    },
  ];
}

function buildToolsMenu() {
  return [
    {
      menuType: "submenu",
      l10nID: "zoteroshortdoi-tools-autoretrieve",
      menus: AUTORETRIEVE_OPTIONS.map(buildAutoretrieveItem),
    },
  ];
}

function registerMenus(dispatch) {
  const itemsId = Zotero.MenuManager.registerMenu({
    menuID: MENU_IDS.ITEMS,
    pluginID: PLUGIN_ID,
    target: "main/library/item",
    menus: buildItemsMenu(dispatch),
  });

  const toolsId = Zotero.MenuManager.registerMenu({
    menuID: MENU_IDS.TOOLS,
    pluginID: PLUGIN_ID,
    target: "main/menubar/tools",
    menus: buildToolsMenu(),
  });

  return {
    unregister() {
      if (itemsId) Zotero.MenuManager.unregisterMenu(itemsId);
      if (toolsId) Zotero.MenuManager.unregisterMenu(toolsId);
    },
  };
}

var Menus = Object.freeze({ registerMenus });
