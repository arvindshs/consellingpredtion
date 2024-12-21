const btnEL = document.getElementById("btn")
async function predictionfun() {
    const cutoffEl = document.getElementById("cutoff").value
    const communityEl = document.getElementById("community").value
    const courseEl = document.getElementById("course").value
    const serverResponse = await fetch("/prediction",{
    method:"POST",
     headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      cutoff_mark:cutoffEl,
      community:communityEl,
      course:courseEl
    })
    }) 
    const jdata = await serverResponse.json();
    console.log({"Response":jdata});
    // console.log({
    //     cutoff_mark:cutoffEl,
    //       community:communityEl,
    //       course:courseEl
    // });
    
}
btnEL.addEventListener("click",(e)=>{
    e.preventDefault()
    predictionfun()
})