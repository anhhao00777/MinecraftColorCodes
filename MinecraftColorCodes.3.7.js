
var _obfuscatorSpeed = 5;
/**
 * 
 * @param {String} text include & or §
 * @param {String} name set name to prevent clear obfuscators or not get clear whent parse another text
 * @returns {DocumentFragment | HTMLSpanElement} return to <span> if error
 */
function parseMinecraftColorCode(text, name = "default"){}
/**
 * 
 * @param {Number} mode 0 = '§' character | 1 = '&' character
 */
function setFormatMode(mode = 1){}

function clearAllObfuscators(){}
(() => {

    var currentName = "default";
    var obfuscatorsObj = {
        [currentName]: []
    };
    var styleMap = {};
    window.setFormatMode = (mode = 1) => {
        var char = 1 ? "&" : "§";
        styleMap = {
            [char + '4']: 'font-weight:normal;text-decoration:none;color:#be0000',
            [char + 'c']: 'font-weight:normal;text-decoration:none;color:#fe3f3f',
            [char + '6']: 'font-weight:normal;text-decoration:none;color:#d9a334',
            [char + 'e']: 'font-weight:normal;text-decoration:none;color:#fefe3f',
            [char + '2']: 'font-weight:normal;text-decoration:none;color:#00be00',
            [char + 'a']: 'font-weight:normal;text-decoration:none;color:#3ffe3f',
            [char + 'b']: 'font-weight:normal;text-decoration:none;color:#3ffefe',
            [char + '3']: 'font-weight:normal;text-decoration:none;color:#00bebe',
            [char + '1']: 'font-weight:normal;text-decoration:none;color:#0000be',
            [char + '9']: 'font-weight:normal;text-decoration:none;color:#3f3ffe',
            [char + 'd']: 'font-weight:normal;text-decoration:none;color:#fe3ffe',
            [char + '5']: 'font-weight:normal;text-decoration:none;color:#be00be',
            [char + 'f']: 'font-weight:normal;text-decoration:none;color:#ffffff',
            [char + '7']: 'font-weight:normal;text-decoration:none;color:#bebebe',
            [char + '8']: 'font-weight:normal;text-decoration:none;color:#3f3f3f',
            [char + '0']: 'font-weight:normal;text-decoration:none;color:#000000',
            [char + 'l']: 'font-weight:bold',
            [char + 'n']: 'text-decoration:underline;text-decoration-skip:spaces',
            [char + 'o']: 'font-style:italic',
            [char + 'm']: 'text-decoration:line-through;text-decoration-skip:spaces',
            
            [char + '?']: {
                index: 0,
                colors: []
            }
        };
    }
    setFormatMode();
    
    function obfuscate(string, elem) {
        var magicSpan,
            currNode,
            len = elem.childNodes.length;
        if (string.indexOf('<br>') > -1) {
            elem.innerHTML = string;
            for (var j = 0; j < len; j++) {
                currNode = elem.childNodes[j];
                if (currNode.nodeType === 3) {
                    magicSpan = document.createElement('span');
                    magicSpan.innerHTML = currNode.nodeValue;
                    elem.replaceChild(magicSpan, currNode);
                    init(magicSpan);
                }
            }
        } else {
            init(elem, string);
        }
        function init(el, str) {
            el.className = "format-obfuscate";
            var i = 0,
                obsStr = str || el.innerHTML,
                len = obsStr.length;

            if(!obfuscatorsObj[currentName]){
                obfuscatorsObj[currentName] = [];
            }
            if(typeof _obfuscatorSpeed !== "number") _obfuscatorSpeed = 1;

            obfuscatorsObj[currentName].push(window.setInterval(function () {
                if (i >= len) i = 0;
                obsStr = replaceRand(obsStr, i);
                el.innerHTML = obsStr;
                i++;
            }, _obfuscatorSpeed));
        }
        function randInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        function replaceRand(string, i) {
            var randChar = String.fromCharCode(randInt(64, 90)); /*Numbers: 48-57 Al:64-90*/
            return string.substr(0, i) + randChar + string.substr(i + 1, string.length);
        }
    }
    function applyCode(string, codes) {
        var len = codes.length;
        var elem = document.createElement('span'),
            obfuscated = false;


        for (var i = 0; i < len; i++) {
            if (codes[i] === "&?") {
                let pos = styleMap[codes[i]].index++;
                let color = styleMap[codes[i]].colors[pos];
                if (color) elem.style.color = color.replace("<", '').replace(">", '');
            } else {
                elem.style.cssText += styleMap[codes[i]] + ';';
            }
            if (codes[i] === '&k') {
                obfuscate(string, elem);
                obfuscated = true;
            }
        }
        if (!obfuscated) elem.innerHTML = string;
        return elem;
    }
    function parseStyle(string) {

        let addon = string.match(/<.{7}>/g) || [];

        styleMap["&?"] = {
            index: 0,
            colors: []
        };

        for (let i = 0; i < addon.length; i++) {
            const rep = addon[i];

            styleMap["&?"].colors.push(rep);

            string = string.replace(rep, "&?");
        }


        var codes = string.match(/&.{1}/g) || [],
            indexes = [],
            apply = [],
            tmpStr,
            indexDelta,
            noCode,
            final = document.createDocumentFragment(),
            len = codes.length,
            string = string.replace(/\n|\\n/g, '<br>');



        for (var i = 0; i < len; i++) {
            indexes.push(string.indexOf(codes[i]));
            if (codes[i]?.indexOf("<") > -1) {
                string = string.replace(codes[i], '\x00\x00\x00\x00\x00\x00\x00\x00\x00');
                continue;
            }
            string = string.replace(codes[i], '\x00\x00');
        }
        if (indexes[0] !== 0) {
            final.appendChild(applyCode(string.substring(0, indexes[0]), []));
        }

        for (var i = 0; i < len; i++) {
            indexDelta = indexes[i + 1] - indexes[i];
            if (indexDelta === 2) {
                while (indexDelta === 2) {
                    apply.push(codes[i]);
                    i++;
                    indexDelta = indexes[i + 1] - indexes[i];
                }
                apply.push(codes[i]);
            } else {
                apply.push(codes[i]);
            }
            if (apply.lastIndexOf('&r') > -1) {
                apply = apply.slice(apply.lastIndexOf('&r') + 1);
            }
            tmpStr = string.substring(indexes[i], indexes[i + 1]);
            final.appendChild(applyCode(tmpStr, apply));
        }
        return final;
    }
    function clearObfuscators(name = "default") {
        
        if (Array.isArray(obfuscatorsObj[name])) {
            var i = obfuscatorsObj[name].length;
            for (; i--;) {
                clearInterval(obfuscatorsObj[name][i]);
            }
            obfuscatorsObj[name] = [];
        }
    }
    window.clearAllObfuscators = ()=>{
        for (const key in obfuscatorsObj) {
            if (!Object.hasOwn(obfuscatorsObj, key)) continue;
            
            clearObfuscators(key);
        }
    }



    String.prototype.replaceColorCodes = function (name) {
        var text = String(this);

        return parseMinecraftColorCode(text, name);
    };


    window.parseMinecraftColorCode = function (text, name = "default") {
        clearObfuscators(name);

        var outputString;
        currentName = name;

        try {
            var fixText = fixTextBeforeParse(text);

            outputString = parseStyle(fixText);
        } catch (error) {
            console.error(error);

            outputString = document.createElement("span");

            outputString.textContent = text;
        }


        return outputString;
    }

    /////////////////////////////////////////////////
    function cutString(str, cutStart, cutEnd) {
        return str.substr(0, cutStart) + str.substr(cutEnd + 1);
    }

    /**
     * Basic fix obfuscate
     * &kText&fText2
     * obfuscate -> &f -> stop
     * add &r to stop
     * @param {String} text 
     * @returns {String}
     */
    function fixTextBeforeParse(text) {

        let safeBr = 0; // remove later, break if something wrong this sht loop
        let max = 10000;
        for (let i = 0; i < text.length; i++) {

            if (safeBr > max) break;
            const pos = text.indexOf("&k", i);
            if (pos !== -1) {

                for (let p = pos + 1; p < text.length; p++) {
                    if (safeBr > max) break;

                    safeBr++;
                    const next = text[p];
                    if (next == "&") {

                        text = text.slice(0, p) + "&r" + text.slice(p);
                        i = p;
                        break;
                    }
                }

            }
        }
        return text;
    }

})();
