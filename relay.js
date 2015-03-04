/*
All proceeds to the Jim Rastlerton Foundation
*/

var config = require('./configtest'),
    irc = require('irc');

var baseClient = new irc.Client(config.baseServer, config.baseNick, config.baseConnection),
    relayClient = new irc.Client(config.relayServer, config.relayNick, config.relayConnection);

echoState = 1;  //init state of relay channel listener; toggle with !echo_off/!echo_on

function parseCommand(msg) {
  if (msg[0] === config.commandIdentifer) {
    var params = msg.split(" "),
        command = params[0].slice(1),
        comObj = { command: command };
    params.shift();
    comObj.params = params;
    return comObj;
  }
  else {
    return false;
  }
}

baseClient.addListener('error', function(m) {
  console.error('Error: %s: %s', m.command, m.args.join(' '));
});

relayClient.addListener('error', function(m) {
  console.error('Error: %s: %s', m.command, m.args.join(' '));
});

baseClient.addListener('message', function(f, t, m) {
  var com = parseCommand(m);
  
    if (com) {
      if (com.command == 'belay') {  //!belay message_to_be_relayed
      var chan = config.relayConnection.channels[0];
      relayClient.say(chan, com.params.join(' '));
      baseClient.say(t, '9,1<<Relay>> 1,9'+config.relayServer+" "+chan+" ->2,9 "+com.params.join(' '));
    }
    if (com.command == 'echo_off') {
      echoState = 0;
      baseClient.say(t, 'echo='+echoState);
    }
    if (com.command == 'echo_on') {
      echoState = 1;
      baseClient.say(t, 'echo='+echoState);
    }
    /*
    probably a better way to do this
    */
    if (com.command == 'join') {  //accepts input as !join #channel parting_word
      chanJoin = config.relayConnection.channels[0];
      var splitter = m.split(' ');
      var partMsg = splitter[2]
      relayClient.say(chanJoin, partMsg);
      relayClient.part(chanJoin);
      var chanJoin = splitter[1]
      relayClient.join(chanJoin);
    }
  }
});

relayClient.addListener('message', function(from, to, message) {
  if (echoState == 1) {
    if (message.indexOf(config.relayNick) > -1) {
      var baseChan = config.baseConnection.channels[0];
      baseClient.say(baseChan, '1,9'+config.relayServer+' '+to+'4,9 '+from+' 1,9-> 2,9 '+message);
    }
  }
});
