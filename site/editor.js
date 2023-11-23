/*function getCursorPosition(contentEditableElement) {
    let range = window.getSelection().getRangeAt(0);
    let preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(contentEditableElement);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    return preCaretRange.toString().length;
}
function setCursorPosition(contentEditableElement, position) {
    if (contentEditableElement.childNodes.length > 0) {
        let range = document.createRange();
        let selection = window.getSelection();
        position = Math.min(position, contentEditableElement.childNodes[0].length);
        range.setStart(contentEditableElement.childNodes[0], position);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        contentEditableElement.focus();
    }
}
function codeEditorColors(x){
    let keywords1 = ["clear","clone","deop","difficulty","effect","enchant","execute","fill","function","gamemode","gamerule","give","help","kick","kill","list","locate","me","msg","op","particle","playsound","reload","say","scoreboard","setblock","setworldspawn","spawnpoint","spreadplayers","stopsound","summon","tag","teleport","tell","tellraw","time","title","tp","w","weather","xp","return","advancement","attribute","ban","ban-ip","banlist","bossbar","damage","data","datapack","debug","defaultgamemode","experience","fillbiome","forceload","item","jfr","loot","pardon","pardon-ip","perf","place","publish","random","recipe","ride","save-all","save-off","save-on","schedule","seed","setidletimeout","spectate","stop","team","teammsg","tm","trigger","whitelist","worldborder"]
    let pos = getCursorPosition(x)
    let content = x.innerText;
    keywords1.forEach(function(keyword){
        let regex = new RegExp("\\b" + keyword + "\\b", "g");
        content = content.replace(regex, '<span class="kw1">'+keyword+'</span>');
    });
    x.innerHTML = content;
    setCursorPosition(x, pos);
}*/
function codeEditorColors(x){}
function switchOpen(x){
    let parentElement = x.parentElement
    let nextSibling = parentElement.nextElementSibling
    if (nextSibling.style.display == "none"){
        nextSibling.style.display = "block"
        x.classList.remove("icon-angle-right")
        x.classList.add("icon-angle-down")
    }
    else{
        nextSibling.style.display = "none"
        x.classList.remove("icon-angle-down")
        x.classList.add("icon-angle-right")
    }
}
function fileStructureGenerator(files, depth=1, path="/"){
    let returnString = ""
    files.forEach(function(element, index, array){
        if (typeof(element) == "string"){
            if (element.startsWith("dir:")){
                let temp = ""
                if ((index === array.length - 1) || (typeof(array[index+1]) == "string")){
                    temp = '<i class="icon-angle-down"></i>'
                }
                else{
                    temp = '<i class="icon-angle-down clickableI" onclick="switchOpen(this)"></i>'
                }
                returnString += '<div class="directory">'+temp+'<span>'+element.substring(4)+'</span></div>'
            }
            else{
                returnString += '<div class="file" onclick=\'openTab("'+path+element.substring(5)+'", "file")\'><i class="icon-doc"></i><span>'+element.substring(5)+'</span></div>'
            }
        }
        else{
            returnString += '<div class="directoryStorage" style="--depth: '+depth+'px;">'+fileStructureGenerator(element, depth+1, path+array[index-1].substring(4)+"/")+'</div>'
        }
    })
    return returnString
}
function switchTab(id){
    document.querySelectorAll(".openedTabContent").forEach(function(element){
        element.style.display = "none"
    })
    document.querySelectorAll(".tab").forEach(function(element){
        element.classList.remove("selectedTab")
    })
    document.getElementById("content:"+id).style.display = "block"
    document.getElementById("tab:"+id).classList.add("selectedTab")
}
function closeTab(id){
    document.getElementById("tab:"+id).remove()
    document.getElementById("content:"+id).remove()
    if (document.querySelector(".tab") == null){
        document.querySelector("#center").innerHTML = '<img src="logo.png"/>'
    }
}
function openTab(x, type){
    let id = type+":"+x
    if (document.querySelector("#tabs") == null){
        document.querySelector("#center").innerHTML = '<div id="tabs"></div><div id="openedTab"></div>'
    }
    if (document.getElementById("tab:"+id) == null){
        if (type == "file"){
            document.querySelector("#tabs").innerHTML += '<div id="tab:'+id+'" class="tab" onclick="switchTab(\''+id+'\')"><i class="icon-doc"></i> '+x.split("/")[x.split("/").length-1]+' <i class="icon-cancel"></i></div>'
            document.querySelector("#openedTab").innerHTML += '<div class="openedTabContent" id="content:'+id+'"><div id="codeEditor" contenteditable="true" oninput="codeEditorColors(this)"></div></div>'
        }
        //document.querySelector("#openedTab").innerHTML = '<div id="openedTabContent"></div>'
    }
    switchTab(id)
}
function filesTab(){
    let files = ["dir:Datapack", ["dir:data", ["dir:namespace", ["dir:advancements", "dir:functions", "dir:loot_tables", "dir:predicates"], "dir:minecraft", ["dir:tags", ["dir:functions", ["file:load.json", "file:tick.json"]]]], "file:pack.mcmeta", "file:pack.png"]]
    document.querySelector("#leftBar").innerHTML = '<div id="files"></div>'
    document.querySelector("#files").innerHTML = fileStructureGenerator(files)
}

window.onload = filesTab