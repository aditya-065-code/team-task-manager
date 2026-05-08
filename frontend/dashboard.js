const user = localStorage.getItem("user");

if(!user){
  window.location.href = "index.html";
}

document.getElementById("username").innerText = user;

function logout(){

  localStorage.removeItem("user");

  window.location.href = "index.html";
}

const ctx = document.getElementById("taskChart");

new Chart(ctx, {
  type: "doughnut",

  data: {
    labels: ["Completed", "Pending", "In Progress"],

    datasets: [{
      data: [10,5,3],

      backgroundColor: [
        "#16a34a",
        "#f59e0b",
        "#2563eb"
      ]
    }]
  }
});