!function(){function swapEndian(word){return word<<8&4278255360|word>>>8&16711935}var C=CryptoJS,C_lib=C.lib,WordArray=C_lib.WordArray,C_enc=C.enc;C_enc.Utf16=C_enc.Utf16BE={stringify:function(wordArray){for(var words=wordArray.words,sigBytes=wordArray.sigBytes,utf16Chars=[],i=0;i<sigBytes;i+=2){var codePoint=words[i>>>2]>>>16-i%4*8&65535;utf16Chars.push(String.fromCharCode(codePoint))}return utf16Chars.join("")},parse:function(utf16Str){for(var utf16StrLength=utf16Str.length,words=[],i=0;i<utf16StrLength;i++)words[i>>>1]|=utf16Str.charCodeAt(i)<<16-i%2*16;return WordArray.create(words,2*utf16StrLength)}};C_enc.Utf16LE={stringify:function(wordArray){for(var words=wordArray.words,sigBytes=wordArray.sigBytes,utf16Chars=[],i=0;i<sigBytes;i+=2){var codePoint=swapEndian(words[i>>>2]>>>16-i%4*8&65535);utf16Chars.push(String.fromCharCode(codePoint))}return utf16Chars.join("")},parse:function(utf16Str){for(var utf16StrLength=utf16Str.length,words=[],i=0;i<utf16StrLength;i++)words[i>>>1]|=swapEndian(utf16Str.charCodeAt(i)<<16-i%2*16);return WordArray.create(words,2*utf16StrLength)}}}();