const bcrypt = require('bcrypt');
const crypto = require('crypto');

const generatePassword = (
  length = 15,
  wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'
) =>
  Array.from(crypto.randomFillSync(new Uint32Array(length)))
    .map((x) => wishlist[x % wishlist.length])
    .join('');

let pass = generatePassword();

console.group();
console.log(`Here is a sample password: ${pass}`);
console.log(`encrypted: ${bcrypt.hashSync(pass, 10)}`);
console.groupEnd();
