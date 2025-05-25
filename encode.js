const crypto = require('crypto')

let aa = [4294967295, 138, 1498001188, 211147047, 253, /\s*\(\)\s*{\s*\[\s*native\s+code\s*]\s*}\s*$/, 203, 288, 9, 1196819126, 3212677781, 135, 263, 193, 58, 18, 244, 2931180889, 240, 173, 268, 2157053261, 261, 175, 14, 5, 171, 270, 156, 258, 13, 15, 3732962506, 185, 169, 2, 6, 132, 162, 200, 3, 160, 217618912, 62, 2517678443, 44, 164, 4, 96, 183, 2903579748, 3863347763, 119, 181, 10, 190, 8, 2654435769, 259, 104, 230, 128, 2633865432, 225, 1, 257, 143, 179, 16, 600974999, 185100057, 32, 188, 53, 2718276124, 177, 196, 4294967296, 147, 117, 17, 49, 7, 28, 12, 266, 216, 11, 0, 45, 166, 247, 1451689750]
let kt = [aa[44], aa[74], aa[10], aa[62], aa[42], aa[17], aa[2], aa[21], aa[3], aa[70], aa[50], aa[32], aa[0] & Date["now"](), Math["floor"](aa[77] * Math["random"]()), Math["floor"](aa[77] * Math["random"]()), Math["floor"](aa[77] * Math["random"]())]
let St = aa[88]
let Ot = [aa[9], aa[69], aa[51], aa[92]]

function numToUint8Array(value) {
    let abLen = value < 255 * 255 ? 2 : 4
    let ab = new ArrayBuffer(abLen)
    let dv = new DataView(ab)
    if (value < 255 * 255) {
        dv.setUint16(0, value, false)
    } else {
        dv.setUint32(0, value, false)
    }
    return new Uint8Array(ab)
}

function Ab12(e) {
  return function (e) {
    if (Array["isArray"](e)) return Ab39(e);
  }(e) || function (e) {
    var sa;
    sa = [null];
    if ("undefined" != typeof Symbol && sa[0] != e[Symbol["iterator"]] || sa[0] != e["@@iterator"]) return Array["from"](e);
  }(e) || Ab3(e) || function () {
    throw new TypeError("Invalid attempt to spread non-iterable instance. In order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }();
}

function Ab18(e, t, r, n, o) {
  var ob;
  ob = [16, 12, 8, 7], e[t] += e[r], e[o] = Ab41(e[o] ^ e[t], ob[0]), e[n] += e[o], e[r] = Ab41(e[r] ^ e[n], ob[1]), e[t] += e[r], e[o] = Ab41(e[o] ^ e[t], ob[2]), e[n] += e[o], e[r] = Ab41(e[r] ^ e[n], ob[3]);
}

function Ab21(e, t, r) {
  var qb;
  qb = [0];
  for (var n = Math["floor"](r["length"] / 4), o = r["length"] % 4, i = Math["floor"]((r["length"] + 3) / 4), u = Array(i), a = 0; a < n; ++a) {
    var s = 4 * a;
    u[a] = r[s] | r[s + 1] << 8 | r[s + 2] << 16 | r[s + 3] << 24;
  }
  if (o > qb[0]) {
    u[a] = 0;
    for (var c = 0; c < o; ++c) u[a] |= r[4 * a + c] << 8 * c;
  }
  for (function (e, t, r) {
    for (var n = e["slice"](), o = 0; o + 16 < r["length"]; o += 16) {
      var i = Ab33(n, t);
      Ab23(n);
      for (var u = 0; u < 16; ++u) r[o + u] ^= i[u];
    }
    for (var a = r["length"] - o, s = Ab33(n, t), c = 0; c < a; ++c) r[o + c] ^= s[c];
  }(e, t, u), a = 0; a < n; ++a) {
    var f = 4 * a;
    r[f] = 255 & u[a], r[f + 1] = u[a] >>> 8 & 255, r[f + 2] = u[a] >>> 16 & 255, r[f + 3] = u[a] >>> 24 & 255;
  }
  if (o > qb[0]) for (var d = 0; d < o; ++d) r[4 * a + d] = u[a] >>> 8 * d & 255;
}

function Ab22(e, t, r) {
  return function (e, t, r) {
    for (var n = [], o = 0; o < r["length"]; ++o) n["push"](r["charCodeAt"](o));
    return Ab21(e, t, n), String.fromCharCode["apply"](String, n);
  }([]["concat"](Ot, Ab12(e)), t, r);
}

function Ab23(e) {
  var pb;
  pb = [12, 4294967295, 1], e[pb[0]] = e[pb[0]] + pb[2] & pb[1];
}

function Ab33(e, t) {
  var r;
  r = e["slice"](), !function (e, t) {
    for (var r = 0; r < t && (Ab18(e, 0, 4, 8, 12), Ab18(e, 1, 5, 9, 13), Ab18(e, 2, 6, 10, 14), Ab18(e, 3, 7, 11, 15), !(++r >= t)); ++r) Ab18(e, 0, 5, 10, 15), Ab18(e, 1, 6, 11, 12), Ab18(e, 2, 7, 12, 13), Ab18(e, 3, 4, 13, 14);
  }(r, t);
  for (var n = 0; n < 16; ++n) r[n] += e[n];
  return r;
}

function Ab39(e, t) {
  var ta;
  ta = [null], (ta[0] == t || t > e["length"]) && (t = e["length"]);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}

function Ab41(e, t) {
  var nb;
  return nb = [32], e << t | e >>> nb[0] - t;
}

function rand () {
  var r, t, e, rb;
  return rb = [4294967296, 4294965248, 53, 0, 2, 11, 8, 7], e = Ab33(kt, rb[6]), t = e[St], r = (rb[1] & e[St + rb[6]]) >>> rb[5], rb[7] === St ? (Ab23(kt), St = rb[3]) : ++St, (t + rb[0] * r) / Math["pow"](rb[4], rb[2]);
}


function encode({queryString, body, userAgent}) {
  let obj = {}
  obj[1] = 1
  obj[2] = 0
  obj[3] = crypto.createHash('md5').update(queryString).digest('hex')
  obj[4] = crypto.createHash('md5').update(body).digest('hex')
  obj[5] = crypto.createHash('md5').update(userAgent).digest('hex')

  const currentDate = new Date()
  const timestamp = currentDate.getTime()
  obj[6] = Math.floor(timestamp / 1000)
  obj[7] = 1245783967
  obj[8] = (timestamp * 1000) % 2147483648
  obj[9] = "5.1.0"
  obj[0] = 1 ^ obj[6] ^ obj[7] ^ obj[8]

  let arr = [Object.keys(obj).length]

  for (const [key, value] of Object.entries(obj)) {
    arr.push(parseInt(key))
    let valArr, lenArr;

    if (typeof value === "number") {
      valArr = numToUint8Array(value)
      lenArr = numToUint8Array(valArr.length)
    } else {
      let te = new TextEncoder()
      valArr = te.encode(value)
      lenArr = numToUint8Array(valArr.length)
    }

    arr.push(...lenArr)
    arr.push(...valArr)
  }

  let str = ""
  for (let i = 0; i < arr.length; i++) {
    str += String.fromCharCode(arr[i])
  }

  let a = 1 << 6
  let b = 1 << 3
  let c = a ^ b
  let d = c ^ 3
  let e = d & 255
  let someRandomChar = String.fromCharCode(e)

  let key = []
  let keyStringArr = []
  let rounds = 0

  for (let i = 0; i < 12; i++) {
    let randomNumber = rand();
    let num = Math.floor(Math.pow(2, 32) * randomNumber)
    key.push(num)

    rounds = ((num & 15) + rounds) & 15

    let first = num & 255
    let second = (num >>> 8) & 255
    let third = (num >>> 16) & 255
    let fourth = (num >>> 24) & 255
    keyStringArr.push(first, second, third, fourth)
  }

  rounds += 5

  let x = Ab22(key, rounds, str)
  let someVal = 0

  for (let i = 0; i < keyStringArr.length; i++) {
    let el = keyStringArr[i]
    someVal += el
    someVal = someVal % (x.length + 1)
  }

  for (let i = 0; i < x.length; i++) {
    let charCode = x.charCodeAt(i)
    someVal += charCode
    someVal = someVal % (x.length + 1)
  }


  let keyString = String.fromCharCode.apply(null, keyStringArr)
  str = someRandomChar + x.substring(0, someVal) + keyString + x.substring(someVal)

  let charSet = "u09tbS3UvgDEe6r-ZVMXzLpsAohTn7mdINQlW412GqBjfYiyk8JORCF5/xKHwacP="
  let res = ""

  for (let i = 3; i <= str.length; i += 3) {
    let val = (str.charCodeAt(i - 3) & 255) << 16
    val = ((str.charCodeAt(i - 2) & 255) << 8) | val
    val = (str.charCodeAt(i - 1) & 255) | val
    
    
    pos = val & 16515072
    pos = pos >> 18
    res += charSet.charAt(pos)

    pos = val & 258048
    pos = pos >> 12
    res += charSet.charAt(pos)

    pos = val & 4032
    pos = pos >> 6
    res += charSet.charAt(pos)

    pos = val & 63
    pos = pos >> 0
    res += charSet.charAt(pos)
  }

  return res
}
