var a = document.getElementById("loginBtn");
var b = document.getElementById("registerBtn");
var x = document.getElementById("login");
var y = document.getElementById("register");

function login() {
    x.style.left = "20px";
    y.style.right = "-560px";
    a.className = "btn white-btn";
    b.className = "btn";
    x.style.opacity = "1";
    y.style.opacity = "0";
}

function register() {
    x.style.left = "-560px";
    y.style.right = "20px";
    a.className = "btn";
    b.className = "btn white-btn";
    x.style.opacity = "0";
    y.style.opacity = "1";
}