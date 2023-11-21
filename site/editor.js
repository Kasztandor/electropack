function switchOpen(x){
    let parentElement = x.parentElement;
    let nextSibling = parentElement.nextElementSibling;
    if (nextSibling.style.display == "none"){
        nextSibling.style.display = "block"
        x.classList.remove("icon-right-open")
        x.classList.add("icon-down-open")
    }
    else{
        nextSibling.style.display = "none"
        x.classList.remove("icon-down-open")
        x.classList.add("icon-right-open")
    }
}
function fileStructureGenerator(files, depth=1){
    let returnString = ""
    files.forEach(function(element, index, array){
        if (typeof(element) == "string"){
            if (element.startsWith("fld:")){
                let temp = ""
                if ((index === array.length - 1) || (typeof(array[index+1]) == "string")){
                    temp = '<i class="icon-down-open"></i>'
                }
                else{
                    temp = '<i class="icon-down-open clickableI" onclick="switchOpen(this)"></i>'
                }
                returnString += '<div class="directory">'+temp+'<span>'+element.substring(4)+'</span></div>'
            }
            else{
                returnString += '<div class="file"><i class="icon-doc""></i><span>'+element.substring(5)+'</span></div>'
            }
        }
        else{
            returnString += '<div class="directoryStorage" style="--depth: '+depth+'px;">'+fileStructureGenerator(element, depth+1)+'</div>'
        }
    })
    return returnString
}
function loadFiles(){
    let files = ["fld:Main", ["fld:test1", ["fld:test2", "file:file2"], "file:mainfile", "file:file3"]]
    document.querySelector("#leftBar").innerHTML = '<div id="files"></div>'
    document.querySelector("#files").innerHTML = fileStructureGenerator(files)
}

window.onload = loadFiles