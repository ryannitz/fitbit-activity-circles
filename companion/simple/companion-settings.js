import * as messaging from "messaging";
import { settingsStorage } from "settings";

export function initialize() {
  settingsStorage.setItem('overrideStatIconColor', false);
  settingsStorage.addEventListener("change", evt => {
    if (evt.oldValue !== evt.newValue) {
      console.log(JSON.parse(evt.newValue));
      //make sure user doesn't set the user-defined value to be greater than 26 or less than 2
      if(evt.key === "userDefinedBase"){
        var userDefined = parseInt(JSON.parse(evt.newValue).name);
        if(userDefined > 26){
          sendValue(evt.key, '{"name":"26"}');
          settingsStorage.setItem('userDefinedBase', '{"name":"26"}');
        }else if(userDefined < 2){
          sendValue(evt.key, '{"name":"2"}');
          settingsStorage.setItem('userDefinedBase', '{"name":"2"}');
        }else{
          sendValue(evt.key, evt.newValue)
        }
      }else{
        sendValue(evt.key, evt.newValue);
      }
    }
  });
}

function sendValue(key, val) {
  if (val) {
    sendSettingData({
      key: key,
      value: JSON.parse(val)
    });
  }
}

function sendSettingData(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data); 
  } else {
    console.log("No peerSocket connection");
  }
}