var dragoman = {};

dragoman.host = function(name) { return {
      name: name
};};

dragoman.account = function(name, host) { return {
    name: name,
    host: host
};};

dragoman.protocol = function(name) { return {
    name: name
};};

dragoman.contact = function(name) { return {
    name: name
};};

dragoman.account_protocol = function(account, protocol) { return {
    account: account, 
    protocol: protocol,
};};

dragoman.subscription = function(subscriber, subscribee) { return {
    subscriber: subscriber, 
    subscribee: subscribee 
};};

dragoman.account_protocol_contact = function(account_protocol, contact) { return {
    account_protocol: account_protocol,
    contact: contact
};};

dragoman.contact = function(name) { return {
    name: name
};};

dragoman.message = function(sender, receiver, time, read, body) { return {
  sender: sender,
  receiver: receiver,
  time: time,
  read: read,
  body: body 
};};

dragoman.organization = function(id, name, query) { return {
  id: id,
  name: name,
  query: query 
};};

dragoman.qword = function(id, text) { return {
  id: id,
  text: text  
};};

dragoman.attr_value_pair = function(attr_qword, value_qword) { 
  
  var messages = function() {
    return attr_qword.messages(value_qword.source); 
  }; 

  return {
    attr_qword: attr_qword,
    value_qword: value_qword,
    messages: messages
  };
};

/*
 * values: function(): [dragoman.value_qword()] 
 * messages: function(dragoman.value.qword()): [dragoman.message()]
 */
dragoman.attr_qword = function(id, name, value_qwords, messages) { 

  var a = dragoman.qword(id, name); 
  a.value_qwords = value_qwords;
  a.messages = messages;
  return a;
  
};

dragoman.value_qword = function(id, name, source) { 
  var v = dragoman.qword(id, name); 
  v.source = source 
  return v;
};

dragoman.org_data = function(org, data, options) { return {
  org: org,
  data: data, 
  options: options
};};

dragoman.qword_selection = function(position, query_type, qwords) { return {
    position: position,
    query_type: query_type, 
    qwords: qwords 
};};

//takes a query phrase of each type
dragoman.query = function(groups_phrase, filters_phrase, preview_phrase) { return {
  groups: groups_phrase,
  filters: filters_phrase,
  preview: preview_phrase
};};

//selection is a function
dragoman.query_type = function(id, selection) { return {
  id: id,
  selection: selection
};};

dragoman.query_phrase = function(query_type, qwords) { 

  var selection = function(position) {
    var prev_qword = qwords[position - 1];
    return query_type.selection(position, prev_qword);
  };
  
  return {
    query_type: query_type,
    qwords: qwords,  
    selection: selection
  };

};


dragoman.database = function() {

  var hosts = _.reduce([
    ['gmail','gmail.com'],
    ['yahoo', 'yahoo.com'],
    ['facebook', 'facebook.com'],
    ['orbitz', 'orbitz.com'],
    ['phone', 'phone']
  ], function (result, item) {
    result[item[0]] = dragoman.host(item[1]);
    return result;
  }, {});

  var accounts = _.reduce([
      ['erika_gmail', 'erika', hosts.gmail],
      ['thomas_gmail', 'thomas', hosts.gmail],
      ['siiri_facebook', 'siiri', hosts.facebook],
      ['erika_facebook', 'erika', hosts.facebook],
      ['jason_yahoo', 'jason', hosts.yahoo],
      ['kathy_yahoo', 'kathy', hosts.yahoo],
      ['info_orbitz', 'info', hosts.orbitz],
      ['_123_phone', '123', hosts.phone],
      ['_456_phone', '456', hosts.phone]
  ], function (result, item) {
    result[item[0]] = dragoman.account(item[1], item[2]);
    return result;
  }, {});


  var protocols = _.reduce([
    'smtp',
    'xmpp',
    'sip',
    'sms',
    'voice' 
  ], function (result, item) {
    result[item] = dragoman.protocol(item);
    return result;
  }, {});

  
  var account_protocols = _.reduce([
      ['erika_gmail_smtp', accounts.erika_gmail, protocols.smtp],
      ['erika_gmail_xmpp', accounts.erika_gmail, protocols.xmpp],
      ['_123_phone_sms', accounts._123_phone, protocols.sms],
      ['thomas_gmail_xmpp', accounts.thomas_gmail, protocols.xmpp],
      ['siiri_facebook_xmpp', accounts.siiri_facebook, protocols.xmpp],
      ['siiri_facebook_smtp', accounts.siiri_facebook, protocols.smtp],
      ['siiri_facebook_sip', accounts.siiri_facebook, protocols.sip],
      ['_456_phone_sms', accounts._456_phone, protocols.sms],

      ['jason_yahoo_xmpp', accounts.jason_yahoo, protocols.xmpp],
      ['kathy_yahoo_xmpp', accounts.kathy_yahoo, protocols.xmpp],
      ['info_orbitz_smtp', accounts.info_orbitz, protocols.smtp]
  ], function (result, item) {
    result[item[0]] = dragoman.account_protocol(item[1], item[2]);
    return result;
  }, {});

  var aps = account_protocols;
  var xmpp_send_subscriptions = _.reduce([
      ['erika_siiri', aps.erika_gmail_xmpp, aps.siiri_facebook_xmpp],
      ['siir_erika', aps.siiri_facebook_xmpp, aps.erika_gmail_xmpp],
      ['erika_thomas', aps.erika_gmail_xmpp, aps.thomas_gmail_xmpp],
      ['thomas_erika', aps.thomas_gmail_xmpp, aps.erika_gmail_xmpp],

      //erika can send messages to jason
      ['erika_jason', aps.erika_gmail_xmpp, aps.jason_yahoo_xmpp],

      //erika can be sent messages from kathy
      ['kathy_erika', aps.kathy_yahoo_xmpp, aps.erika_gmail_xmpp]
  ], function (result, item) {
    result[item[0]] = dragoman.subscription(item[1], item[2]);
    return result;
  }, {});

  var contacts = _.reduce([
    ['erika', 'Erika'],
    ['siiri', 'Siiri'],
    ['thomas', 'Thomas']
  ], function (result, item) {
    result[item[0]] = dragoman.contact(item[1]);
    return result;
  }, {});


  var account_protocol_contacts = _.reduce([
    ['erika_gmail_smtp_erika', aps.erika_gmail_smtp, contacts.erika],
    ['erika_gmail_xmpp_erika', aps.erika_gmail_xmpp, contacts.erika],
    ['_123_phone_sms_erika', aps.erika_phone_sms, contacts.erika],
    ['siiri_facebook_smtp_siiri', aps.siiri_facebook_smtp, contacts.siiri],
    ['siiri_facebook_xmpp_siiri', aps.siiri_facebook_xmpp, contacts.siiri],
    ['_456_phone_sms_siiri', aps._456_phone_sms, contacts.siiri],
    ['thomas_gmail_xmpp_thomas', aps.thomas_gmail_xmpp, contacts.thomas]
  ], function (result, item) {
    result[item[0]] = dragoman.account_protocol_contact(item[1], item[2]);
    return result;
  }, {});

  var yesnos =  {
    yes: {name: 'yes'},
    no: {name: 'no'}
  };

  var messages = _.reduce([
    ['m1', aps.erika_gmail_smtp, aps.siiri_facebook_smtp, 1, yesnos.yes, 'Hey Pookey!'],
    ['m2', aps.siiri_facebook_smtp, aps.erika_gmail_smtp, 2, yesnos.yes, "What's up girl?!!"],
    ['m3', aps.thomas_gmail_xmpp, aps.erika_gmail_xmpp, 3, yesnos.yes, "Hey can you buy me some more girl scout cookies?"],
    ['m4', aps.siiri_facebook_xmpp, aps.erika_gmail_xmpp, 4, yesnos.yes, "P.S. you should come to Israel"],
    ['m5', aps.info_orbitz_smtp, aps.erika_gmail_smtp, 5, yesnos.yes, "Your flight information below:"],
    ['m6', aps.erika_gmail_xmpp, aps.thomas_gmail_xmpp, 6, yesnos.yes, "I think you should eat more fruit instead"],
    ['m7', aps.erika_gmail_xmpp, aps.jason_yahoo_xmpp, 7, yesnos.yes, "You are such a dick, we are no longer friends."], 
    ['m8', aps.erika_gmail_xmpp, aps.siiri_facebook_xmpp, 8, yesnos.yes, "OK! booking my flight now!"]
    //['m9', aps.kathy_yahoo_xmpp, aps.erika_gmail_xmpp, 9, yesnos.no, "Hey Erika, thanks for letting me copy your lecture notes :)"],
    //['m10', aps._456_phone_sms, aps._123_phone_sms, 10, yesnos.no, "Wait, you're actually coming?"]
  ], function (result, item) {
    result[item[0]] = dragoman.message(item[1], item[2], item[3], item[4], item[5]);
    return result;
  }, {});

  var attr_qword = function() {

    var account_values = function() {
      return _.map(accounts, function(account, id) {
        return dragoman.value_qword(id, account.name + '@' + account.host.name, account);
      });
    };

    return _.reduce([
      ['sender', 'Sender', function() {
        return _.map(contacts, function(contact, id) {
          return dragoman.value_qword(id, contact.name, contact);
        });
      }, function(sender_contact) {
        var acc_protos = _.map(_.filter(account_protocol_contacts, function(apc) {
          return apc.contact == sender_contact;
        }), function(apc) {
          return apc.account_protocol;
        });

        return _.filter(messages, function(m) {
          return _.contains(acc_protos, m.sender);
        });
      }],
      ['protocol', 'Protocol', function() {
        return _.map(protocols, function(protocol, id) {
          return dragoman.value_qword(id, protocol.name, protocol);
        });
      }, function(protocol) {
        var acc_protos = _.filter(account_protocols, function(ap) {
          return ap.protocol == protocol;
        });
        return _.filter(messages, function(m) {
          return _.contains(acc_protos, m.sender);
        });
                
      }],
      ['sender_address', 'Sender Address', account_values, function(account) {
        var acc_protos = _.filter(account_protocols, function(ap) {
          return ap.account == account;
        });
        return _.filter(messages, function(m) {
          return _.contains(acc_protos, m.sender);
        });
      }],
      ['receiver_address', 'Receiver Address', account_values, function(account) {
        var acc_protos = _.filter(account_protocols, function(ap) {
          return ap.account == account;
        });
        return _.filter(messages, function(m) {
          return _.contains(acc_protos, m.receiver);
        });
      }],
      ['read', 'Read', function() {
        return _.map(yesnos, function(yesno, id) {
          return dragoman.value_qword(id, yesno.name, yesno);
        });
      }, function(read) {
        return _.filter(messages, function(m) {
          return m.read == read;
        });
      }]
    ], function (result, item) {

      var attr_id = item[0];
      var attr_name = item[1];
      var values = item[2];
      var messages = item[3];
      var attribute = dragoman.attr_qword(attr_id, attr_name, values, messages);

      result[attr_id] = attribute;
      return result;

    }, {});

  }();



  var open_attr_qwords = _.reduce([
    ['body', 'Body']
  ], function (result, item) {
    result[item[0]] = dragoman.qword(item[0], item[1]);
    return result;
  }, {});

  var conj_qwords = _.reduce([
    ['intersection', 'x'],
    ['union', '+'],
    ['nest', '/'],
    ['done', '']
  ], function (result, item) {
    result[item[0]] = dragoman.qword(item[0], item[1]);
    return result;
  }, {});

  var closed_attr_qwords = _.map(attr_qword, function(attr_qword) {
    return attr_qword;
  });

  var query_types = _.reduce([
    ['groups', function(position, prev_qword) {
      if (position == 0) {
        return  _.union([conj_qwords.done], closed_attr_qwords);
      } else {
        var ss = [
          closed_attr_qwords,
          [conj_qwords.done, conj_qwords.nest, conj_qwords.union, conj_qwords.intersection]
        ];
        return ss[position % 2];
      }
    }],
    ['filters', function(position, prev_qword) {

      if (position == 0) {
        return  _.union([conj_qwords.done], closed_attr_qwords);
      } else if (position % 3 == 0) {
        return closed_attr_qwords;
      } else if (position % 3 == 1) {
        return _.map(prev_qword.value_qwords(), function(qword) {
          return qword;
        });
      } else {
        return [conj_qwords.done, conj_qwords.union, conj_qwords.intersection];
      }

    }],
    ['preview', function(position, prev_qword) {
      var ss = [
        _.union(open_attr_qwords, closed_attr_qwords),
        [conj_qwords.done, conj_qwords.union]
      ];

      return ss[position % 2];
    }]

  ], function (result, item) {
    result[item[0]] = dragoman.query_type(item[0], item[1]);
    return result;
  }, {});


  var get_org_contents = function(org, level) {

    //get first level of organization
    var qwords = org.query.groups.qwords;
    
    var level_qwords = null;
    var start = 0;
    var end = -1;
    var i = 0;
    while (i < level) {

      start = end + 1;
      var end = _.indexOf(qwords, conj_qwords.nest, start);  
      if (end < 0) {
        if (i == level - 1) {
          end = _.indexOf(qwords, conj_qwords.done);
        } else {
          end = 0;
        }
      } 
      
      i = i + 1;

    }

    var level_qwords = qwords.slice(start, end);

    if (level_qwords.length > 0) {
      var raw_folders = make_folders(level_qwords);
      var folders = _.filter(raw_folders, function(folder) {
        var messages = _.intersection.apply(_, _.map(folder, function(pair) {
          return pair.messages(); 
        }));

        return messages.length > 0;

      });
      return folders;

    } else {
      return null;
      //show the messages using the filters
    }

  };

  var make_folders = function(qwords) {
    var l = qwords.length;
    if (l == 0) {
      console.log('error');
      return null;
    } 

    var attr_qword = qwords[l - 1];
    var value_qwords = attr_qword.value_qwords();
    var av_groups = _.map(value_qwords, function(value_qword) {
      return [dragoman.attr_value_pair(attr_qword, value_qword)];
    }); 
    
    if (l == 1) {

      return av_groups;

    } else {

      var op = qwords[l - 2];
      var other_qwords = qwords.slice(0, l - 2);
      var other_av_groups = make_folders(other_qwords);

      if (op == conj_qwords.intersection) {

        return _.flatten(
          _.map(other_av_groups, function(other_group) {
            return _.map(av_groups, function(group) {
              return _.union(other_group, group);
            });
          }), 
          true
        );

      } else if (op == conj_qwords.union) {

        return _.flatten([av_groups, other_av_groups], true);

      } else {
        console.log('error: operation is neither x nor + in merge');
      }

    }

  };

  var new_qwords = function(query_type, old_qwords, qword, position) {

    var start = old_qwords.slice(0, position);
    var length = old_qwords.length;

    if (qword != conj_qwords.done && position != length - 1) {

      if (query_type == query_types.filters && position % 3 == 0) {

        var next = query_type.selection(position + 1, qword)[0];
        var end = old_qwords.slice(position + 2);
        return _.flatten([start, qword, next, end]);

      } else {
        var end = old_qwords.slice(position + 1);
        return _.flatten([start, qword, end]);
      }


    } else {
      var end = [];
      var pos = position + 1;
      var word = qword;

      while (word != conj_qwords.done) {

        word = query_type.selection(pos, word)[0];
        end.push(word);
        pos = pos + 1;

      }

      return _.flatten([start, qword, end]);
    }

  };

  return {
    open_attr_qwords: open_attr_qwords,
    conj_qwords: conj_qwords,
    query_types: query_types,
    get_org_contents: get_org_contents, 
    new_qwords: new_qwords
  };





};




