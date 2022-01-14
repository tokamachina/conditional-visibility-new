export default {
    // The actor class type is the type of actor that will be used for the default item pile actor that is created on first item drop.
    "ACTOR_CLASS_TYPE": "npc",

    // The item quantity attribute is the path to the attribute on items that denote how many of that item that exists
    "ITEM_QUANTITY_ATTRIBUTE": "data.quantity",

    // Item types and the filters actively remove items from the item pile inventory UI that users cannot loot, such as spells, feats, and classes
    "ITEM_TYPE_ATTRIBUTE": "type",
    "ITEM_TYPE_FILTERS": "spell,feat,class,race,attack,full-attack,buff,aura,alignment,enhancement,damage-type,material",

    // Dynamic attributes are things like currencies or transferable powers that exist as editable number fields on character sheets
    "DYNAMIC_ATTRIBUTES": [
        {
            name: "D35E.CurrencyPP",
            path: "data.currency.pp",
            img: "icons/commodities/currency/coin-inset-snail-silver.webp"
        },
        {
            name: "D35E.CurrencyGP",
            path: "data.currency.gp",
            img: "icons/commodities/currency/coin-embossed-crown-gold.webp"
        },
        {
            name: "D35E.CurrencySP",
            path: "data.currency.sp",
            img: "icons/commodities/currency/coin-engraved-moon-silver.webp"
        },
        {
            name: "D35E.CurrencyCP",
            path: "data.currency.cp",
            img: "icons/commodities/currency/coin-engraved-waves-copper.webp"
        }
    ]
}