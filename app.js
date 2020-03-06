const login = require("facebook-chat-api");
const fs = require("fs");
const parseMsg = require('./parseMessage');
const argv = require('yargs')
      .array('d')
      .argv
const yargParser = require('./parse-yargs');
//ID of work group thread
const threadID = 540353708;



var avail =yargParser.dates(argv.d)
yargParser.login(argv.u, argv.p, listenToMessages);

function listenToMessages(){
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
                    
                    
                        api.getThreadInfo(event.threadID,(err, threadInfo)=>{
                            //listen to proper thread and dont reply to own messages
                            if(event.threadID== threadID && event.senderID!= api.getCurrentUserID()){
                                
                                //get senders info and msg info
                                api.getUserInfo([event.senderID], (err, sender)=>{
                                    if(err) return console.error(err);
                                    
                                    const senderName=sender[event.senderID].name;
                                    let msg = event.body;
                                    let response = parseMsg.response(msg, avail, senderName)
                                    //if a date was parsed reply
                                    if(response){
                                        console.log(event);
                                        api.sendMessage({
                                            body: response,
                                            mentions: 
                                                [{
                                                    tag: '@'+senderName,
                                                    id: event.senderID,
                                                }],
                                        }, threadID);
                                        //also send myself a message to let myself know I have taken someones shift
                                        api.sendMessage('You\'ve taken '+senderName+' shift. Here is what you said:\n'+response, 
                                                        api.getCurrentUserID())
                                    } 
                                    
                                });
                            }
                        })
                    
                    if(event.body === '/stop') {
                
                        return stopListening ();
                    }
                    
                    break;


                case "event":
                    console.log(event);
                    break;
            }
        });
    });
}

