class MinecraftColorCodes {
    /**
     * Some Optional Setting
     * @param {Object} option 
     * @param {Boolean} option.autoConvert auto replace text § to & or else, default false
     * @param {Number} option.charMode 0 for §, 1 for &, default 1
     * @param {Number} option.speed obfuscate speed, default 5
     * @param {Boolean} option.useMonospace obfuscate with monospace font to not messed up text
     */
    constructor(option = {}){

        this.autoConvert = option.autoConvert === true ? option.autoConvert : false;
        this.charMode = option.charMode === 0 ? 0 : 1;
        this.speed = option.speed >= 0 ? option.speed : 5;

        this.currentName = "default";
        this.obfuscatorsObj = {
            ['default']: []
        };

        this.styleMap = {};

        this.loadStyleMap(this.charMode);
    }

    dispose(){
        this.clearAllObfuscators();
        this.styleMap = {};
    }

    
    /**
     * 
     * @param {String} text input value 
     * @param {String} name make text unique for another to not get stop obfuscate effect
     * @returns {DocumentFragment} parrentElement.appendChild(here), https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
     */
    parse(text, name = "default") {
        this.clearObfuscators(name);

        let outputString;
        this.currentName = name;

        try {
            let fixText = this.fixTextBeforeParse(text);

            outputString = this.parseStyle(fixText);
        } catch (error) {
            console.error(error);

            outputString = document.createElement("span");

            outputString.textContent = text;
        }


        return outputString;
    }
    /**
     * 
     * @param {String} string 
     * @returns {DocumentFragment}
     */
    parseStyle(string) {

        if(this.autoConvert){
            let inp = ["§", "&"];
            if(this.charMode === 0) inp.reverse();
            string = string.replace(...inp);
        }

        let convert = string.match(/&x&.{1}.{2}.{2}.{2}.{2}.{2}/g) || [];

        for (let i = 0; i < convert.length; i++) {
            const col = convert[i];

            string = string.replace(col, MinecraftColorCodes.colorCodeToHex(col));
        }

        let hexColors = string.match(/<.{7}>/g) || [];

        this.styleMap["&?"] = {
            index: 0,
            colors: []
        };

        for (let i = 0; i < hexColors.length; i++) {
            const rep = hexColors[i];

            this.styleMap["&?"].colors.push(rep);

            string = string.replace(rep, "&?");
        }

        let codes = string.match(/&.{1}/g) || [];
        let indexes = [];

        let final = document.createDocumentFragment();
        let len = codes.length;

        string = string.replace(/\n|\\n/g, '<br>');

        for (var i = 0; i < len; i++) {
            indexes.push(string.indexOf(codes[i]));
            string = string.replace(codes[i], '\x00\x00'); // seam like just two empty bytes
        }

        if (indexes[0] !== 0) {
            final.appendChild(this.applyCode(string.substring(0, indexes[0]), []));
        }

        let indexDelta;
        let tmpStr;
        let apply = [];

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
            final.appendChild(this.applyCode(tmpStr, apply));
        }

        return final;
    }

    /**
     * 
     * @param {Number} mode 0 for §, 1 for &
     */
    loadStyleMap(mode = 1){
        let char = 1 ? "&" : "§";
        this.charMode = mode;

        let dubText = "font-weight:normal;text-decoration:none;color:";
        this.styleMap = {
            [char + '4']: `${dubText}#be0000`, [char + 'c']: `${dubText}#fe3f3f`,
            [char + '6']: `${dubText}#d9a334`, [char + 'e']: `${dubText}#fefe3f`,
            [char + '2']: `${dubText}#00be00`, [char + 'a']: `${dubText}#3ffe3f`,
            [char + 'b']: `${dubText}#3ffefe`, [char + '3']: `${dubText}#00bebe`,
            [char + '1']: `${dubText}#0000be`, [char + '9']: `${dubText}#3f3ffe`,
            [char + 'd']: `${dubText}#fe3ffe`, [char + '5']: `${dubText}#be00be`,
            [char + 'f']: `${dubText}#ffffff`, [char + '7']: `${dubText}#bebebe`,
            [char + '8']: `${dubText}#3f3f3f`, [char + '0']: `${dubText}#000000`,
            [char + 'l']: 'font-weight:bold',
            [char + 'n']: 'text-decoration:underline;text-decoration-skip:spaces',
            [char + 'o']: 'font-style:italic',
            [char + 'm']: 'text-decoration:line-through;text-decoration-skip:spaces',
            // custom for hex colors
            [char + '?']: {
                index: 0,
                colors: []
            }
        };

    }

    /**
     * 
     * @param {String} string
     * @param {HTMLSpanElement} elem <span>
     */
    obfuscate(string, elem) {
        let magicSpan;
        let currNode;
        let len = elem.childNodes.length;

        if (string.indexOf('<br>') > -1) {

            elem.innerHTML = string;
            for (var j = 0; j < len; j++) {

                currNode = elem.childNodes[j];
                if (currNode.nodeType === 3) {

                    magicSpan = document.createElement('span');
                    magicSpan.innerHTML = currNode.nodeValue;
                    elem.replaceChild(magicSpan, currNode);
                    this.init(magicSpan);
                }
            }
        } else {

            this.init(elem, string);
        }

    }

    /**
    * 
    * @param {HTMLSpanElement} el <span>
    * @param {String} str 
    */
    init(el, str) {
        el.className = "format-obfuscate";
        el.style.fontFamily = "monospace";

        let i = 0;
        let obsStr = str || el.innerHTML;
        let len = obsStr.length;

        if (!this.obfuscatorsObj[this.currentName]) {
            this.obfuscatorsObj[this.currentName] = [];
        }
        if (typeof this.speed !== "number") this.speed = 5;

        this.obfuscatorsObj[this.currentName].push(window.setInterval(() => {
            if (i >= len) i = 0;
            obsStr = this.replaceRand(obsStr, i);
            el.innerHTML = obsStr;
            i++;
        }, this.speed));
    }
    /**
     * 
     * @param {Number} min 
     * @param {Number} max 
     * @returns {Number}
     */
    randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    /**
     * 
     * @param {String} string 
     * @param {Number} i 
     * @returns {String}
     */
    replaceRand(string, i) {
        let randChar = String.fromCharCode(this.randInt(64, 90)); /*Numbers: 48-57 Al:64-90*/
        return string.substr(0, i) + randChar + string.substr(i + 1, string.length);
    }
    /**
     * 
     * @param {String} string 
     * @param {Array<String>} codes 
     * @returns {HTMLSpanElement}
     */
    applyCode(string, codes) {
        let len = codes.length;
        let elem = document.createElement('span');
        let obfuscated = false;

        let once = false;

        for (var i = 0; i < len; i++) {

            if (codes[i] === "&?") {

                let pos = this.styleMap[codes[i]].index;
                let color = this.styleMap[codes[i]].colors[pos];

                if (!once) {

                    once = true;
                    this.styleMap[codes[i]].index++;

                    if (color) elem.style.color = color.replace("<", '').replace(">", '');
                }

            } else {

                elem.style.cssText += this.styleMap[codes[i]] + ';';
            }

            if (codes[i] === '&k') {

                this.obfuscate(string, elem);
                obfuscated = true;
            }
        }

        if (!obfuscated) elem.innerHTML = string;

        return elem;

    }

    /**
     * 
     * @param {String} name 
     */
    clearObfuscators(name = "default") {
        
        if (Array.isArray(this.obfuscatorsObj[name])) {
            var i = this.obfuscatorsObj[name].length;
            for (; i--;) {
                clearInterval(this.obfuscatorsObj[name][i]);
            }
            this.obfuscatorsObj[name] = [];
        }
    }
    clearAllObfuscators = () => {
        for (const key in this.obfuscatorsObj) {
            if (!Object.hasOwn(this.obfuscatorsObj, key)) continue;

            this.clearObfuscators(key);
        }
    }

    /**
     * Basic fix obfuscate
     * &kText&fText2
     * obfuscate -> &f -> stop
     * add &r to stop
     * @param {String} text 
     * @returns {String}
     */
    fixTextBeforeParse(text) {

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

    /**
     * 
     * @param {String} format from &x&0&0&9&B&D&9
     * @returns {String} to <#009BD9>
     */
    static colorCodeToHex(format) {

        format = format.replace("&x", "");
        let col = format.split("&");

        return `<#${col.join("")}>`;
    }

}


export {MinecraftColorCodes}