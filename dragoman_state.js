dragoman.state = function() {

  var db = dragoman.database; 

  var io_handlers = [];

  var notify_handlers = function(on_state_change, obj) {
    _.forEach(io_handlers, function(handler) {
      handler[on_state_change](obj);
    });
  };

  var user = db.user;

  var new_org = dragoman.organization(
    '',
    dragoman.query(
      dragoman.query_phrase(db.query_phrase_types.groups,[db.conj_qwords.done]), 
      dragoman.query_phrase(db.query_phrase_types.filters,[db.conj_qwords.done]), 
      dragoman.query_phrase(db.query_phrase_types.preview, [db.attr_qwords.body, db.conj_qwords.done])
    )
  );


  var organizations = [];

  var organizations = _.map([
    ['People',
      [db.attr_qwords.correspondent, db.conj_qwords.done], 
      [db.conj_qwords.done], 
      [db.attr_qwords.sender, db.attr_qwords.protocol, db.attr_qwords.body, db.conj_qwords.done]
    ],
    ['Protocols',
      [db.attr_qwords.protocol, db.conj_qwords.done], 
      [db.conj_qwords.done], 
      [db.attr_qwords.sender, db.attr_qwords.receiver, 
      db.attr_qwords.subject, db.attr_qwords.body, db.conj_qwords.done]
    ],
    ['People with Protocols',
      [db.attr_qwords.correspondent, db.conj_qwords.intersection, db.attr_qwords.protocol, db.conj_qwords.done], 
      [db.conj_qwords.done], 
      [db.attr_qwords.sender, db.attr_qwords.body, db.conj_qwords.done]
    ],
    ['Email Correspondents',
      [db.attr_qwords.correspondent, db.conj_qwords.done], 
      [db.attr_qwords.protocol, dragoman.value_qword(db.protocols.email.name, db.protocols.email)
      , db.conj_qwords.done], 
      [db.attr_qwords.sender, db.attr_qwords.receiver_address, 
      db.attr_qwords.subject, db.attr_qwords.body, db.conj_qwords.done]
    ],
    ['Threads',
      [db.attr_qwords.thread, db.conj_qwords.done], 
      [db.conj_qwords.done], 
      [db.attr_qwords.sender, db.attr_qwords.protocol, 
      db.attr_qwords.subject, db.attr_qwords.body, db.conj_qwords.done]
    ],

    ['Messages with Chat Friends',
      [db.conj_qwords.done], 

      [db.attr_qwords.with_chat_sender,
      dragoman.value_qword(db.yesnos.yes.name, db.yesnos.yes),
      db.conj_qwords.intersection,
      db.attr_qwords.with_chat_receiver, 
      dragoman.value_qword(db.yesnos.yes.name, db.yesnos.yes),
      db.conj_qwords.done], 

      [db.attr_qwords.sender, db.attr_qwords.receiver, db.attr_qwords.protocol, 
      db.attr_qwords.subject, db.attr_qwords.body, db.conj_qwords.done]
    ],

  ], function (item) {
    var org = dragoman.organization(
      item[0],
      dragoman.query(
        dragoman.query_phrase(db.query_phrase_types.groups, item[1]), 
        dragoman.query_phrase(db.query_phrase_types.filters, item[2]), 
        dragoman.query_phrase(db.query_phrase_types.preview, item[3])
      )
    );
    return org;
  });

  var set_organizations = function(_orgs) {
    organizations = _orgs;
    notify_handlers('on_organizations_change', organizations);
  };

  var saved_org = null;
  var set_saved_org = function(org) {
    saved_org = org;
    notify_handlers('on_saved_org_change', saved_org);
  };

  var current_org = null;
  var set_current_org = function(_current_org, part_changed) {
    current_org = _current_org;

    if (part_changed == 'name') {
      notify_handlers('on_current_org_name_change', current_org);
    } else {
      notify_handlers('on_current_org_change', current_org);
    }

  };

  var qword_selection = null;
  var set_qword_selection = function(_qword_selection) {
    qword_selection = _qword_selection;
    notify_handlers('on_qword_selection_change', qword_selection);
  };

  //interface
  var subscribe = function(io_handler) {
    io_handler.on_saved_org_change(saved_org);
    io_handler.on_current_org_change(current_org);
    io_handler.on_new_org_change(new_org);
    io_handler.on_qword_selection_change(new_org);
    io_handler.on_organizations_change(organizations);
    io_handler.on_user_change(user);

    io_handlers.push(io_handler);
  };

  var create_new_organization = function() {
    set_current_org(new_org);
    set_saved_org(new_org);
  };

  var change_qword_selection = function(position, query_phrase_type) {

    if (current_org == null) {
      alert('error: current_org is null in change_qword_selection');
    }

    var qwords = current_org.query[query_phrase_type].selection(position);
    set_qword_selection(dragoman.qword_selection(position, query_phrase_type, qwords)); 

  };

  var replace_qword = function(qword, position, query_phrase_type_id) {

    var query_phrase = current_org.query[query_phrase_type_id];
    var old_qwords = query_phrase.qwords;
    if (qword != old_qwords[position]) {
      var query_phrase_type = db.query_phrase_types[query_phrase_type_id]; 

      var new_qwords = db.new_qwords(query_phrase_type, old_qwords, qword, position);

      var new_query = dragoman.query(
        current_org.query.groups, 
        current_org.query.filters, 
        current_org.query.preview 
      );
      new_query[query_phrase_type_id] = dragoman.query_phrase(query_phrase_type, new_qwords);

      var org = dragoman.organization(
        current_org.name,
        new_query
      );

      set_current_org(org);

    }

    set_qword_selection(null); 

  };

  var save_organization = function() {

    if (saved_org == new_org) {

      var org = dragoman.organization(
        current_org.name,
        current_org.query
      );
      var _organizations = _.flatten([organizations, org]);
      set_saved_org(org);
      set_current_org(org);
      set_organizations(_organizations);

    } else {

      var index = _.indexOf(organizations, saved_org);
      var start = organizations.slice(0, index);
      var end = organizations.slice(index + 1);

      var _organizations = _.flatten([start, current_org, end]);
      set_saved_org(current_org);
      set_organizations(_organizations);

    }


  };

  var change_current_org_name = function(name) {
    var org = dragoman.organization(
      name,
      current_org.query
    );

    set_current_org(org, 'name');

  };

  var cancel_organization = function() {

    set_current_org(null);
    set_saved_org(null);

  };

  var current_dir = [];
  var set_current_dir = function(_current_dir) {
    current_dir = _current_dir;
    notify_handlers('on_current_dir_change', current_dir);
  };

  var update_current_dir = function(anchor_dir, contents) {
    notify_handlers('on_current_dir_change', current_dir);
  };

  var view_organization = function() {

    if (current_org == null) {
      console.log('error: current_org is null in view_current_organization');
    }


    var current_dir =  dragoman.dir([], null);
    current_dir.children = db.get_org_content(current_org, current_dir);

    set_current_dir(current_dir);

  };

  var change_current_org = function(org) {
    set_saved_org(org);
    set_current_org(org);
  };

  var view_children = function(dir) {

    if (current_org == null) {
      console.log('error: current_org is null in view_current_organization');
    }

    var last_level_contents = db.get_org_content(current_org, dir);

    _dir = _.clone(dir);
    _dir.children = last_level_contents; 

    set_current_dir(_dir);

  };

  var remove_current_dir = function() {
    set_current_dir(null);
  };

  return {
    subscribe: subscribe,
    create_new_organization: create_new_organization,
    change_qword_selection: change_qword_selection,
    replace_qword: replace_qword,
    change_current_org_name: change_current_org_name,
    save_organization: save_organization,
    view_organization: view_organization,
    view_children: view_children,
    cancel_organization: cancel_organization,
    change_current_org: change_current_org,
    remove_current_dir: remove_current_dir
  };

}();
