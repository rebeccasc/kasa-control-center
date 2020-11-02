let { Client } = require('tplink-smarthome-api');

let client = new Client();
let deviceContainer = [];
var backgroundOn = "#468153";
var backgroundOff = getComputedStyle(document.documentElement).getPropertyValue("-well-bg-color");

// setup
{
  initControlBar();
  loadDevices();
}

function initControlBar(){
  let controlBar = document.getElementById("control-bar");
  let allOnButton = controlBar.children[0].children[0];
  let allOffButton = controlBar.children[0].children[1];

  // add button listener
  allOnButton.addEventListener("click", function(){
    turnOnAll();
  });
  allOffButton.addEventListener("click", function(){
    turnOffAll();
  });
}

function loadDevices(){
  client.startDiscovery().on('device-new', (device) => {
    // device template
    let deviceTemplate = document.getElementById("device-template").cloneNode(true);
    deviceTemplate.style.display = "block";
    let deviceButton = deviceTemplate.children[0].children[0];
    deviceButton.innerHTML = `${device.alias}`;
    let deviceControl = deviceTemplate.children[1];
    let deviceSlider = deviceControl.children[1];
    let deviceLabel = deviceControl.children[2]

    // button listener
    deviceButton.addEventListener("click", function(){
      device.getPowerState().then( function(response){                               
          if(response == true){
            turnOff(device);
            disableControlPanel(deviceControl);
          }
          else{
            turnOn(device);
            if(device.deviceType == "bulb" && device.supportsBrightness) {
              enableControlPanel(deviceControl);
            }
          }
      });
    });

    // set state-layout
    device.getPowerState().then(function(state){                               
      if(state == true){
        setDevicePanelBackground(device, backgroundOn)
      }
      else{
        setDevicePanelBackground(device, backgroundOff)
      }
    });

    // dimmable layout
    if(device.deviceType == "bulb" && device.supportsBrightness) {
      // set visible
      device.getPowerState().then(function(state){                               
        if(state == true){
          enableControlPanel(deviceControl);
        }
      });

      // set to last lightstate
      device.lighting.getLightState().then(function(state){   
        if(state.brightness != undefined){
          deviceLabel.innerHTML = `${state.brightness}%`;
          deviceSlider.value = state.brightness;
        }
      })    

      // add slider listener
      deviceSlider.oninput = function() {
        setLightStateOfDevice(device, this.value);
        deviceLabel.innerHTML = `${this.value}%`;
      };
    }

    document.getElementById("main-container").appendChild(deviceTemplate)
    deviceContainer.push(device);
  });
}

function turnOnAll(){
  deviceContainer.forEach(function(d){
    turnOn(d);
  })
}

function turnOffAll(){
  deviceContainer.forEach(function(d){
      turnOff(d);
  })
}

function turnOn(device){
  device.setPowerState(true);
  setDevicePanelBackground(device, backgroundOn)
}

function turnOff(device){
  device.setPowerState(false);
  setDevicePanelBackground(device, backgroundOff)
}

function setLightStateOfDevice(device, dimValue){
  device.lighting.setLightState({
    on_off: 1,
    brightness: Number(dimValue)
  })
}

function setDevicePanelBackground(device, color){
  let devices = document.getElementById("main-container").children;
  for (let i = 1; i < devices.length; ++i) {
    if(devices[i].children[0].children[0].innerHTML == device.alias){
      devices[i].children[0].style.backgroundColor = `${color}`; 
      break;
    }
  }
}

function enableControlPanel(deviceControl){
  deviceControl.children[1].disabled = false;
  deviceControl.children[0].style.opacity = 1.0;
  deviceControl.children[2].style.opacity = 1.0;
}

function disableControlPanel(deviceControl){
  deviceControl.children[1].disabled = true;
  deviceControl.children[0].style.opacity = 0.5;
  deviceControl.children[2].style.opacity = 0.5;
}
