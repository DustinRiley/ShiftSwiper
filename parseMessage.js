let avail=[];
function populateAvail(){
    for(let i=0; i<14; i++){
        let d = new Date();
        d.setDate(d.getDate()+i)
        d.setHours(0,0,0,0)

        avail.push(d);
    }
}
populateAvail();
console.log(replyMsg('Anyone want my shift on Sunday at 12? or friday',avail,'Nicole'));

function replyMsg(msg, availability, sender){
    if(isGvivingAway(msg)){
        let dates = getDates(msg, availability);
        if(dates.length>0){
            return constructMsg(dates, sender);
        }
        else return 'noReply'; //unable to parse any dates, or no matching to availability
    }
}

/**
 * 
 * @param {string} msg sender message
 * @returns {boolean} if msg contains a giving away string
 */
function isGvivingAway(msg){
    msg= msg.toLowerCase();

    let keys = ['wants my','want my','take my','want a','anyone wanna']
    let antiKeys = ['swap', 'can take', 'i can ']

    if(msg.includes('anyone')|| msg.includes('anybod')){
        if(antiKeys.some(key=> msg.includes(key))){
            return false
        }
        else{
            return keys.some(key=> msg.includes(key))
        }
        
    }
}



/**
 * 
 * @param {string} msg sender's message
 * @param {array} avail users availabable working days
 * @returns {array} days that the user can work mentioned in message
 */
function getDates(msg, avail){
    let dates = parseDates(msg);
    let localDatesAvail = avail.map(date=>date.toLocaleString());
    return dates.filter(day => localDatesAvail.includes(day.toLocaleString()));
    
}

//Unique modulo formula to handle negtative numbers
function mod(n, m) {
    return ((n % m) + m) % m;
  }


/**
 * 
 * @param {string} msg senders message
 * @returns {array} array of dates in message
 */
function parseDates(msg){
    let weekdays=['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    let dayOfWeek = new Date().getDay();
    let dayOfMonth = 0;
    let dateArray =[];
    msg=msg.toLowerCase();

    //If message includes next generally referes to next week
    if(msg.includes('next')){
        //Add 7 days to total
        dayOfMonth=7;
    }

    //parse dates and turn them in js date objects
    weekdays.forEach((day, index) => {
        if(msg.includes(day)){
            let d = new Date();
            d.setDate(d.getDate()+(dayOfMonth + mod((index-dayOfWeek),7)));
            //setting hour resolution to 0 to easily compare to other dates
            d.setHours(0,0,0,0);
            dateArray.push(d);
        }
   });
   return dateArray;   
}

/**
 * 
 * @param {array} dates array of dates to take
 * @param {string} sender name of sender
 * @returns {string} the reply string
 */
function constructMsg(dates, sender){
    console.log(dates)
    let replyString = 'Hey @'+sender+' i\'ll take your';
    dates.forEach((date, index)=>{
        if(index>0){
            replyString=replyString+" and your"
        }
        let month = date.toLocaleString('default', {month: 'long'});
        replyString =replyString+' '+month+' '+date.getDate();
    })

    
    return replyString;
    
}


