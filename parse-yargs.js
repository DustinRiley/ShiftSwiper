const appState = require('./appstate');

/**
 * 
 * @param {array} days array of dates provided by yargs comand -d
 * @returns {array} array of dates the user has entered
 */
function dates(days){


let avail=[];
if(!days){
    console.error('no availability given');
    process.exit(1);
}
if(Number.isInteger(days)){
    avail.push[days];
    return avail;
}
days.forEach((day, index)=>{
    let d = new Date();
    //case of day input
    if(day.toString().length==1||day.toString().length==2){
        d.setMonth(d.getMonth(), day);
        d.setHours(0,0,0,0);
        avail.push(d);
    }
    //case of month and date 
    else if(day.toString().length == 4){
        d.setMonth(day.substring(0,1),day.substring(2,3));
        d.setHours(0,0,0,0);
        avail.push(d);
    }
    else{
        console.log('Invalid date: ', day, "the ", index, ' entry');
    }
   
});
return(avail)
}
module.exports.dates =dates;

/**
 * 
 * @param {string} email users entered email
 * @param {string} pass users password
 * @param {funtion} callback function to call after appstate has been set
 */
function login(email, pass, callback){

    if(email && pass){
        appState.setAppState(email, pass, callback);
    }
    else if(email || pass){
        console.error('Must have both user name and password');
        process.exit(1);
    }
    else callback();
}
module.exports.login = login;