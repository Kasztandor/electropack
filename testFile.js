const fs = require('node:fs')
const path = require('node:path')

let dir = "/home/kasztandor/Pulpit/testdir"
let dirs = []
let files = []

fs.readdirSync(dir).forEach(file => {
    if (fs.statSync(path.join(dir,file)).isDirectory()){
        dirs.push(file)
    }
    else{
        files.push(file)
    }
})
console.log(dirs)
console.log("=====")
console.log(files)