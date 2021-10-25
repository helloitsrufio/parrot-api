const clickButton = document.getElementById('button')

Array.from(loadText).forEach((element) =>{
    element.addEventListener('click', getParrot)
})

async function getParrot() {
    const parrotImageQ = this.parentNode.childNodes[0].innerText
    const parrotNameQ = this.parentNode.childNodes[1].innerText
    const parrotColorQ = this.parentNode.childNodes[0].innerText
    const naturalHabitatQ = this.parentNode.childNodes[1].innerText
    const definingCharacteristicQ = this.parentNode.childNodes[2].innerText

    try{
        const response = await fetch('getParrotInfo', {
            method: 'get',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'pImage' : parrotImageQ,
                'pName' : parrotNameQ,
                'pColor' : parrotColorQ,
                'nHabitat' : naturalHabitatQ,
                'dCharacteristic' : definingCharacteristicQ
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
        
    }catch(err){
        console.log(err)
    }
}