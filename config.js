module.exports = {
  masters: [''], //master nick on base channel
  baseServer: '',
  relayServer: '',
  baseNick: '',
  relayNick: '',
  commandIdentifer: '!',
  
  /**
   * connection variables (for irc)
   */
  baseConnection: {
    port: 6667,
    channels: ['#'],
    userName: '', // ident
    realName: '',
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
    channels: ['#'],
    userName: '', // ident
    realName: '',
    debug: true,
    secure: false,
    selfSigned: true,
    certExpired: true,
    floodProtection: true,
    floodProtectionDelay: 1000,
  }
};
