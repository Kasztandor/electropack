function switchOpen(x){
    let el = x.parentElement;
    if (el.classList.contains("close"))
        el.classList.remove("close")
    else
        el.classList.add("close")
}