module.exports = {
  masters: ['b4x'],
  baseServer: 'irc.ihazurinter.net',
  relayServer: 'irc.rizon.net',
  baseNick: 'belay',
  relayNick: 'biffo',
  commandIdentifer: '!',
  
  /**
   * connection variables (for irc)
   */
  baseConnection: {
    port: 6667,
    channels: ['#testdong'],
    userName: 'belay', // ident
    realName: 'belay',
    debug: true,
    secure: false,
    selfSigned: true,
    certExpired: true,
    floodProtection: true,
    floodProtectionDelay: 1000,
  },
  /**
   * relay connection
   */
  relayConnection: {
    port: 6667,
    channels: ['#testdong'],
    userName: 'biffo', // ident
    realName: 'biffo steins',
    debug: true,
    secure: false,
    selfSigned: true,
    certExpired: true,
    floodProtection: true,
    floodProtectionDelay: 1000,
  }
};
