const fs = require("fs");
const login = require("facebook-chat-api");

function setAppState(email, pass, callback){
    var credentials = {email: email, password: pass};
    
    login(credentials, (err, api) => {
        if(err) return console.error(err);
        fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()), callback());
    });
}
module.exports.setAppState = setAppState;