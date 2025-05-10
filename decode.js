function decode(encoded) {
  const ABC = 'u09tbS3UvgDEe6r-ZVMXzLpsAohTn7mdINQlW412GqBjfYiyk8JORCF5/xKHwacP=';
  const LUT = Object.fromEntries([...ABC].map((c, i) => [c, i]));

  function b64(str) {
    const out = [];
    let i = 0;

    for (; i + 4 <= str.length; i += 4) {
      const n = (LUT[str[i]] << 18) | (LUT[str[i + 1]] << 12) |
                (LUT[str[i + 2]] <<  6) |  LUT[str[i + 3]];
      out.push((n >>> 16) & 255, (n >>>  8) & 255, n & 255);
    }

    const remaining = str.length - i;
    if (remaining === 2) {                         // produces 1 byte
      const n = (LUT[str[i]] << 6) | LUT[str[i + 1]];
      out.push((n >>> 4) & 255);
    } else if (remaining === 3) {                  // produces 2 bytes
      const n = (LUT[str[i]] << 12) | (LUT[str[i + 1]] << 6) | LUT[str[i + 2]];
      out.push((n >>> 10) & 255, (n >>> 2) & 255);
    }
    return Uint8Array.from(out);
  }

  // ❸  ----------  locate key & ciphertext ----------
  const buf = b64(encoded);
  if (buf[0] !== 75) throw Error('bad sentinel');
  const KEY_LEN = 48;
  const xLen    = buf.length - 1 - KEY_LEN;
  const mod     = xLen + 1;

  let sum = 0;
  for (let i = 1; i < buf.length; ++i) sum += buf[i];
  const someVal  = sum % mod;

  const keyStart = 1 + someVal;
  const keyBytes = buf.slice(keyStart, keyStart + KEY_LEN);
  const cipher   = Uint8Array.from([
    ...buf.slice(1, keyStart),
    ...buf.slice(keyStart + KEY_LEN),
  ]);

  // ❹  ----------  rebuild key words, derive round-count ----------
  const keyWords = [];
  for (let i = 0; i < KEY_LEN; i += 4)
    keyWords.push(
        ( keyBytes[i]        |
        (keyBytes[i+1] <<  8) |
        (keyBytes[i+2] << 16) |
        (keyBytes[i+3] << 24)) >>> 0);

  let rounds = 0;
  for (const w of keyWords)
    rounds = ((w & 15) + rounds) & 15;
  rounds += 5;


  const aa = [4294967295,138,1498001188,211147047,253,0,203,288,9,1196819126,
              3212677781,135,263,193,58,18,244,2931180889,240,173,268,2157053261,
              261,175,14,5,171,270,156,258,13,15,3732962506,185,169,2,6,132,162,
              200,3,160,217618912,62,2517678443,44,164,4,96,183,2903579748,
              3863347763,119,181,10,190,8,2654435769,259,104,230,128,2633865432,
              225,1,257,143,179,16,600974999,185100057,32,188,53,2718276124,
              177,196,4294967296,147,117,17,49,7,28,12,266,216,11,0,45,166,
              247,1451689750];
  const OT = [aa[9], aa[69], aa[51], aa[92]];

  const rotl = (v, c) => (v << c) | (v >>> (32 - c));
  function qr(s,a,b,c,d){
    s[a]=(s[a]+s[b])>>>0; s[d]^=s[a]; s[d]=rotl(s[d],16);
    s[c]=(s[c]+s[d])>>>0; s[b]^=s[c]; s[b]=rotl(s[b],12);
    s[a]=(s[a]+s[b])>>>0; s[d]^=s[a]; s[d]=rotl(s[d], 8);
    s[c]=(s[c]+s[d])>>>0; s[b]^=s[c]; s[b]=rotl(s[b], 7);
  }

  function chachaBlock(state, R){
    const x = state.slice();
    let r = 0;
    while (r < R){
      qr(x,0,4,8,12); qr(x,1,5,9,13);
      qr(x,2,6,10,14); qr(x,3,7,11,15);
      if (++r >= R) break;

      qr(x,0,5,10,15); qr(x,1,6,11,12);
      qr(x,2,7,12,13); qr(x,3,4,13,14);
      ++r;
    }
    for (let i=0;i<16;++i) x[i]=(x[i]+state[i])>>>0;
    return x;
  }

  const st  = [...OT, ...keyWords];
  const plain = new Uint8Array(cipher.length);

  for (let off = 0; off < cipher.length; off += 64){
    const block = chachaBlock(st, rounds);
    st[12] = (st[12] + 1) >>> 0;                  // Ab23()

    for (let i = 0; i < 64 && off+i < cipher.length; ++i){
      const byte = (block[i>>>2] >>> (8*(i&3))) & 255;
      plain[off+i] = cipher[off+i] ^ byte;
    }
  }

  const arr = [...plain];
  let p = 0;
  arr[p++];
  const obj   = {};

  while (p < arr.length){
    const k   = String(arr[p++]);
    const len = (arr[p] << 8) | arr[p+1]; p += 2;
    const bytes = arr.slice(p, p += len);

    if (len <= 4){
      let num = 0; for (const b of bytes) num = (num<<8)|b;
      obj[k] = num >>> 0;
    }else{
      obj[k] = new TextDecoder().decode(Uint8Array.from(bytes));
    }
  }

  return obj
}
