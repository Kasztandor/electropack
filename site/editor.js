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

/*=========*/
/* PRESETS */
/*=========*/

let electropackConfig = window.electropackAPI.loadConfig()
window.electropackAPI.setConfig(electropackConfig)
let cursor = {x: 0, y: 0}

/*===========*/
/* CONSTANTS */
/*===========*/

const defaultFileStructure = {
    "main": {
        "advancements": {},
        "dimension": {},
        "dimension_type": {},
        "functions": {},
        "loot_tables": {},
        "predicates": {},
        "recipes": {},
        "structures": {},
        "tags": {},
        "chat_type": {},
        "damage_type": {},
        "worldgen": {
            "biome": {},
            "configured_carver": {},
            "configured_feature": {},
            "density_function": {},
            "flat_level_generator_preset": {},
            "noise": {},
            "noise_settings": {},
            "placed_feature": {},
            "processor_list": {},
            "structure": {},
            "structure_set": {},
            "template_pool": {},
            "world_preset": {}
        }
    },
}
const ignoredFiles = [".electropack.json"]

/*=================*/
/* EVENT LISTENERS */
/*=================*/

let pressedKeys = []
window.addEventListener('keydown', function(e) {
    if (pressedKeys.indexOf(e.key)==-1)
        pressedKeys.push(e.key)
    if (pressedKeys.indexOf("F12")!=-1){
        window.electropackAPI.devtools()
    }
    if (pressedKeys.indexOf("Control")!=-1 && pressedKeys.indexOf("s")!=-1){
        saveFile()
    }
})
window.addEventListener('keyup', function(e) {
    while (pressedKeys.indexOf(e.key)!=-1){
        pressedKeys.splice(pressedKeys.indexOf(e.key), 1)
    }
})
document.onmousemove = function(e){
    cursor.x = e.pageX
    cursor.y = e.pageY
}

/*================*/
/* CORE FUNCTIONS */
/*================*/

function editConfig(key, value, mode="add"){
    if (mode == "add" && electropackConfig[key].indexOf(value)==-1){
        electropackConfig[key].push(value)
        electropackConfig[key].sort()
    }
    else if (mode == "remove" && electropackConfig[key].indexOf(value)!=-1 && electropackConfig[key].length > 1){
        electropackConfig[key].splice(electropackConfig[key].indexOf(value), 1)
    }
    else if (mode == "setValue"){
        electropackConfig[key] = value
    }
    window.electropackAPI.setConfig(electropackConfig)
}

function pathJoiner(...args){
    let ret = args.join("/").replace(/\/+/g, '/')
    if (ret.endsWith("/"))
        ret = ret.substring(0, ret.length-1)
    return ret
}

/*====================*/
/* CHANGE EDITOR MODE */
/*====================*/

let editorMode = ""
function switchEditorMode(x){
    if (x == "filesEditor" && editorMode != "filesEditor"){
        editConfig("oppenedTab", "filesEditor", "setValue")
        document.querySelectorAll(".selectedMainTab").forEach(function(element){element.classList.remove("selectedMainTab")})
        document.querySelector("#filesEditorButton").classList.add("selectedMainTab")
        editorMode = "filesEditor"
        filesDisplay()
    }
    else if (editorMode != "visualEditor"){
        editConfig("oppenedTab", "visualEditor", "setValue")
        document.querySelectorAll(".selectedMainTab").forEach(function(element){element.classList.remove("selectedMainTab")})
        document.querySelector("#visualEditorButton").classList.add("selectedMainTab")
        editorMode = "visualEditor"
        document.querySelector("#leftBar").innerHTML = ''
    }
}

/*==================*/
/* CENTER FUNCITONS */
/*==================*/

function codeEditorChange(x){
    console.log(x)
    if (!document.getElementById("tab:"+x).classList.contains("edited")){
        document.getElementById("tab:"+x).classList.add("edited")
    }
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
function closeTab(id, approved="prompt"){
    if (approved == "prompt"){
        if (document.getElementById("tab:"+id).classList.contains("edited")){
            document.querySelector("#closePromptDiv").style.display = "block"
            document.querySelector("#closePrompt").innerHTML = '<div>Do you really want to close unsaved file?</div><div><button onclick=\'closeTab("'+id+'", true)\'>Yes</button><button  onclick=\'closeTab("'+id+'", false)\'>No</button></div>'
            return
        }
        closeTab(id, true)
    }
    document.querySelector("#closePromptDiv").style.display = "none"
    if (approved == true){
        document.getElementById("tab:"+id).remove()
        document.getElementById("content:"+id).remove()
        if (document.querySelector(".tab") == null){
            document.querySelector("#center").innerHTML = '<img src="logo.png"/>'
        }
        else{
            switchTab(document.querySelector(".tab").id.substring(4))
        }
    }
}
function openTab(x, type){
    let id = type+":"+x
    if (document.querySelector("#tabs") == null){
        document.querySelector("#center").innerHTML = '<div id="tabs"></div><div id="openedTab"></div>'
    }
    if (document.getElementById("tab:"+id) == null){
        if (type == "file"){
            var tab = '<i class="icon-doc"></i> '+x.split("/")[x.split("/").length-1]
            var content = '<div class="codeEditor" contenteditable="true" oninput=\'codeEditorChange("'+id+'")\'><div>'+window.electropackAPI.readFile(x).replace("\n", "</div><div>")+'</div></div>'
        }
        document.querySelector("#tabs").innerHTML += '<div id="tab:'+id+'" class="tab" onclick="switchTab(\''+id+'\')">'+tab+' <i class="icon-cancel" onclick=\'closeTab("'+id+'")\'></i></div>'
        document.querySelector("#openedTab").innerHTML += '<div class="openedTabContent" id="content:'+id+'">'+content+'</div>'
    }
    switchTab(id)
}

function saveFile(id = null){
    if (document.getElementsByClassName("tab").length == 0)
        return
    if (id == null)
        id = document.querySelector(".selectedTab").id.substring(4)
    let content = document.getElementById("content:"+id).childNodes[0].innerText
    window.electropackAPI.writeFile(id.substring(5), content)
    document.getElementById("tab:"+id).classList.remove("edited")
}

/*====================*/
/* VISUAL EDITOR MODE */
/*====================*/



/*===================*/
/* FILES EDITOR MODE */
/*===================*/

function switchOpen(x){
    if (document.getElementById("dir:"+x) == null){
        document.getElementById(x).childNodes.forEach(e => e.classList.replace("icon-angle-right", "icon-angle-down"))
        document.getElementById(x).insertAdjacentHTML("afterend", fileStructureGenerator(document.getElementById(x).parentElement.style.getPropertyValue('--depth')*1+1, x))
        editConfig("oppenedDirs", x, "add")
    }
    else{
        document.getElementById(x).childNodes.forEach(e => e.classList.replace("icon-angle-down", "icon-angle-right"))
        document.getElementById("dir:"+x).remove()
        editConfig("oppenedDirs", x, "remove")
    }
}

function createSub(x, type, requestType="prompt", thisElement=null){
    if (requestType == "close"){
        document.getElementById("createSubPromptDiv").style.display = "none"
    }
    else if (requestType == "prompt"){
        document.getElementById("createSubPromptDiv").style.display = "block"
        document.getElementById("createSubPrompt").style.setProperty("--cursorX", cursor.x+"px")
        document.getElementById("createSubPrompt").style.setProperty("--cursorY", cursor.y+"px")
        if (type == "file"){
            document.getElementById("createSubPrompt").innerHTML = `
            <div>`+x+`</div>
            <div>Rename:</div>
            <div class="nopadding"><input type="text" placeholder="Rename" value=`+x.split("/")[x.split("/").length-1]+` onkeydown='if (event.key === "Enter") createSub("`+x+`", "file", "rename", this);'></div>
            <div class="clickable">Remove</div>
        `
        }
        else if (type == "dir"){
            document.getElementById("createSubPrompt").innerHTML = `
                <div>`+x+`</div>
            `
        }
    }
    else if (requestType == "rename"){
        document.getElementById("createSubPromptDiv").style.display = "none"
        if (thisElement.value != ""){
            let newPath = x.split("/")
            let name = newPath[newPath.length-1]
            newPath[newPath.length-1] = thisElement.value
            newPath = newPath.join("/")
            //window.electropackAPI.rename(x, newPath)
            document.getElementById("dir:"+x).id = "dir:"+newPath
            document.getElementById(x).id = newPath
            document.getElementById("tab:file:"+x).id = "tab:file:"+newPath
            document.getElementById("content:file:"+x).id = "content:file:"+newPath
            document.getElementById("tab:file:"+newPath).innerHTML = '<i class="icon-doc"></i> '+newPath.split("/")[newPath.split("/").length-1]
            document.getElementById("content:file:"+newPath).childNodes[0].innerText = window.electropackAPI.readFile(newPath)
            document.getElementById("createSubPromptDiv").style.display = "none"
        }
    }
}

function fileStructureGenerator(depth=0, path="/"){
    let returnString = '<div id="'+"dir:"+path+'" class="directoryStorage" style="--depth: '+depth+';">'
    let scannedFiles = window.electropackAPI.readDir(path)
    scannedFiles["dirs"].forEach(function(element){
        let subdir = ""
        let icon = "icon-angle-right"
        if (electropackConfig.oppenedDirs.includes(pathJoiner(path, element))){
            subdir = fileStructureGenerator(depth+1, pathJoiner(path, element))
            icon = "icon-angle-down"
        }
        let dir = '<div id="'+pathJoiner(path, element)+'" class="directory" onclick=\'switchOpen("'+pathJoiner(path, element)+'")\' oncontextmenu=\'createSub("'+pathJoiner(path, element)+'", "dir")\'><i class="'+icon+'"></i><span>'+element+'</span></div>'
        returnString += dir+subdir
    })
    scannedFiles["files"].forEach(function(element){
        if (!ignoredFiles.includes(element)){
            returnString += '<div class="file" onclick=\'openTab("'+pathJoiner(path, element)+'", "file")\' oncontextmenu=\'createSub("'+pathJoiner(path, element)+'", "file")\'><i class="icon-doc"></i><span>'+element+'</span></div>'
        }
    })
    return returnString+"</div>"
}
function filesDisplay(){
    document.querySelector("#leftBar").innerHTML = '<div id="files"></div>'
    document.querySelector("#files").innerHTML = fileStructureGenerator()
}

/*======*/
/* INIT */
/*======*/

window.onload = ()=>{switchEditorMode(electropackConfig.oppenedTab)}