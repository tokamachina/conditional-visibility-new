# Tutorial

## How the active effect name is checked ?

You can use any active effect where the name is founded from the following code of the module:

```
const effectNameToCheck = 'blinded';
// For each active effects on the token/actor
let result = false;
for(const effect of effects){
    // regex expression to match all non-alphanumeric characters in string
    const regex = /[^A-Za-z0-9]/g;
    // use replace() method to match and remove all the non-alphanumeric characters
    result  = effectNameToCheck.replace(regex, "").toLowerCase().startsWith(effectIdOfTheModule.replace(regex, "").toLowerCase());
    if(result)break;
}
return result;
```

## How the hidden check is calculated ?

The calculation for the vision checks is in three points (usually these check are enabled for all system)

1) Check if source token has the vision enabled, if disabled is like the module is not active for that token.
2) Check if the source token has at least a active effect marked with key `ATCV.<sense or condition id>` 
3) Check if the source token has the active effect `blinded` active, if is true, you cannot see anything.
4) Check if the source token has at least a index value between the index of some active effect of the conditions, this will check the elevation too if the active effect key `ATCV.conditionElevation` is set to true, check out the [TABLES](./tables.md) for details, you can skip this check by using the AE key `ATCV.conditionTargets` explained below.
5) Check if the vision level value of the sense is a number > = of the vision level value of the condition, if the sense is set to `-1` this check is automatically skipped. If the condition and the sesne are both set with value `-1` the condition won.

## What active effect data are used form this module ?

Every active effect data of this is module has the prefix `ATCV` _Active Token Conditional Visibility_ .

There three type of these AE used and supported from this module:

| Key Syntax                      | Type    | Description                         | Examples Active Effect Data [Key = value] |
| :------------------------------:|:-------:|:-----------------------------------:|:--------:|
| `ATCV.<sense or condition id>`  | number  | Identify the "vision level" of the sense/condition | `ATCV.invisible = 12`, `ATCV.darkvision = 13` |
| `ATCV.conditionElevation`       | boolean | if true will force to check the elevation between tokens source and target, VERY USEFUL IF YOU USE LEVELS | `ATCV.conditionElevation = true` |
| `ATCV.conditionTargets`          | list of string | This is used for explicitly tell to the checker what AE can be see from this AE based on the custom id used from this module, check out the [TABLES](./tables.md) for details, **this is basically a override of the point 4. checker based on the indexes given to the sense  |  `ATCV.conditionTargets=hidden,invisible` |


**NOTE:** by default all _senses_ are passive AE and all _conditions_ are _temporary_ AE
