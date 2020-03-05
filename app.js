const login = require("facebook-chat-api-master");
const fs = require("fs");
const parseMsg = require('./parseMessage');
const threadID = 638950929;
const nicoleID = 540353708;
const userID = 638950929;

var avail=[];
function populateAvail(){
    for(let i=0; i<14; i++){
        let d = new Date();
        d.setDate(d.getDate()+i)
        d.setHours(0,0,0,0)

        avail.push(d);
    }
}
populateAvail();
 
login({appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))}, (err, api) => {
    if(err) return console.error(err);
 
  

    api.setOptions({
        listenEvents: true,
        selfListen: true,
    });
 
    var stopListening  = api.listenMqtt((err, event) => {
        if(err) return console.error(err);
 
    
        switch(event.type) {
            case "message":
                console.log(event)
               // if(event.threadID==threadID){
                    //Get user so we can reply if we need to
                   
                    api.getThreadInfo(event.threadID,(err, threadInfo)=>{
                        if(threadInfo.threadName==null && event.threadID== nicoleID && event.senderID!= userID){

                            api.getUserInfo([event.senderID], (err, sender)=>{

                                if(err) return console.error(err);

                                const senderName=sender[event.senderID].name;
                                let msg = event.body;
                                console.log("msg: "+msg,+' avail: '+avail+' sender: '+senderName);
                                let response = parseMsg.response(msg, avail, senderName)
                                console.log(response);
                                if(response){
                                    
                                    api.sendMessage({
                                        body: response,
                                        mentions: 
                                            [{
                                                tag: '@'+senderName,
                                                id: event.senderID,
                                            }],
                                    }, nicoleID);
                                    api.sendMessage('You\'ve taken '+senderName+' shift. Here is what you said:\n'+response, nicoleID)
                                } 
                                
                            });
                        }
                    })
                   
                 
                   // api.sendMessage("TEST BOT: " + event.body, threadID);
               // }
                if(event.body === '/stop') {
                 //   api.sendMessage("Goodbye…", threadID);
                    return stopListening ();
                }
                
                break;


            case "event":
                console.log(event);
                break;
        }
    });
});


