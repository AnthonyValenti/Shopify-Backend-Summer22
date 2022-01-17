var table = document.getElementById("myTable");
var tbody = document.getElementById("tbody");
var currSerial ="";
const addBtn = document.getElementById("addBtn");
const confirmBtn = document.getElementById("confirmBtn");
const confirmEditBtn = document.getElementById("confirmEditBtn");
const selectAll = document.getElementById("selectAll");
const addItemWrapper = document.getElementById("addItemWrapper");
const exportBtn = document.getElementById("export");
document.onload=updateTable();

async function updateTable() {
  const response = await fetch("http://localhost:5501/inventory"); // change to heroku
  const data = await response.json();
  let row =1;
  for(item of data){
    if(row>=table.rows.length){
       tbody.insertAdjacentHTML(
         "beforeend",
         `<tr><th scope="row"> ${table.rows.length} <input type ="checkbox"></input></th><td></td><td></td><td></td><td></td></tr>`
       );
    }
    table.rows[row].cells[1].innerText = item.serial;
    table.rows[row].cells[2].innerText = item.name;
    table.rows[row].cells[3].innerText = item.price;
    table.rows[row].cells[4].innerText = item.stock;
    row++;
  }
}

function insertRow(serial,name,price,stock){
  row =table.rows.length;
  tbody.insertAdjacentHTML(
    "beforeend",
    `<tr><th scope="row"> ${table.rows.length} <input type ="checkbox"></input></th><td></td><td></td><td></td><td></td></tr>`
  );
  table.rows[row].cells[1].innerText = serial;
  table.rows[row].cells[2].innerText = name;
  table.rows[row].cells[3].innerText = price;
  table.rows[row].cells[4].innerText = stock;
}

addBtn.onclick = function () {
  addItemWrapper.style.visibility = "visible";

};

confirmBtn.onclick = function () {
  axios
    .post("http://localhost:5501/inventory/add", {
      serial: document.getElementById("addSerial").value,
      name: document.getElementById("addName").value,
      price: Number(document.getElementById("addPrice").value).toFixed(2),
      stock: document.getElementById("addStock").value,
    })
    .then(function(res){
      insertRow(
        document.getElementById("addSerial").value,
        document.getElementById("addName").value,
        Number(document.getElementById("addPrice").value).toFixed(2),
        document.getElementById("addStock").value
      );
    })
    .catch(function(error){
      if (document.getElementById("addPrice").value<0) {
        window.alert("Error: Negative prices not accepted");
      }
      if (document.getElementById("addStock").value < 0) {
        window.alert("Error: Negative stock not accepted");
      }
      if (Number.isInteger(document.getElementById("addStock").value)==false) {
        window.alert("Error: Stock must be a whole number");
      } 
      else {
        window.alert(
          "Error: Ensure unique serial number"
        );
      }

    });


  
};

deleteBtn.onclick = function () {
  for(let i=1; i <table.rows.length; i++){
    if(table.rows[i].cells[0].children[0].checked){
      axios.delete("http://localhost:5501/inventory/"+table.rows[i].cells[1].innerText)
        .then(function(res){
          location.reload();
        });
    }
  }

};

confirmEditBtn.onclick= function(){
      axios.post("http://localhost:5501/inventory/update/"+currSerial, {
          serial: document.getElementById("editSerial").value,
          name: document.getElementById("editName").value,
          price: Number(document.getElementById("editPrice").value).toFixed(2),
          stock: document.getElementById("editStock").value,
        })
        .then(function (res) {
          location.reload();
        });
    
};

editBtn.onclick = function(){
   for (let i = 1; i < table.rows.length; i++) {
     if (table.rows[i].cells[0].children[0].checked) {
        document.getElementById("editItemWrapper").style.visibility="visible";
        currSerial = table.rows[i].cells[1].innerText;
        (document.getElementById("editSerial").value = table.rows[i].cells[1].innerText),
        (document.getElementById("editName").value = table.rows[i].cells[2].innerText),
        (document.getElementById("editPrice").value = table.rows[i].cells[3].innerText),
        (document.getElementById("editStock").value = table.rows[i].cells[4].innerText);
       
     }
   }

};

cancelEditBtn.onclick = function(){
  document.getElementById("editItemWrapper").style.visibility = "hidden";
};

cancelAddBtn.onclick = function () {
  document.getElementById("addItemWrapper").style.visibility = "hidden";
};


exportBtn.onclick = function () {
  const lines= []
  const numCols = 5;
  for (const row of Array.from(table.querySelectorAll("tr"))) {
    let line = "";

    for (let i = 1; i < numCols; i++) {
      if (row.children[i] !== undefined) {
        parsedValue=row.children[i].textContent.replace(/"/g, `""`);
        parsedValue = /[",\n]/.test(parsedValue) ? `"${parsedValue}"` : parsedValue;
        line += parsedValue;
      }

      line += i !== numCols - 1 ? "," : "";
    }

    lines.push(line);
  }
  const csvFile = lines.join("\n");
  const csvBlob = new Blob([csvFile], { type: "text/csv" });
  const url = URL.createObjectURL(csvBlob);
  const anchorElement = document.createElement("a");
  anchorElement.href = url;
  anchorElement.download = "inventory-export.csv";
  anchorElement.click();
};


function colSelect() {
  if (selectAll.checked) {
    for (let i = 1; i < table.rows.length; i++) {
      table.rows[i].cells[0].children[0].checked = true;
    }

  } else {
    for (let i = 1; i < table.rows.length; i++) {
      table.rows[i].cells[0].children[0].checked = false;
    }
  }
}
