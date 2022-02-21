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

1) Check if the source token has the active effect `blinded` active, if is true, you cannot see anything.
2) Check if the source token has at least a active effect for see the condition base don this [TABLES](./tables.md)
3) Check if the vision level value of the sense is a number > = of the vision level value of the condition, if the sense is setted to `-1` this check is automatically skipped


