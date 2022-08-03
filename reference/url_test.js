const url  = require('url')

const myUrl = new URL('http://mywebsite.com:8000/hello.html?id=12345&status=active')

// its inclue port like (mywebsite.com:8000)
console.log(myUrl.host)

// get the hostname not incl port (mywebsite.com)
console.log(myUrl.hostname)

// seriallize url query ?
console.log(myUrl.search);

// search prama object
console.log(myUrl.searchParams);

// adding search params
myUrl.searchParams.append('token','mytoken-1234')
console.log(myUrl.searchParams);
console.log('get--->', myUrl.searchParams.get('token'));

// delete param using .delete
myUrl.searchParams.delete('toke')

myUrl.searchParams.forEach(( name, val) => {console.log(`${val}: ${name}`);})

