# MinecraftColorCodes
Minecraft has it's own Color Code system, in which they use § characters.
This JS library I made will translate all color codes into HTML, so you can insert it in your website.

##Installation
Download this as a zip, and open the zip.
Place MinecraftColorCodes.js in the directory you want.
In the webpage you have the string want to translate, link the JS file in your ``` head ``` tag.
Like so:
```
<head>
<script src="MinecraftColorCodes.js"></script>
</head>
```
You can also link the JS file at the bottom of the webpage, right before the ```body``` tag. 

Now you can use it!
## Fork note:
- I'm not really know how these code work just fix and add what I can
- Add '&' support as default
- Fix &k: when meet any & next just stop obfuscator
- Add hex: <#00ffff> ...
- Add &x colors
- Global _obfuscatorSpeed - number of millisecond, speed for obfuscator effect higher for performance
- Global _autoConvert - boolean, auto replace text § to & 
- Function parseMinecraftColorCode(text: string, name: string): same with String.prototype.replaceColorCodes
##Usage
Example:
```
<script>
_autoConvert = true; // use § and &
var yourMOTD = "§d§lnerd.nu§8: §6§oCreative Rev 28";
var newMOTD = yourMOTD.replaceColorCodes();
console.log(newMOTD);
<script>
```

Add "&" support:
```
<script>
var yourMOTD = "&d&lnerd.nu&8: &6&oCreative Rev 28";
var newMOTD = yourMOTD.replaceColorCodes();
console.log(newMOTD);
<script>
```
Add hex "<#00ffff>" support:
```
<script>
  // "This Is Hex Color, Ahhhh"
var yourMOTD = "<#D200FF>&lT<#CA05FE>&lh<#C30AFD>&li<#BB10FC>&ls <#AC1AFA>&lI<#A41FF9>&ls <#952AF7>&lH<#8E2FF6>&le<#8634F5>&lx <#773FF2>&lC<#6F44F1>&lo<#6749F0>&ll<#604EEF>&lo<#5853EE>&lr<#5159ED>&l, <#4163EB>&lA<#3A68EA>&lh<#326EE9>&lh<#2B73E8>&lh<#2378E7>&lh";

var newMOTD = yourMOTD.replaceColorCodes();
console.log(newMOTD);
<script>
```
## Test long text
<img width="787" height="565" alt="Screenshot 2026-06-23 221721" src="https://github.com/user-attachments/assets/c127c55e-45e2-4de0-9fa0-338ca73b034c" />


Simple enough. Get your string, attach the function at the end (Don't forget the brackets, they are essential) and voila! You can then do whatever you like with it!


##Extras
You might want to get your server's MOTD, but you don't know how to access the server from your website?
Use this code! (jQuery needed)
```
$(document).ready(function(){
  $.getJSON('https://mcapi.us/server/status?ip=c.nerd.nu', function(obj){
    if(obj.online === true){
      motdHTML = obj.motd.replaceColorCodes();
      console.log(motdHTML);
    } else {
      console.log("Server is offline...");
    }
  });
})
```
https://mcapi.us provides JSON responses from the server provided in the URL. By using this, you can parse the JSON, and get your desired information! Visit http://mcapi.us for more information on the JSON format.


##Bugs / ToDo

- #1 §k does not work. (FIXED IN VERSION 3.0)
- #2 Having multiple formatting codes does not work. (FIXED IN VERSION 2.0)
- #3 The spaces disappear, and the output is a whole big chunk of letters. (FIXED IN VERSION 3.5)
- #4 Color Codes should reset previous occuring formatting codes, yet they seem to keep the formatting. (FIXED IN VERSION 3.7)

If you find one, please submit an issue ticket or a pull request.

- Add Class support (DROPPED!)
- Add Support for custom class, like first match, second match, etc... (DROPPED!)
- Put everything in a huge String.prototype function. (DONE!)
- Fix Bugs (DONE FOR ALL LISTED)

##Updates
v1.0 - Created this file, added replacements for color codes

v1.1 - Added formatting replacements (e.g. §l)

v1.2 - Added support for multiple occurence of one color code in a string

v1.3 - Added support for New Line, and Spaces because spaces were buggy. The ```\n``` character translates into ```<br>```, and the spaces translate into Unicode spaces (```&#32;```).

v2.0 - A complete recode. Now fixed Bug #2, 'Having multiple formatting codes does not work'. New line and spaces was removed.

v3.0 - Added §k, §r, and \n support. Now also requires the output element ID.

v3.1 - Finally! Support for class names too!

v3.5 - Fixed Bug #3, 'Spaces dissappear', by adding a CSS property to the output element.'

v3.7 - Fixed Bug #4, put everything in a huge ```String.prototype``` function, so now you can't input your output element ID/Class. I mean come on, what if you just wanted to output to the console? I also changed a few tweaks here and there.

##Legal
You can modify this file in any way, but if you want, create a pull request so I can have a look. Also, try not sell this file/work for a price. I mean come on, if you really want money, go get a proper job. Thirdly and lastly, you can not give away this file/work without giving credit to me, and possibly giving the URL to this Github page. Due to the informality of this piece of text, you could ignore this if you want to.
