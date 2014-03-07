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

dragoman.organization = function(name, query) { return {
  name: name,
  query: query 
};};

dragoman.qword = function(name) { return {
  name: name  
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

dragoman.dir = function(pairs) { return {
  file_type: dragoman.file_types.dir,
  pairs: pairs,
  children: null  
};};

dragoman.leaf = function(attr_qwords, message) { 
  
  var name = _.map(attr_qwords, function(qword) {
    return qword.value(message).name
  }).join(' - ');

  return {
    file_type: dragoman.file_types.leaf,
    attr_qwords: attr_qwords,
    message: message,
    name: name
  };
};


/*
 * value: function(dragoman.message()): dragoman.value_qword() 
 * values: function(): [dragoman.value_qword()] 
 * messages: function(dragoman.value.qword()): [dragoman.message()]
 */
dragoman.attr_qword = function(name, open, value, value_qwords, messages) { 

  var a = dragoman.qword(name); 
  a.open = open;
  a.value = value;
  a.value_qwords = value_qwords;
  a.messages = messages;
  return a;
  
};

dragoman.value_qword = function(name, source) { 
  var v = dragoman.qword(name); 
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
dragoman.query_type = function(name, selection) { return {
  name: name,
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

dragoman.file_types = {
  dir: 1, 
  leaf: 2, 
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

  var yesnos = {
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
    ['m7', aps.erika_gmail_xmpp, aps.jason_yahoo_xmpp, 7, yesnos.yes, "We are no longer friends."], 
    ['m8', aps.erika_gmail_xmpp, aps.siiri_facebook_xmpp, 8, yesnos.yes, "OK! booking my flight now!"],
    ['m9', aps.kathy_yahoo_xmpp, aps.erika_gmail_xmpp, 9, yesnos.no, "Hey Erika, thanks for letting me copy your lecture notes :)"],
    ['m10', aps._456_phone_sms, aps._123_phone_sms, 10, yesnos.no, "Wait, you're actually coming?"]
  ], function (result, item) {
    result[item[0]] = dragoman.message(item[1], item[2], item[3], item[4], item[5]);
    return result;
  }, {});

  var attr_qwords = function() {

    var account_values = function() {
      return _.map(accounts, function(account) {
        return dragoman.value_qword(account.name + '@' + account.host.name, account);
      });
    };

    return _.reduce([
      ['sender', 'Sender', false, function(message) {
        var sender_apcs = _.filter(account_protocol_contacts, function(apc) {
          return apc.account_protocol == message.sender;
        });
        if (sender_apcs.length > 0) {
          var contact = sender_apcs[0].contact;
          return dragoman.value_qword(contact.name, contact);
        } else {
          var account = message.sender.account;
          var host = account.host;
          return dragoman.value_qword(account.name + '@' + host.name, null);
        }
      }, function() {
        return _.map(contacts, function(contact) {
          return dragoman.value_qword(contact.name, contact);
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
      ['protocol', 'Protocol', false, function(message) {
        var protocol = message.sender.protocol;
        return dragoman.value_qword(protocol.name, protocol);
      }, function() {
        return _.map(protocols, function(protocol) {
          return dragoman.value_qword(protocol.name, protocol);
        });
      }, function(protocol) {
        var acc_protos = _.filter(account_protocols, function(ap) {
          return ap.protocol == protocol;
        });
        return _.filter(messages, function(m) {
          return _.contains(acc_protos, m.sender);
        });
                
      }],
      ['sender_address', 'Sender Address', false, function(message) {
        var account = message.sender.account;
        var host = account.host;
        var string = account.name + '@' + host.name;
        return dragoman.value_qword(string, account);
      }, account_values, function(account) {
        var acc_protos = _.filter(account_protocols, function(ap) {
          return ap.account == account;
        });
        return _.filter(messages, function(m) {
          return _.contains(acc_protos, m.sender);
        });
      }],
      ['receiver_address', 'Receiver Address', false, function(message) {
        var account = message.receiver.account;
        var host = account.host;
        var string = account.name + '@' + host.name;
        return dragoman.value_qword(string, account);
      }, account_values, function(account) { 
        var acc_protos = _.filter(account_protocols, function(ap) {
          return ap.account == account;
        });
        return _.filter(messages, function(m) {
          return _.contains(acc_protos, m.receiver);
        });
      }],

      ['body', 'Body', true, function(message) {
        return dragoman.value_qword(message.body, message.body);
      }, function() { 
        return _.map(messages, function(message) {
          return dragoman.value_qword(messages.body, messages.body);
        });
      }, function(read) {
        return _.filter(messages, function(m) {
          return m.read == read;
        });
      }],

      ['read', 'Read', false, function(message) {
        return dragoman.value_qword(message.read.name, message.read);
      }, function() { 
        return _.map(yesnos, function(yesno) {
          return dragoman.value_qword(yesno.name, yesno);
        });
      }, function(read) {
        return _.filter(messages, function(m) {
          return m.read == read;
        });
      }]
    ], function (result, item) {

      var attr_name = item[1];
      var open = item[2];
      var value = item[3];
      var values = item[4];
      var messages = item[5];
      var attribute = dragoman.attr_qword(attr_name, open, value, values, messages);

      result[item[0]] = attribute;
      return result;

    }, {});

  }();



  var conj_qwords = _.reduce([
    ['intersection', 'x'],
    ['union', '+'],
    ['nest', '/'],
    ['done', '']
  ], function (result, item) {
    result[item[0]] = dragoman.qword(item[1]);
    return result;
  }, {});

  var closed_attr_qwords = _.filter(attr_qwords, function(attr_qword) {
    return !attr_qword.open;
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
        _.toArray(attr_qwords),
        [conj_qwords.done, conj_qwords.union]
      ];

      return ss[position % 2];
    }]

  ], function (result, item) {
    result[item[0]] = dragoman.query_type(item[0], item[1]);
    return result;
  }, {});


  /*
   * returns [dragoman.dir()...]
   * or returns [dragoman.message()...]
   */
  var get_org_content = function(org, parent_dirs) {

    var parent_pairs = _.flatten(_.map(parent_dirs, function(dir) {
      return dir.pairs;
    }));

    var path_qwords = org.query.groups.qwords;
    var level = parent_dirs.length + 1;
    var _level_qwords = level_qwords(path_qwords, level);
    if (_level_qwords.length > 0) {
      //this level has dirs
      return level_dirs(_level_qwords, parent_pairs);
    } else {
      //this level has leafs 
      var attr_qwords = _.filter(org.query.preview.qwords, function(qword) {
        return qword != conj_qwords.union && qword != conj_qwords.done
      }); 
      return leafs(parent_pairs, attr_qwords); 
      
       
    }

  };

  var leafs = function(parent_pairs, attr_qwords) {
    var pairs = parent_pairs; 

    var _messages = parent_pairs.length > 0 
      ? _.intersection.apply(_, _.map(pairs, function(pair) {
        return pair.messages(); 
      }))
      : messages;

    return _.map(_messages, function(message) {
      return dragoman.leaf(attr_qwords, message);
    }); 
  };

  var level_qwords = function(path_qwords, level) {

    var start = 0;
    var end = -1;
    var i = 0;

    while(i < level) {

      start = end + 1;
      var nest_index = _.indexOf(path_qwords, conj_qwords.nest, start);  
      if (nest_index < 0) {
        if (i == level - 1) {
          end = _.indexOf(path_qwords, conj_qwords.done);
        } else {
          end = 0;
        }
      } else {
        end = nest_index;
      } 

      i = i + 1;

    }

    return path_qwords.slice(start, end);

  }

  /*
   * returns [dragoman.dir()...]
   * or returns [dragoman.message()...]
   */
  var level_dirs = function(_level_qwords, parent_pairs) {
    
    if (_level_qwords.length < 0) {
      console.log('error');
      return null;
    }

    var _pair_groups = pair_groups(_level_qwords);
    var _filtered_pair_groups = _.filter(_pair_groups, function(pairs) {
      var all_pairs = _.flatten([parent_pairs, pairs]);
      var messages = _.intersection.apply(_, _.map(all_pairs, function(pair) {
        return pair.messages(); 
      }));
      return messages.length > 0;
    });

    var _dirs = _.map(_filtered_pair_groups, function(pairs) {
      return dragoman.dir(pairs);
    });

    return _dirs;

     
  };

  var pair_groups = function(qwords) {
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
      var other_av_groups = pair_groups(other_qwords);

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
    attr_qwords: attr_qwords,
    conj_qwords: conj_qwords,
    query_types: query_types,
    get_org_content: get_org_content, 
    new_qwords: new_qwords
  };





};




