
const say=require("say");
const { RTMClient } = require('@slack/rtm-api');
const {MessageQueue}=require("./MessageQueue.js");
const token = process.env.SLACK_SPEECH_BOT_TOKEN;


let messageQueue=new MessageQueue(1);

function escapeSpeakText(text){
  return '"'+text.replace(/"/g,'\\\"')+'"';
}

function promiseSpeak(text){
  return function(){
    return new Promise((resolve,reject)=>{
      say.speak(escapeSpeakText(text),null,null,(e)=>{
        if(!!e){
          reject(e);
        }else{
          resolve();
        }
      });
    });
  };
}
function queuedSpeak(text){
  console.log("queuedSpeak:"+text);
  messageQueue.postMessage(promiseSpeak(text));
}

const rtm = new RTMClient(token);

rtm.start();
queuedSpeak("start");

rtm.on('message', (event) => {
  queuedSpeak(event.text);
})