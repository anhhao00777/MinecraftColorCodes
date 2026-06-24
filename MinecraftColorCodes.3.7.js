
var _obfuscatorSpeed = 5;
var _autoConvert = true;
/**
 * 
 * @param {String} text include & or §
 * @param {String} name set name to prevent clear obfuscators or not get clear whent parse another text
 * @returns {DocumentFragment | HTMLSpanElement} return to <span> if error
 */
function parseMinecraftColorCode(text, name = "default") { }

function clearAllObfuscators() { }
(() => {

    var currentName = "default";
    var obfuscatorsObj = {
        [currentName]: []
    };
    var styleMap = {};

    styleMap = {
        '&4': 'font-weight:normal;text-decoration:none;color:#be0000',
        '&c': 'font-weight:normal;text-decoration:none;color:#fe3f3f',
        '&6': 'font-weight:normal;text-decoration:none;color:#d9a334',
        '&e': 'font-weight:normal;text-decoration:none;color:#fefe3f',
        '&2': 'font-weight:normal;text-decoration:none;color:#00be00',
        '&a': 'font-weight:normal;text-decoration:none;color:#3ffe3f',
        '&b': 'font-weight:normal;text-decoration:none;color:#3ffefe',
        '&3': 'font-weight:normal;text-decoration:none;color:#00bebe',
        '&1': 'font-weight:normal;text-decoration:none;color:#0000be',
        '&9': 'font-weight:normal;text-decoration:none;color:#3f3ffe',
        '&d': 'font-weight:normal;text-decoration:none;color:#fe3ffe',
        '&5': 'font-weight:normal;text-decoration:none;color:#be00be',
        '&f': 'font-weight:normal;text-decoration:none;color:#ffffff',
        '&7': 'font-weight:normal;text-decoration:none;color:#bebebe',
        '&8': 'font-weight:normal;text-decoration:none;color:#3f3f3f',
        '&0': 'font-weight:normal;text-decoration:none;color:#000000',
        '&l': 'font-weight:bold',
        '&n': 'text-decoration:underline;text-decoration-skip:spaces',
        '&o': 'font-style:italic',
        '&m': 'text-decoration:line-through;text-decoration-skip:spaces',

        '&?': {
            index: 0,
            colors: []
        }
    };

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
            var i = 0;
            var obsStr = str || el.innerHTML;

            obsStr = obsStr.replaceAll("\x00", ""); // remove black char to match text length

            var len = obsStr.length;

            if (!obfuscatorsObj[currentName]) {
                obfuscatorsObj[currentName] = [];
            }
            if (typeof _obfuscatorSpeed !== "number") _obfuscatorSpeed = 1;

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

        var once = false;
        for (var i = 0; i < len; i++) {
            
            if (codes[i] === "&?") {
                let pos = styleMap[codes[i]].index;
                let color = styleMap[codes[i]].colors[pos];
                if (!once) {
                    once = true;

                    styleMap[codes[i]].index++;

                    if (color) elem.style.color = color.replace("<", '').replace(">", '');

                }

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
    function toHex(format) {
        format = format.replace("&x", "");
        let col = format.split("&");
        return `<#${col.join("")}>`;
    }
    function parseStyle(string) {
        styleMap["&?"] = {
            index: 0,
            colors: []
        };

        if (_autoConvert) {
            string = string.replaceAll("§", "&");
        }

        let convert = string.match(/&x&.{1}.{2}.{2}.{2}.{2}.{2}/g) || [];

        for (let i = 0; i < convert.length; i++) {
            const col = convert[i];

            string = string.replace(col, toHex(col));
        }

        let addon = string.match(/<.{7}>/g) || [];



        for (let i = 0; i < addon.length; i++) {
            const rep = addon[i];

            styleMap["&?"].colors.push(rep);

            string = string.replace(rep, "&?");
        }


        string = string.replace(/\n|\\n/g, '<br>&r '); // reset in new line

        var codes = string.match(/&.{1}/g) || [],
            indexes = [],
            apply = [],
            tmpStr,
            indexDelta,
            noCode,
            final = document.createDocumentFragment(),
            len = codes.length;



        for (var i = 0; i < len; i++) {
            indexes.push(string.indexOf(codes[i]));
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
    window.clearAllObfuscators = () => {
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
                // &k&?
                // skip if right next is &
                for (let p = pos + 3; p < text.length; p++) {
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

        let empty = text.match(/&{1}.\n/g) || [];
        empty.forEach(s => text = text.replace(s, "\n"));

        return text;
    }

})();
