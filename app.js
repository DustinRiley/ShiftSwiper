const login = require("facebook-chat-api-master");
const fs = require("fs");
const threadID = 638950929;
const nicoleID = 540353708;
const userID = 638950929;
 
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
                                msg = msg.toLowerCase();
                                if(msg.includes('does anyone')){
                                    api.sendMessage("I'll take it!", nicoleID)
                                    /*api.sendMessage({
                                        body: 'Hello @Sender! @Sender!',
                                        mentions: [{
                                        tag: '@Sender',
                                        id: message.senderID,
                                        fromIndex: 9, // Highlight the second occurrence of @Sender
                                        }],
                                    }, message.threadID);*/
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


