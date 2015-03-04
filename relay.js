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
  var echoSate = 1;
  var com = parseCommand(m);
  
  if (com) {
    
    if (com.command == 'belay') {
      var chan = config.relayConnection.channels[0];
      relayClient.say(chan, com.params.join(' '));
      baseClient.say(t, '9,1<<Relay>> 1,9'+config.relayServer+" "+chan+" ->2,9 "+com.params.join(' '));
    }
    else if (com.command == 'echo_off') {
      var echoState = 0;
      baseClient.say(t, 'echo='+echoState);
    }
    else if (com.command == 'echo_on') {
      var echoState = 1;
      baseClient.say(t, 'echo='+echoState);
    }
    else if (com.command == 'join') {
      relayClient.say('#testdong', 'hi');
      new irc.Client.part(config.relayServer, config.relayNick, config.relayConnection);
      //config.relayConnection.channels[0] = '#testdong1';      
      //relayClient.join('#testdong');
      //relayClient.join(config.relayConnection.channels[0]);
      //relayClient = new irc.Client(config.relayServer, config.relayNick, config.relayConnection);
    }
  }
});

var echoState = 1;

relayClient.addListener('message', function(from, to, message) {
  if (echoState == 1) {
    if (message.indexOf(config.relayNick) > -1) {
        var baseChan = config.baseConnection.channels[0];
        baseClient.say(baseChan, '1,9'+config.relayServer+' '+to+'4,9 '+from+' 1,9-> 2,9 '+message+echoState);
    }
  }
});
