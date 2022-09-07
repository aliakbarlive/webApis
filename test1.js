const testString = 'aabssssdd'.split('')

let showRepeatedvalue = {}

const HashMaping = (str) => {
str.map((item,i) => {
        showRepeatedvalue[item] = showRepeatedvalue[item] ? showRepeatedvalue[item]+1 : 1
    })
}

HashMaping(testString)
console.log("showRepeatedvalue", showRepeatedvalue)
