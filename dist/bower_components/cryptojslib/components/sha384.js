!function(){var C=CryptoJS,C_x64=C.x64,X64Word=C_x64.Word,X64WordArray=C_x64.WordArray,C_algo=C.algo,SHA512=C_algo.SHA512,SHA384=C_algo.SHA384=SHA512.extend({_doReset:function(){this._hash=new X64WordArray.init([new X64Word.init(3418070365,3238371032),new X64Word.init(1654270250,914150663),new X64Word.init(2438529370,812702999),new X64Word.init(355462360,4144912697),new X64Word.init(1731405415,4290775857),new X64Word.init(2394180231,1750603025),new X64Word.init(3675008525,1694076839),new X64Word.init(1203062813,3204075428)])},_doFinalize:function(){var hash=SHA512._doFinalize.call(this);return hash.sigBytes-=16,hash}});C.SHA384=SHA512._createHelper(SHA384),C.HmacSHA384=SHA512._createHmacHelper(SHA384)}();