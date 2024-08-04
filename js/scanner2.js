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
  const data = await fetch("http://localhost/verification", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      id: qrCodeMessage,
      event: eventName,
    }),
  })
    .then((t) => t.json())
    .catch((e) => console.log("Error : ", e));
  console.log(qrCodeMessage);
  console.log(data.status);

  if (data.status) {
    document.getElementById("reader").style.display = "none";
    document.getElementById("reader_col").innerHTML = `
    <div id="page2">
      <div class="camera" style="display: flex;flex-direction: column;align-items: center;">
        <h3 id="heading" style="color:white;padding:5px">Take Face Photo</h3>
        
        <video id="video" width="640" height="480" autoplay></video>
        <canvas id="canvas" width="640" height="480" style="display:none;"></canvas>
        <button id="capture">Capture</button>
        
      </div >
    </div > `;
    var i = 1;
    var fileValue = "";
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const captureButton = document.getElementById("capture");
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (stream) {
        video.srcObject = stream;
        video.play();
      })
      .catch(function (err) {
        console.log("An error occurred: " + err);
      });

    captureButton.addEventListener("click", function () {
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      if (i == 1) {
        fileValue = "Face";
      }
      if (i == 2) {
        fileValue = "Id";
      }
      // Save the image
      const imageData = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = imageData;
      a.download = `${fileValue}_${data._doc.regid}_${Date()}.png`;
      a.click();
      i = i + 1;
      if (i == 2) {
        document.getElementById("heading").innerText = "Id Card Photo";
      }
      if (i == 3) {
        captureButton.style.display = "none";
        // document.getElementById('main').style.display = "none"
        // document.getElementById('done').style.display = "flex"
        // document.getElementById('inBut').style.display = "flex"
        // document.getElementById('outBut').style.display = "flex"
        document.getElementById("result").innerHTML = "Success";
        setTimeout(() => {
          location.reload();
        }, 1000);
      }
    });
    document.getElementById("result").innerHTML = `
            <div class="d1">
              <p>Name</p>
              <p>Email</p>
              <p>Registration Number</p>
              <p>Events</p>
            </div>
            <div class="mid">
              <p style="color: black; " >-</p>
              <p style="color: black; " >-</p>
              <p style="color: black; " >-</p>
              <p style="color: black; " >-</p>
  
            </div>
            <div class="d2">
              <p>  ${data._doc.name}</p>
              <p>  ${data._doc.email}</p>
              <p>  ${data._doc.regid}</p>
              <p>  ${data._doc.event_name}</p>
            </div>
                  `;
  } else {
    document.getElementById("result").innerHTML = "⚠️⚠️⚠️ Invalid ⚠️⚠️⚠️";
    setTimeout(() => {
      location.reload();
    }, 1000);
  }
  // let data = {
  //   "Name": "Sanidhya",
  //   "RegNo": "22BAI10234",
  //   "Email": "sanidhyasahu2022@gmail.com",
  //   "Events": ["Day 1", "Day 2", "Day 3"]
  // }
}

function onScanError(errorMessage) {
  // Handle Scan Error
}

var html5QrCodeScanner = new Html5QrcodeScanner("reader", {
  fps: 10,
  qrbox: 500,
});

html5QrCodeScanner.render(async (qrCodeMessage) => {
  if (isScanning) {
    await onScanSuccess(qrCodeMessage);
  }
}, onScanError);

document.getElementById("reader").children[0].children[1].style.visibility =
  "hidden";
