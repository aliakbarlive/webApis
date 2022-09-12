// using hashmapping to find the unique key and its length

let str = 'aaaabbssdfd'.split('').sort()
let obj = {}

const hashMapping =(testStr) =>{

    testStr.map((item) =>{
        obj[item] = obj[item]? obj[item]+1: 1
        // delete obj[item]
    })
    // const res =  Object.entries(obj).map((item,i)=> item[1]).reduce((pre, next)=> pre>next?pre:next )
    const res =  Object.keys(obj).reduce((key, value)=>  Math.max(key,obj[value]), -Infinity )
    const tested = Object.keys(obj).filter((item) => obj[item]===res)
    console.log(tested)
}

hashMapping(str)
// find the larget or repeated value and only show the result

// obj['a']= 5

// console.log(obj)
