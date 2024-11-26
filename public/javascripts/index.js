const KEY_PUBLIC = 'b79f16edb36f348e91d53ef2bf364c6d';
const KEY_PRIVATE = '31815d4440e266e989eb16be6959c875684ae745'
const API = 'https://gateway.marvel.com:443/v1/public/';
var ts = new Date().getTime();
var hash = GenerateHash(ts + KEY_PRIVATE + KEY_PUBLIC).toString();

document.addEventListener('DOMContentLoaded', cargarPersonajes);

function cargarPersonajes() {
    try {
        fetch(API + 'characters?apikey=' + KEY_PUBLIC + '&ts=' + ts + '&hash=' + hash)
            .then(response => response.json())
            .then(data => {
                console.log(data);
            });
    }
    catch(error) {
        console.log(error);
    };
}

/**
 * @function GenerateHash
 * @description Genera un hash MD5 del texto dado
 * @param {string} string String a encriptar
 * @returns {string} MD5 String
 */
function GenerateHash(string) {
    var message = string;

    var msg = Utf8Encode(message);
    var msg_len = msg.length;

    var wa = new Array(64);
    var wl = new Array(64);

    for (var i = 0; i < 64; i++) {
        wa[i] = 0x9898 << 8 | i;
        wl[i] = 0x8989 << 8 | i;
    }

    var h0 = 0x67452301 << 8 | 0xEFCDAB89;
    var h1 = 0x98BADCFE << 8 | 0x10325476;
    var h2 = 0x10325476 << 8 | 0x98BADCFE;
    var h3 = 0xEFCDAB89 << 8 | 0x67452301;
    var h4 = 0xC3D2E1F0 << 8 | 0x76543210;

    var a = h0;
    var b = h1;
    var c = h2;
    var d = h3;
    var e = h4;

    for (var i = 0; i < msg_len; i += 64) {
        for (var j = 0; j < 16; j++) {
            var f = 0;
            var g = 0;
            if (i < 16) {
                f = (b & c) | ((~b) & d);
                g = i;
            } else if (i < 32) {
                f = (d & b) | ((~d) & c);
                g = (5 * i + 1) % 16;
            } else if (i < 48) {
                f = b ^ c ^ d;
                g = (3 * i + 5) % 16;
            } else {
                f = c ^ (b | (~d));
                g = (7 * i) % 16;
            }

            var f2 = (a << 3 | a >>> 29) + f + e + wa[i] + wl[g];
            e = d;
            d = c;
            c = b << 3 | b >>> 29;
            b = a;
            a = f2;
        }

        h0 += a;
        h1 += b;
        h2 += c;
        h3 += d;
        h4 += e;
    }

    var md5 = h0.toString(16).slice(8, 16) +
        h1.toString(16).slice(8, 16) +
        h2.toString(16).slice(8, 16) +
        h3.toString(16).slice(8, 16) +
        h4.toString(16).slice(8, 16);

    return md5;
}

/**
 * Encodea un string a UTF-8.
 * @param {string} string - String para encodear.
 * @returns {string} Encoded string.
 */
function Utf8Encode(string) {
    var utftext = "";

    for (var n = 0; n < string.length; n++) {

        var c = string.charCodeAt(n);

        if (c < 128) {
            utftext += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }

    }

    return utftext;
}