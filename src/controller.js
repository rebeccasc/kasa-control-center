let { Client } = require('tplink-smarthome-api');
const { default: BulbSchedule } = require('tplink-smarthome-api/lib/bulb/schedule');
const { default: Dimmer } = require('tplink-smarthome-api/lib/plug/dimmer');

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
  deviceSliderLabel = deviceTemplate.children[0].children[1];
  deviceSlider = deviceTemplate.children[0].children[2];
  deviceSliderPerc = deviceTemplate.children[0].children[3];

  // button listener
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

  // dimmable layout
  if(device.deviceType == "bulb" && device.supportsBrightness){
    // // set visible
    // deviceSliderLabel.style.display = "block";
    // deviceSlider.style.display = "block";
    // deviceSliderPerc.style.display = "block";
    
    // console.log(device.supportsDimmer());

    // // add listener
    // deviceSlider.oninput = function() {
    //   console.log(this.value);      
    // };
  }

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
