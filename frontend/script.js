async function login(){

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if(email === "admin@gmail.com" && password === "123456"){

    localStorage.setItem("user","Aditya");

    window.location.href = "dashboard.html";

  } else {

    alert("Invalid Credentials");

  }

}