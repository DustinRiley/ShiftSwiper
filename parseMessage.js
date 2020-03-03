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
 * @param {string} msg sender's message
 * @param {array} avail users availabable working days
 * @returns {array} days that the user can work mentioned in message
 */
function getDates(msg, avail){
    let dates = parseDates(msg);
    return dates.filter(day => avail.includes(day));
    
}
function isGvivingAway(msg){
    msg= msg.toLowerCase();
    let keys = ['wants my','want my','take my','want a','ayone wanna']
    if(msg.includes('anyone)'||msg.includes('anybod'))){
      keys.forEach(key => {
          console.log(key)
          if(msg.includes(key)){
              return true
          }
      });
    }
}

function mod(n, m) {
    return ((n % m) + m) % m;
  }

console.log(isGvivingAway('Anyone want my shift tmrw at 4?'))

/**
 * 
 * @param {string} msg senders message
 * @returns {array} array of dates in message
 */
function parseDate(msg){
    let weekdays=['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    let dayOfWeek = new Date().getDay();
    let dayOfMonth = 0;
    let dateArray =[];
    msg=msg.toLowerCase();

   if(msg.includes('next')){
       dayOfMonth=14;
   }

   weekdays.forEach((day, index) => {
       if(msg.includes(day)){
            let d = new Date();
            d.setDate(d.getDate()+(dayOfMonth + mod((index-dayOfWeek),7)))
            dateArray.push(d.toLocaleString());
       }
   });

   return dateArray;
    //RegExp('\d{1,2}(th|st|nd|rd)')
   /* switch(msg){
        case msg.includes('friday'||'fri'):
           dateArray.push(dayOfMonth + Math.abs((dayOfWeek-5)));
        case msg.includes('thursday'||'thur'):
           dateArray.push(dayOfMonth + Math.abs((dayOfWeek-4)));
        case msg.includes('wednesday'||'wed'):
           dateArray.push(dayOfMonth + Math.abs((dayOfWeek-3)));
        case msg.includes('tuesday'||'tues'):
           dateArray.push(dayOfMonth + Math.abs((dayOfWeek-2)));
    } */

    
   
}

function constructMsg(dates, availability){
    const month = date.toLocaleString('default', { month: 'long' });
}

/*api.sendMessage({
    body: 'Hello @Sender! @Sender!',
    mentions: [{
         tag: '@Sender',
         id: message.senderID,
         fromIndex: 9, // Highlight the second occurrence of @Sender
    }],
}, message.threadID);*/
