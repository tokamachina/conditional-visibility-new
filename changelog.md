# Item Piles Changelog 

## Version 1.1.3
- Adjusted display one-type item piles to also take into account dynamic attributes (gold piles!)
- Fixed prototype tokens not being updated when editing an item pile through its sheet  
- Fixed item piles with both "Is Container" and "Override single item token scale" enabled acting strange - item piles will now prioritize the container images over "Display Single Item Image" when "Is Container" is enabled
- Added warning to point out the above
- Adjusted Item Pile UI to be editable even when not enabled

## Version 1.1.2
- Fixed dropping items onto piles not working when it had an interaction distance of infinite  
- Fixed macro input field in item pile config was incorrectly set to "number" rather than "text"

## Version 1.1.1
- Added support for the Savage Worlds Adventure Edition: <https://foundryvtt.com/packages/swade>
- Fixed linked token actors not acting like they are linked - now all tokens on the canvas with the same linked actor share the same state and image
- Fixed dynamic attributes not being treated as numbers, which caused problems in some systems (such as SWADE) if they were stored as strings

## Version 1.1.0
- Added support for the D&D 3.5 system: <https://foundryvtt.com/packages/D35E>
- Added the ability to click on item names to inspect the items - this can be disabled in the item pile's settings
- Hooks that previously only returned the UUID of a given document now actually provides the document itself 
- Hooks added:
  - `item-piles-preRattleItemPile` - Called locally before a locked item pile is attempted to be opened 
  - `item-piles-rattleItemPile` - Called for everyone after a locked item pile was attempted to be opened
  - `item-piles-preOpenItemPileInventory` - Called locally before an item pile's inventory is opened
  - `item-piles-openItemPileInventory` - Called locally after an item pile's inventory has been opened
- API changes:
    - Changed `ItemPiles.API.turnTokenIntoItemPile` to `ItemPiles.API.turnTokensIntoItemPiles`, now can take array of tokens to turn into piles
    - Changed `ItemPiles.API.revertTokenFromItemPile` to `ItemPiles.API.revertTokensFromItemPiles`, now can take array of tokens to revert
- Improved token detection when multiple owned tokens are interacting with item piles, it should now more reliably pick sane tokens.
  - Now picks in order: controlled token -> last selected token -> the closest owned token.
- Improved module speed when interacting with item piles
- Improved item pile token image and scale updates, should be a bit more stable 
- Added warning when no GM is connected when interacting with piles

## Version 1.0.9
- Fixed module settings would stay blank even on a recognized game system

## Version 1.0.8
- Fixed item pile token image not being updated when first creating a new item pile
- Fixed item piles acting as non-empty when attributes were incorrectly configured
- Fixed the `Take All Items` button not taking items from item piles

## Version 1.0.7
- Fixed module being broken

## Version 1.0.6
- Added API endpoints:
    - `ItemPiles.API.getItemPileItemTypeFilters(TokenDocument|Actor)` - Returns the item type filters for a given item pile
    - `ItemPiles.API.getItemPileItems(TokenDocument|Actor, Array|Boolean)` - Returns the items the item pile contains and can transfer
- Updated japanese localization
- Fixed item piles not respecting item type filters
- Fixed issue with `ItemPiles.API.turnTokenIntoItemPile` not actually turning the token into an item pile
- Fixed issues with item pile tokens sometimes switching to their actors image when they were empty

## Version 1.0.5
- Added french localization
- Added german localization
- Added warning if no system match was found
- Added dialog for users who installed Item Piles before their system became supported 
- Fixed issue with Item Piles throwing an error with tokens whose actors had been deleted

## Version 1.0.4
- Fixed non-GMs being able to turn their characters into loot piles
- Fixed disabling loot piles would also disable the save button
- Added warning when turning a linked actor into an item pile 

## Version 1.0.3
- Fixed dropping items from compendiums

## Version 1.0.2
- Fixed issue where if an item pile was updated, it would break the ability for players to open the pile
- Fixed localization issue when an item pile was too far away from a player

## Version 1.0.1
- Added Pathfinder 1 system support
- Added Japanese localization
- Added localization support to dynamic attribute names
- Tweaked DND5e attributes to be localized (you'll need to reset Item Piles' settings)
- Fixed issue where updating the Item Pile configuration on an actor would throw an error
- Fixed formatting issue on one of the dialogs
- Fixed issue where some players could not open Item Piles after creating them

## Version 1.0.0
- First public version