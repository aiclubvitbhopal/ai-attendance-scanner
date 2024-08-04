let isScanning = true;
const next = () => {
  isScanning = true;
  document.getElementById("result").innerHTML = "Please Show the QR code";
  document.querySelector(".result_col").style =
    " background-color: rgba(62,214,37,1) ; color: black;";
};

let paramString = window.location.href.split("?")[1];
let queryString = new URLSearchParams(paramString);
const eventName = queryString.entries().next().value[1];
console.log(eventName);

async function onScanSuccess(qrCodeMessage) {
  isScanning = false;
  console.log(qrCodeMessage);
  const data = await fetch("http://localhost:1337/ticket/verification", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      id: qrCodeMessage,
      event: eventName,
    }),
  })
    .then((t) => t.json())
    .catch((e) => console.log("Error : ", e));

  if (data.status) {
    console.log(data);
    document.getElementById(
      "result"
    ).innerHTML = `<div class="result"> ${qrCodeMessage} </div>
      <button class="next_scan" onClick="next()" >Next Scan</button>
      <div class="data">${data._doc.name}</div>
      <div class="data">${data._doc.regid}</div>
      <div class="data">${data._doc.email}</div>
      <div class="data">${data._doc.contact}</div>
      <div class="data">${data._doc.events.join("<br><hr>")}</div>
    `;
    document.querySelector(".result_col").style =
      " background-color: rgba(0,100,1,1) ; ";
  } else {
    document.getElementById(
      "result"
    ).innerHTML = `<div class="result"> Invalid! </div>
      <button class="next_scan" onClick="next()" >Next Scan</button>
    `;
    document.querySelector(".result_col").style =
      " background-color: rgba(129,8,8,1) ; color: white;";
  }
}

function onScanError(errorMessage) {
  // Handle Scan Error
}

var html5QrCodeScanner = new Html5QrcodeScanner("reader", {
  fps: 10,
  qrbox: 250,
});

html5QrCodeScanner.render(async (qrCodeMessage) => {
  if (isScanning) {
    await onScanSuccess(qrCodeMessage);
  }
}, onScanError);
