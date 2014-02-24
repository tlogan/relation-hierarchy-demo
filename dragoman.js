var dragoman = {

  //constructors
  host: function(name) { return {
      name: name
  }},

  account: function(name, host) { return {
      name: name,
      host: host
  }},

  protocol: function(name) { return {
      name: name
  }},

  contact: function(name) { return {
      name: name
  }},

  account_protocol: function(account, protocol) { return {
      account: account, 
      protocol: protocol,
  }},

  subscription: function(subscriber, subscribee) { return {
      subscriber: subscriber, 
      subscribee: subscribee 
  }},

  account_protocol_contact: function(account_protocol, contact) { return {
      account_protocol: account_protocol,
      contact: contact
  }},

  contact: function(name) { return {
      name: name
  }},

  message: function(sender, receiver, time, read, content) { return {
    sender: sender,
    receiver: receiver,
    time: time,
    read: read,
    content: content
  }},

  //instances 
  hosts: {
    gmail: host('gmail.com'),
    yahoo: host('yahoo.com'),
    facebook: host('facebook.com'),
    phone: host('phone'),
  },

  accounts: {
    erika_gmail: account('erika', hosts.gmail),
    thomas_gmail: account('thomas', hosts.gmail),
    siiri_facebook: account('siiri', hosts.facebook),
    erika_facebook: account('erika', hosts.facebook),
    _123_phone: account('123', hosts.phone),
    _456_phone: account('456', hosts.phone)
  },

  protocols: {
    smtp: protocol('smtp'),
    xmpp: protocol('xmpp'),
    sip: protocol('sip'),
    sms: protocol('sms'),
    voice: protocol('voice')
  },

  account_protocols: {
    erika_gmail_smtp: account_protocol(accounts.erika_gmail, protocols.smtp),
    erika_gmail_xmpp: account_protocol(accounts.erika_gmail, protocols.xmpp),
    _123_phone_sms: account_protocol(accounts._123_phone, protocols.sms),
    thomas_gmail_xmpp: account_protocol(accounts.thomas_gmail, protocols.xmpp),
    siiri_facebook_xmpp: account_protocol(accounts.siiri_facebook, protocols.xmpp),
    siiri_facebook_smtp: account_protocol(accounts.siiri_facebook, protocols.smtp),
    siiri_facebook_sip: account_protocol(accounts.siiri_facebook, protocols.sip),
    _456_phone_sms: account_protocol(accounts._456_phone, protocols.sms),

  },

  contacts: {
    erika: contact('Erika'),
    siiri: contact('Siiri'),
    thomas: contact('Thomas')
  },

  account_protocol_contacts: {

    //erika
    erika_gmail_smtp_erika: 
      account_protocol_contact(account_protocols.erika_gmail_smtp, contacts.erika),
    erika_gmail_xmpp_erika: 
      account_protocol_contact(account_protocols.erika_gmail_xmpp, contacts.erika),
    _123_phone_sms_erika: 
      account_protocol_contact(account_protocols.erika_phone_sms, contacts.erika),

    //siiri
    siiri_facebook_smtp_siiri: 
      account_protocol_contact(account_protocols.siiri_facebook_smtp, contacts.siiri),
    siiri_facebook_xmpp_siiri: 
      account_protocol_contact(account_protocols.siiri_facebook_xmpp, contacts.siiri),
    _456_phone_sms_siiri: 
      account_protocol_contact(account_protocols._456_phone_sms, contacts.siiri),

    //thomas
    thomas_gmail_xmpp_thomas: 
      account_protocol_contact(account_protocols.thomas_gmail_xmpp, contacts.thomas)
    

  }

  messages: {
    1: message(
      account_protocols.erika_gmail_smtp,
      account_protocols.siiri_facebook_smtp,
      1,
      true,
      'Hey Pookey!'
    ),

    2: message(
      account_protocols.siiri_facebook_smtp,
      account_protocols.erika_gmail_smtp,
      2,
      true,
      "What's up girl?!!"
    ),

    3: message(
      account_protocols.thomas_gmail_xmpp,
      account_protocols.erika_gmail_xmpp,
      3,
      true,
      "Hey can you buy me some more girl scout cookies?"
    ),

    4: message(
      account_protocols.siiri_facebook_xmpp,
      account_protocols.erika_gmail_xmpp,
      4,
      true,
      "P.S. you should come to Israel"
    ),

    5: message(
      account_protocols.erika_gmail_xmpp,
      account_protocols.thomas_gmail_xmpp,
      5,
      true,
      "I think you should eat more fruit instead"
    ),

    6: message(
      account_protocols.erika_gmail_xmpp,
      account_protocols.siiri_facebook_xmpp,
      6,
      true,
      "OK! booking my flight now!"
    ),
    
    7: message(
      account_protocols._456_phone_sms,
      account_protocols._123_phone_sms,
      7,
      true,
      "Wait, you're actually coming?"
    ),
    
  }



}
