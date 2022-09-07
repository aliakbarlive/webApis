
let str = 'aaabbssdfdd'.split('').sort()
let obj = {}

str.map((item) => {
    obj[item] = obj[item] ? obj[item]+1 : 1
})



console.log(obj)
