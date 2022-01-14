export default {
    // The actor class type is the type of actor that will be used for the default item pile actor that is created on first item drop.
    "ACTOR_CLASS_TYPE": "character",

    // The item quantity attribute is the path to the attribute on items that denote how many of that item that exists
    "ITEM_QUANTITY_ATTRIBUTE": "data.quantity",

    // Item types and the filters actively remove items from the item pile inventory UI that users cannot loot, such as spells, feats, and classes
    "ITEM_TYPE_ATTRIBUTE": "type",
    "ITEM_TYPE_FILTERS": "edge,hindrance,skill,power,ability",

    // Dynamic attributes are things like currencies or transferable powers that exist as editable number fields on character sheets
    "DYNAMIC_ATTRIBUTES": [
        {
            name: "SWADE.Currency",
            path: "data.details.currency",
            img: "icons/svg/coins.svg"
        }
    ]
}