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


dragoman.query = function(grouping, filtering, preview) { return {
  grouping: grouping,
  filtering: filtering,
  preview: preview
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

dragoman.org_data = function(org, data, options) { return {
  org: org,
  data: data, 
  options: options
};};

dragoman.qwords = function() {

  return _.reduce([
    ['intersection', 'x'],
    ['union', '+'],
    ['nest', '/'],
    ['equal', '='],
    ['done', ''],

    ['contact', 'contact'],
    ['body', 'body'],
    ['sender', 'sender'],
    ['receiver', 'receiver'],
    ['time', 'time'],
    ['read', 'read']
  ], function (result, item) {
    result[item[0]] = dragoman.qword(item[0], item[1]);
    return result;
  });

}();


dragoman.qword_selection = function(position, query_type, query) { 

  var all = dragoman.qwords;

  var attrs = [all.contact, all.body, all.sender, all.receiver, all.time, all.read];


  var grouping_selection = function() {

    if (position == 0) {
      return  _.union([all.done], attrs);
    } else {
      var ss = [
        _.union([all.done], attrs),
        [all.done, all.nest, all.union, all.intersection]
      ];
      return ss[position % 2];
    }

  };

  var filtering_selection = function() {

    return [all.contact, all.body, all.sender];

  };

  var preview_selection = function() {
    var ss = [
      attrs,
      [all.done, all.union]
    ];

    return ss[position % 2];
  };

  var selections = {
    grouping: grouping_selection,
    filtering: filtering_selection,
    preview: preview_selection
  };

  var qwords = selections[query_type]();

  return {
    position: position,
    query_type: query_type, 
    qwords: qwords 
  };
};

