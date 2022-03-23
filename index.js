const items = document.querySelectorAll('.item');
const icon = document.querySelector(".icon");

const popupEl = `
<div class="login-wrap">
<h2>Login</h2>

<div class="form">
  <input type="text" placeholder="Username" name="un" />
  <input type="password" placeholder="Password" name="pw" />
  <button> Sign in </button>
  <a href="#"> <p> Don't have an account? Register </p></a>
</div>
</div>
`

icon.onclick = () =>{
    location.href = "./app.html"
    //open("./app.html")
}

items.forEach(item => {
    item.addEventListener('click', (e)=>{
        const link = item.firstElementChild.getAttribute("href")
        location.href = link

    })
})



const app = document.querySelectorAll("div, a");
const modeBtn = document.querySelector('.modeBtn');

const toggleMode = () =>{
    if(localStorage.getItem('mode') === "Dark"){
        return  localStorage.setItem('mode', "Light")
    }else return localStorage.setItem('mode',"Dark")
}

const setMode = () =>{  
    toggleMode
    app.forEach(el => {
        el.classList.toggle(localStorage.getItem('mode'))
        
    })
   

}

modeBtn.onclick = setMode