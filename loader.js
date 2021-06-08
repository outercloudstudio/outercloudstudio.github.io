var animTime = 300

window.onload = () => {
    const transitionEl = document.querySelector(".loader")
    const links = document.querySelectorAll("a")
    const linkButtons = document.querySelectorAll("button")

    for(let i = 0; i < linkButtons.length; i++){
        const button = linkButtons[i]

        if(button.hasAttribute("data-is-link")){
            console.log(button)
            if(button.dataset.targetLocation.slice(-1) !== "#"){
                button.addEventListener("click", e => {
                    e.preventDefault()

                    console.log(e)
                    
                    let target = e.target.dataset.targetLocation

                    if(e.target.hasAttribute("data-open-in-new-tab")){
                        setTimeout(() => {
                            window.open(target)
                        }, animTime)
                    }else{
                        transitionEl.classList.add("is-active")
                        transitionEl.classList.remove("ready")

                        setTimeout(() => {
                            window.location.href = target
                        }, animTime)
                    }
                })
            }
        }
    }  

    for(let i = 0; i < links.length; i++){
        const link = links[i]

        if(link.href.slice(-1) !== "#"){
            link.addEventListener("click", e => {
                e.preventDefault()
                let target = e.target.href

                if(e.target.hasAttribute("target")){
                    setTimeout(() => {
                        window.open(target)
                    }, animTime)
                }else{               
                    transitionEl.classList.add("is-active")
                    transitionEl.classList.remove("ready")

                    setTimeout(() => {
                        window.location.href = target
                    }, animTime)
                }
            })
        }
    }

    transitionEl.classList.remove("is-active")

    setTimeout(() => {
        transitionEl.classList.add("ready")
    }, animTime)
}