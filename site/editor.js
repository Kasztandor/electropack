function codeEditorColors(x){
    let keywords1 = ["clear","clone","deop","difficulty","effect","enchant","execute","fill","function","gamemode","gamerule","give","help","kick","kill","list","locate","me","msg","op","particle","playsound","reload","say","scoreboard","setblock","setworldspawn","spawnpoint","spreadplayers","stopsound","summon","tag","teleport","tell","tellraw","time","title","tp","w","weather","xp","return","advancement","attribute","ban","ban-ip","banlist","bossbar","damage","data","datapack","debug","defaultgamemode","experience","fillbiome","forceload","item","jfr","loot","pardon","pardon-ip","perf","place","publish","random","recipe","ride","save-all","save-off","save-on","schedule","seed","setidletimeout","spectate","stop","team","teammsg","tm","trigger","whitelist","worldborder"]
    let content = x.innerHTML//.replaceAll("<span>", "").replaceAll("</span>", "").replaceAll("<div>", "").replaceAll("<br>", "").replaceAll("</div>", "\n")
    keywords1.forEach(element => {
        content = content.replaceAll(element, '<span class="kw1">'+element+'</span>')
    });
    console.log(content)
    x.innerHTML = "<div>"+content.replaceAll("\n", "</div><div>")+"</div>"
}
function switchOpen(x){
    let parentElement = x.parentElement
    let nextSibling = parentElement.nextElementSibling
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
function openFile(path){
    console.log(path)
}
function fileStructureGenerator(files, depth=1, path="/"){
    let returnString = ""
    files.forEach(function(element, index, array){
        if (typeof(element) == "string"){
            if (element.startsWith("dir:")){
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
                returnString += '<div class="file" onclick=\'openFile("'+path+element.substring(5)+'")\'><i class="icon-doc""></i><span>'+element.substring(5)+'</span></div>'
            }
        }
        else{
            returnString += '<div class="directoryStorage" style="--depth: '+depth+'px;">'+fileStructureGenerator(element, depth+1, path+array[index-1].substring(4)+"/")+'</div>'
        }
    })
    return returnString
}
function loadFiles(){
    let files = ["dir:Datapack", ["dir:data", ["dir:namespace", ["dir:advancements", "dir:functions", "dir:loot_tables", "dir:predicates"], "dir:minecraft", ["dir:tags", ["dir:functions", ["file:load.json", "file:tick.json"]]]], "file:pack.mcmeta", "file:pack.png"]]
    document.querySelector("#leftBar").innerHTML = '<div id="files"></div>'
    document.querySelector("#files").innerHTML = fileStructureGenerator(files)
}

window.onload = loadFiles