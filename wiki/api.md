# API

**This old API is been removed**

~~New to version 0.0.8, script entry points are created for macro and script authors.  The following methods are supported:~~

~~`ConditionalVisibility.help()`~~
~~(GM only) pops up a dialog showing the current system, available conditions, and configuration status.~~

~~`ConditionalVisibility.setCondition(tokens, condition, value)`~~
~~* tokens - an array of tokens to affect~~
~~* condition - the name of the condition, e.g. invisible or indarkness.  You can check the available names for your system in the `help()` dialog.~~
~~* value true to turn the condition on, false to turn it off~~

~~For example, if you want to set all the selected tokens invisible:~~
~~`ConditionalVisibility.setCondition(canvas.tokens.controlled, 'invisible', true)`~~

~~`ConditionalVisibility.hide(tokens, value)`~~
~~* tokens - a list of tokens to affect~~
~~* value - optional; a flat value to apply to all tokens.  If not specified, each token will make system-specific roll.~~
~~The *hidden* condition requires system specific rules, and so uses a different set of methods.  Note this is only available on systems that have these rules developed, currently only D&D 5e.  Issues or contributions for other issues are welcome.~~

~~`ConditionalVisibility.unHide(tokens)`~~
~~* tokens - a list of tokens from which to remove the hidden condition.~~

This api is redundant it can be easily replace from other macros or modules, is advisable to use other module like [CUB](https://github.com/death-save/combat-utility-belt) or [Dfred convenient effects](https://github.com/DFreds/dfreds-convenient-effects/)

## Setting members

<dl>
<dt><a href="#SENSES">SENSES</a> ⇒ <code>array</code></dt>
<dd><p>The senses used in this system</p></dd>
<dt><a href="#CONDTIONS">CONDITIONS</a> ⇒ <code>array</code></dt>
<dd><p>The conditions used in this system</p></dd>
</dl>


## Setting Functions

Work in progress...

## Conditional Visibility Functions

~~### ConditionalVisibility.setCondition(tokenNameOrId: string, effectId: string, distance: number) ⇒ <code>Promise.&lt;void&gt;</code>~~

**NOTE: This is deprecated use instead `ConditionalVisibility.API.setCondition(tokenNameOrId: string, effectId: string, distance: number) ⇒ <code>Promise<void></code>` **

Add a active effect for work with the module, the `effectId` parameter must be present on the [table](./tables.md) associated to the system.

**Returns**: <code>Promise.&lt;void&gt;</code> - A empty promise

| Param | Type | Description | Default |
| --- | --- | --- | --- |
| tokenNameOrId | <code>string</code> | The name or the id of the token | <code>undefined</code> |
| effectNameOrId | <code>string</code> | The effect name or id used from this module, must be present on the [table](./tables.md) of this system  | <code>undefined</code> |
| disabled | <code>boolean</code> | The effect must be applied, but disabled | <code>false</code> |
| distance | <code>number</code> | OPTIONAL: explicit distance in units not grid to add to the Active Effects | <code>0</code> |
| visionLevelValue | <code>number</code> | OPTIONAL: explicit distance in units not grid to add to the Active Effects | <code>0</code> |


**Example**:
`ConditionalVisibility.setCondition('Zruggig Widebrain','darkvision', false, 60, 4)`

`game.conditional-visibility.setCondition('Zruggig Widebrain','darkvision' false, 60, 4)`

`ConditionalVisibility.setCondition('Zruggig Widebrain','darkvision', false)`

`game.conditional-visibility.setCondition('Zruggig Widebrain','darkvision' false)`

`ConditionalVisibility.setCondition('Zruggig Widebrain','darkvision', false, 0, 4)`

`game.conditional-visibility.setCondition('Zruggig Widebrain','darkvision' false, 0, 4)`


### ConditionalVisibility.API.setCondition(tokenNameOrId: string, effectId: string, distance: number) ⇒ <code>Promise.&lt;void&gt;</code>

Add a active effect for work with the module, the `effectId` parameter must be present on the [table](./tables.md) associated to the system.

**Returns**: <code>Promise.&lt;void&gt;</code> - A empty promise

| Param | Type | Description | Default |
| --- | --- | --- | --- |
| tokenNameOrId | <code>string</code> | The name or the id of the token | <code>undefined</code> |
| effectNameOrId | <code>string</code> | The effect name or id used from this module, must be present on the [table](./tables.md) of this system  | <code>undefined</code> |
| disabled | <code>boolean</code> | The effect must be applied, but disabled | <code>false</code> |
| distance | <code>number</code> | OPTIONAL: explicit distance in units not grid to add to the Active Effects | <code>0</code> |
| visionLevelValue | <code>number</code> | OPTIONAL: explicit distance in units not grid to add to the Active Effects | <code>0</code> |

**Example**:
`ConditionalVisibility.API.setCondition('Zruggig Widebrain','darkvision', false, 60, 4)`

`game.conditional-visibility.API.setCondition('Zruggig Widebrain','darkvision' false, 60, 4)`

`ConditionalVisibility.API.setCondition('Zruggig Widebrain','darkvision', false,)`

`game.conditional-visibility.API.setCondition('Zruggig Widebrain','darkvision' false)`

### ConditionalVisibility.API.addEffectOnToken(tokenNameOrId: string, effectName: string, effect: Effect) ⇒ <code>Promise.&lt;void&gt;</code>

Add a active effect for work with the module, the `effectId` parameter must be present on the [table](./tables.md) associated to the system.

**Returns**: <code>Promise.&lt;void&gt;</code> - A empty promise

| Param | Type | Description | Default |
| --- | --- | --- | --- |
| tokenNameOrId | <code>string</code> | The name or the id of the token | <code>undefined</code> |
| effectName | <code>string</code> | The effectId used from this module, must be present on the [table](./tables.md) of this system | <code>undefined</code> |
| effect | <code>Effect</code> | The effect object from the [Dfred convenient effects](https://github.com/DFreds/dfreds-convenient-effects/) | <code>undefined</code> |

**Example**:
`ConditionalVisibility.API.addEffectOnToken('Zruggig Widebrain','darkvision',60)`

`game.conditional-visibility.API.addEffectOnToken('Zruggig Widebrain','darkvision',60)`




## Work in progress for add the others function, but you can read directly the API class if you want [API](../src/module/api.ts)...
