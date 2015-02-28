var config = require('./config'),
    irc = require('irc');

var baseClient = new irc.Client(config.baseServer, config.baseNick, config.baseConnection),
    relayClient = new irc.Client(config.relayServer, config.relayNick, config.relayConnection);

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
    
    if (com.command == 'relay') {
      var chan = config.relayConnection.channels[0];
      relayClient.say(chan, com.params.join(' '));
      baseClient.say(t, 'Relay: '+config.relayServer+":"+chan+" -> "+com.params.join(' '));
    }
  }
});