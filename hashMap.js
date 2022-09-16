// using hashmapping to find the unique key and its length

let str = 'abbbbassdfd'.split('').sort()
let obj = {}
let tested={}
const hashMapping =(testStr) =>{

    testStr.map((item) =>{
        obj[item] = obj[item]? obj[item]+1: 1
    })
    const value =  Object.entries(obj).map((item,i)=> item[1]).reduce((pre, next)=> pre>next?pre:next )
    const max =  Object.keys(obj).reduce((key, value)=>  Math.max(key,obj[value]), -Infinity )
    const objKey = Object.keys(obj).filter((item) => obj[item]===max)
    delete obj.a
    tested[objKey]  = value
    }

    hashMapping(str)
    console.log(tested)
