
const say=require("say");
const {
  RTMClient,
  //WebClient,
} = require('@slack/client')
const {MessageQueue}=require("./MessageQueue.js");
const token = process.env.SLACK_SPEECH_BOT_TOKEN;


let messageQueue=new MessageQueue(1);

function promiseSpeak(text){
  return function(){
    return new Promise((resolve,reject)=>{
      say.speak(text,null,null,(e)=>{
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
//const web = new WebClient(token);

rtm.start();
queuedSpeak("start");

rtm.on('message', (event) => {
  queuedSpeak(event.text);
})