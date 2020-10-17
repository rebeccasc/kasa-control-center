let { Client } = require('tplink-smarthome-api');

let client = new Client();
var backgroundOn = "#468153";
var backgroundOff = getComputedStyle(document.documentElement).getPropertyValue("-well-bg-color");

// on load
client.startDiscovery().on('device-new', (device) => {
  // device template
  deviceTemplate = document.getElementById("device-template").cloneNode(true);
  deviceTemplate.style.display = "block";
  deviceButton = deviceTemplate.children[0].children[0];
  deviceButton.innerHTML = `${device.alias}`;
  
  // listener
  deviceButton.addEventListener("click", function(){
    device.getPowerState().then( function(response){                               
        if(response == true){
          turnOff(device);
        }
        else{
          turnOn(device);
        }
    });
  });

  // set state-layout
  device.getPowerState().then( function(response){                               
        if(response == true){
          setDevicePanelBackground(device, backgroundOn)
        }
        else{
          setDevicePanelBackground(device, backgroundOff)
        }
  });

  // add to view
  mainContainer = document.getElementById("main-container");
  mainContainer.appendChild(deviceTemplate)
});

function turnOnAll(){
    client.startDiscovery().on('device-new', (device) => {
      device.getSysInfo().then(console.log);
      device.setPowerState(true);
    });
}

function turnOn(device){
  device.setPowerState(true);
  setDevicePanelBackground(device, backgroundOn)
}

function turnOff(device){
  device.setPowerState(false);
  setDevicePanelBackground(device, backgroundOff)
}

function setDevicePanelBackground(device, color){
  devices = document.getElementById("main-container").children;
  for (let i = 1; i < devices.length; ++i) {
    if(devices[i].children[0].children[0].innerHTML == device.alias){
      devices[i].children[0].style.backgroundColor = `${color}`; 
      break;
    }
  }
}
