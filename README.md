# Conditional Visibility

![Latest Release Download Count](https://img.shields.io/github/downloads/p4535992/conditional-visibility-new/latest/module.zip?color=2b82fc&label=DOWNLOADS&style=for-the-badge) 

[![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fconditional-visibility&colorB=006400&style=for-the-badge)](https://forge-vtt.com/bazaar#package=conditional-visibility) 

![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fp4535992%2Fconditional-visibility%2Fmaster%2Fsrc%2Fmodule.json&label=Foundry%20Version&query=$.compatibleCoreVersion&colorB=orange&style=for-the-badge)

![Latest Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fp4535992%2Fconditional-visibility%2Fmaster%2Fsrc%2Fmodule.json&label=Latest%20Release&prefix=v&query=$.version&colorB=red&style=for-the-badge)

[![Foundry Hub Endorsements](https://img.shields.io/endpoint?logoColor=white&url=https%3A%2F%2Fwww.foundryvtt-hub.com%2Fwp-json%2Fhubapi%2Fv1%2Fpackage%2Fconditional-visibility%2Fshield%2Fendorsements&style=for-the-badge)](https://www.foundryvtt-hub.com/package/conditional-visibility-new/)

![GitHub all releases](https://img.shields.io/github/downloads/p4535992/conditional-visibility-new/total?style=for-the-badge)

Invisible Stalkers should only be seen by players that have cast See Invisibility.  Stealthy Goblins should only be seen by players with high perception.
And when that Drow casts Darkness, players should need Devil's Sight to see any tokens inside.

Conditional Visibility allows you to set conditions on tokens that will display them only to players whose senses meet the conditions necessary to see
the token.

## Installation

It's always easiest to install modules from the in game add-on browser.

To install this module manually:
1.  Inside the Foundry "Configuration and Setup" screen, click "Add-on Modules"
2.  Click "Install Module"
3.  In the "Manifest URL" field, paste the following url:
`https://raw.githubusercontent.com/p4535992/conditional-visibility-new/master/src/module.json`
4.  Click 'Install' and wait for installation to complete
5.  Don't forget to enable the module in game using the "Manage Module" button

### libWrapper

This module uses the [libWrapper](https://github.com/ruipin/fvtt-lib-wrapper) library for wrapping core methods. It is a hard dependency and it is recommended for the best experience and compatibility with other modules.

### socketlib

This module uses the [socketlib](https://github.com/manuelVo/foundryvtt-socketlib) library for wrapping core methods. It is a hard dependency and it is recommended for the best experience and compatibility with other modules.

### levels (optional but it should work)

This module uses the [levels](https://github.com/theripper93/Levels) library. It is a optional but suggested dependency and it is recommended for the best experience and compatibility with other modules.

## Usage

A usage documentation is reachable [here](./wiki/tutorial.md)
### Conditions and sense combination by system default

#### [System Dnd5e](./wiki/table_dnd5e.md)
#### [System Pathfinder 2e](./wiki/table_pf2e.md)
#### Did you want ot help with your system prepare some table like the one i do it for Dnd5e for help me to define some rule for your system

## Features

### [Removed we manage everything with Active effects] Hidden (currently 5e only)

When the hidden condition is selected, a stealth roll is automatically made, which can be customized before closing. The token will only be seen by a token whose passive perception exceeds that stealth roll.
#### [Removed we manage everything with Active effects] Auto-applied from Stealth Rolls

Conditional Visibility contains an setting to auto-apply the hidden condition based on a stealth roll. Currently only 5e; again, contributions for other systems are welcomed.

When this setting is true, then rolling stealth from that token's character sheet will apply the hidden condition based on the value of that roll.

### Integration with [Shared vision](https://github.com/CDeenen/SharedVision/)

The module just wrap on `wrapper` mode this two method `SightLayer.prototype.testVisibility` and `SightLayer.prototype.tokenVision` so it should be no conflict with the levels module.

### Integration with [Levels](https://github.com/theripper93/Levels)

The module just wrap on `wrapper` mode this two method `SightLayer.prototype.testVisibility` and `SightLayer.prototype.tokenVision` so it should be no conflict with the levels module.

### Integration with [DFreds Convenient Effects](https://github.com/DFreds/dfreds-convenient-effects)

documentation work in progress, but is basically all automatic so it should work all senses and conditions are present on the graphic ui of this module.

### [On developing or maybe never...] Integration with [Combat utility belt](https://github.com/death-save/combat-utility-belt)

## Api

The API documentation is reachable here [API](./wiki/api.md)

## Features

## Note for Combat Utility Belt Users
If you use Combat Utility Belt and check "Remove Default Status Effects," it will remove those Status Effects necessary for this module to function.  They can be re-added using Combat Utility Belt's Condition Lab:

![Example: Adding Unknown](./wiki/images/95407444-06d6a880-08eb-11eb-9478-6401fc1d02f8.png)

If each condition is added to the CUB set, Conditional Visibility will again function, even if CUB has removed the default set.  The pairs would be:

| image | effectId | image path | 
| --- | --- | --- |
| <img src="https://raw.githubusercontent.com/p4535992/conditional-visibility-new/main/src/icons/hidden.svg" alt="" style="height: 50px; width:50px; background: #454545;"/> | Hidden | modules/conditional-visibility-new/icons/newspaper.svg | 
| <img src="https://raw.githubusercontent.com/p4535992/conditional-visibility-new/main/src/icons/invisible.svg" alt="" style="height: 50px; width:50px; background: #454545;"/> | Invisible | modules/conditional-visibility-new/icons/unknown.svg | 
| <img src="https://raw.githubusercontent.com/p4535992/conditional-visibility-new/main/src/icons/obscured.svg" alt="" style="height: 50px; width:50px; background: #454545;"/> | Obscured | modules/conditional-visibility-new/icons/foggy.svg | 
| <img src="https://raw.githubusercontent.com/p4535992/conditional-visibility-new/main/src/icons/indarkness.svg" alt="" style="height: 50px; width:50px; background: #454545;"/> | In Darkness | modules/conditional-visibility-new/icons/moon.svg | 

## [Changelog](./CHANGELOG.md)

## Issues

Any issues, bugs, or feature requests are always welcome to be reported directly to the [Issue Tracker](https://github.com/p4535992/conditional-visibility-new/issues ), or using the [Bug Reporter Module](https://foundryvtt.com/packages/bug-reporter/).

## License

This package is under an [MIT license](LICENSE) and the [Foundry Virtual Tabletop Limited License Agreement for module development](https://foundryvtt.com/article/license/).

## Acknowledgements

Bootstrapped with League of Extraordinary FoundryVTT Developers  [foundry-vtt-types](https://github.com/League-of-Foundry-Developers/foundry-vtt-types).

**Icons by**

* unknown.svg, newspaper.svg, and foggy.svg icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a>, from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
* moon.svg icon made by <a href="https://www.flaticon.com/authors/iconixar" title="iconixar">iconixar</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>

## Credit

Thanks to anyone who helps me with this code! I appreciate the user community's feedback on this project!

Very special ty to [Szefo09](https://github.com/szefo09) for make a full operational patch for Dnd5e with FoundryVtt 0.8.6 and 9

Very special ty to [Teshynil](https://github.com/Teshynil) for make many and many test with bug fix
