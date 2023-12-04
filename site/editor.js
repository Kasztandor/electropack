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

/////////////////////
// EVENT LISTENERS //
/////////////////////

window.addEventListener('keydown', function(e) {
    if (e.key === 'F12') {
        window.electropackAPI.devtools()
    }
})

let dir = "/home/kasztandor/Pulpit/testdir"
let electropack = window.electropackAPI.loadConfig(dir)

////////////////////////
// CHANGE EDITOR MODE //
////////////////////////

let editorMode = ""
function switchEditorMode(x){
    if (x == "visualEditor" && editorMode != "visualEditor"){
        document.querySelectorAll(".selectedMainTab").forEach(function(element){element.classList.remove("selectedMainTab")})
        document.querySelector("#visualEditorButton").classList.add("selectedMainTab")
        editorMode = "visualEditor"
    }
    else if (x == "filesEditor" && editorMode != "filesEditor"){
        document.querySelectorAll(".selectedMainTab").forEach(function(element){element.classList.remove("selectedMainTab")})
        document.querySelector("#filesEditorButton").classList.add("selectedMainTab")
        editorMode = "filesEditor"
        filesDisplay()
    }
}

//////////////////////
// CENTER FUNCITONS //
//////////////////////

function codeEditorChange(x){
    if (!x.classList.contains("edited")){
        x.classList.add("edited")
        console.log(x.parentElement.id.substring(8))
    }
}
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
        document.querySelector("#promptDiv").style.display = "block"
        document.querySelector("#prompt").innerHTML = '<div>Do you really want to close unsaved file?</div><div><button onclick=\'closeTab("'+id+'", true)\'>Yes</button><button  onclick=\'closeTab("'+id+'", false)\'>No</button></div>'
        return
    }
    document.querySelector("#promptDiv").style.display = "none"
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
            var tabContent = '<i class="icon-doc"></i> '+x.split("/")[x.split("/").length-1]
            var contentContent = '<div id="codeEditor" contenteditable="true" oninput="codeEditorChange(this)"></div>'
        }
        document.querySelector("#tabs").innerHTML += '<div id="tab:'+id+'" class="tab" onclick="switchTab(\''+id+'\')">'+tabContent+' <i class="icon-cancel" onclick=\'closeTab("'+id+'")\'></i></div>'
        document.querySelector("#openedTab").innerHTML += '<div display="none" class="openedTabContent" id="content:'+id+'">'+contentContent+'</div>'
    }
    switchTab(id)
}

////////////////////////
// VISUAL EDITOR MODE //
////////////////////////

///////////////////////
// FILES EDITOR MODE //
///////////////////////

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
function filesDisplay(){
    let files = ["dir:Datapack", ["dir:data", ["dir:namespace", ["dir:advancements", "dir:dimension", "dir:dimension_type", "dir:functions", "dir:loot_tables", "dir:predicates", "dir:recipes", "dir:structures", "dir:tags", "dir:chat_type", "dir:damage_type", "dir:worldgen", ["dir:biome", "dir:configured_carver", "dir:configured_feature", "dir:density_function", "dir:flat_level_generator_preset", "dir:noise", "dir:noise_settings", "dir:placed_feature", "dir:processor_list", "dir:structure", "dir:structure_set", "dir:template_pool", "dir:world_preset"]], "dir:minecraft", ["dir:tags", ["dir:functions", ["file:load.json", "file:tick.json"]]]], "file:pack.mcmeta", "file:pack.png"]]
    document.querySelector("#leftBar").innerHTML = '<div id="files"></div>'
    document.querySelector("#files").innerHTML = fileStructureGenerator(files)
}

//////////
// INIT //
//////////

window.onload = ()=>{switchEditorMode("visualEditor")}