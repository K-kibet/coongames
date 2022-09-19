const items = document.querySelectorAll('.item');
const icon = document.querySelector(".icon");

icon.onclick = () =>{
    location.href = "./app.html"
}

items.forEach(item => {
    item.addEventListener('click', (e)=>{
        const link = item.firstElementChild.getAttribute("href")
        location.href = link

    })
})


    