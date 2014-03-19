$(function(){

  var div = function() {
    return $('<div></div>');
  };
  var mod_height = '50px';
  var black = '#000';
  var green = '#7b7';
  var dk_gray = '#888';
  var gray = '#bbb';
  var lt_gray = '#eee';
  var white = '#fff';

  var vertical_pane = function() {
    return div()
      .css('display', 'inline-block')
      .css('vertical-align', 'top')
  };

  var panel = function(id) {
    return vertical_pane().attr('id', id).attr('class', 'panel')
      .css('width', '300px')

    ;
  };

  var wide_panel = function(id) {
    return panel(id) 
      .css('width', body.width() - 300)
    ;
  };

  var clicked_anchor_panel_item = null;

  var panel_item = function(id) {
    return div().attr('id', id).attr('class', 'panel_item')
      .css('background-color', white)
      .css('margin-right', '8px')
      .css('border-bottom', '1px solid ' + lt_gray)
    ;
  };

  var text_item = function(text) {
    return div().attr('class', 'text_item') 
      .text(text)
      .css('color', black)
    ;
  };

  var mod_text_item = function(text) {
    return text_item(text) 
      .css('color', black)
      .css('padding-top', '12px')
      .css('padding-left', '16px')
      .css('padding-bottom', '12px')
      .css('padding-right', '12px')
      .css('min-height', '15px')
    ;
  };

  var inline_mod_text_item = function(text) {
    return mod_text_item(text)
      .css('color', black)
      .css('display', 'inline-block')
      .css('vertical-align', 'top')
    ;
  };

  var inline_text_item = function(text) {
    return div().attr('class', 'text_item') 
      .text(text)
      .css('color', black)
      .css('display', 'inline-block')
      .css('vertical-align', 'top')
      .css('margin-right', '10px');
    ;
  };

  var leaf_panel_item = function(leaf) {

    var id = 'message_' + leaf.message.time; 
    var p = panel_item(id)
      .css('padding', '4px');

    var db = dragoman.database;

    _.forEach(leaf.pairs, function(pair) {
      
      if (pair.attr_qword == db.attr_qwords.sender) {
        var item = inline_text_item(pair.value_qword.name)
          .css('font-weight', 'bold');
        p.append(item);
      } else if (pair.attr_qword == db.attr_qwords.sender_address) {
        var item = inline_text_item(pair.value_qword.name);
        p.append(item);
      } else if (pair.attr_qword == db.attr_qwords.receiver) {
        var item = inline_text_item(' to ' + pair.value_qword.name);
        p.append(item);
      } else if (pair.attr_qword == db.attr_qwords.receiver_address) {
        var item = inline_text_item(' > ' + pair.value_qword.name);
        p.append(item);
      } else if (pair.attr_qword == db.attr_qwords.protocol) {
        var item = inline_text_item('[' + pair.value_qword.name + ']')
        p.append(item);
      } else {
        p.append(div());
        var item = inline_text_item(pair.value_qword.name);
        p.append(item);
      }
  
    }); 

    p.click(function() {
        //...
    });

    if (leaf.is_sender_user()) {
      p.css('background-color', lt_gray);
    } else {
      p.css('background-color', white);
    }

    return p;
  };

  var table = function() {
    return $('<table></table>')
      .css('border-collapse', 'collapse')
      .css('margin', '4px')
      ;
  };

  var tr = function() {
    return $('<tr></tr>')
      .css('margin', '0px')
      ;
  };

  var td = function() {
    return $('<td></td>').css('color', black)
      .css('vertical-align', 'top')
      .css('padding', '0px')
      ;
  };


  var mod_panel_item = function(id, text) {
    return panel_item(id)
      .css('cursor', 'pointer')
      .append(mod_text_item(text))
    ;
  };

  var text_input = function(value) {
    return $('<input type="text"/>')
      .attr('value', value)
      .css('width', '175px')
      .css('font-size', 'inherit')
      .css('outline', 'none')
      .css('padding', '3px')
      .css('border', '1px solid ' + gray)
      .focus(function() {
        $(this).css('border', '1px solid ' + green)
      })
      .blur(function() {
        $(this).css('border', '1px solid ' + gray)
      })
    ;
  };


  var clicked_installed_qword_div = null;

  var installed_qword_div = function(qword, position, query_phrase_type) {

    return row_button(qword.name) 
      .css('background-color', white)
      .css('color', black)
      .click(function() {
        clicked_installed_qword_div = $(this); 
        dragoman.state.change_qword_selection(position, query_phrase_type);
      });

  };

  var installed_qword_divs = function(query_phrase_type, qwords) {

    var l = qwords.length;
    return _.reduce(qwords, function(result, qword, index) {
      if (query_phrase_type == 'filters' && index % 3 == 1) {
        result.push(row_block(':'));
      }

      if (query_phrase_type == 'preview' && index > 0 && index < l - 1) {
        result.push(row_block(','));
      }
      result.push(installed_qword_div(qword, index, query_phrase_type));
      return result;
    }, []);

  };

  var table_text_item = function(text) {
    return text_item(text)
      .css('color', dk_gray)
      .css('text-align', 'right')
      .css('margin', '1px')
      .css('padding', '2px 4px');
  };

  var capitalized = function(string) {
    var first = string.substring(0, 1).toUpperCase();
    var rest = string.substring(1);
    return first + rest;
  };

  var edit_org_item = function(org) {

    var rows = _.flatten([

      [ tr().append(td().append(table_text_item('Name')), 
        td().append(text_input(org.name)
          .keypress(function() {
            dragoman.state.change_current_org_name($(this).val())
          })
          .keyup(function() {
            dragoman.state.change_current_org_name($(this).val())
          })
          .css('margin', '1px')
          .css('margin-left', '2px')
          )) ],

      _.map(org.query, function(query_phrase, query_phrase_type_id) {
        var qwords = query_phrase.qwords;
        return tr().append( 
          td().append(table_text_item(capitalized(query_phrase_type_id))), 
          td().append(installed_qword_divs(query_phrase_type_id, qwords)) 
        );
      })

    ], true);

    return panel_item('edit_org_item')
      .append(mod_text_item('Message Organization Settings')
        .css('color', black)
      )
      .append(
        table().css('padding-left', '4px')
          .css('padding-top', '4px')
          .css('padding-bottom', '4px')
          .append(rows)
      )
      .append(
        div()
          .css('boder', '1px solid black')
          .css('padding-left', '4px')
          .css('padding-top', '4px')
          .css('padding-bottom', '4px')
          .append(
            row_button('Save')
              .click(function() {
                dragoman.state.save_organization();
              })
          )
          .append(
            row_button('View')
              .click(function() {
                dragoman.state.view_organization();
              })
          )
          .append(
            row_button('Cancel')
              .click(function() {
                dragoman.state.cancel_organization();
              })
          )
      )
    ;
  };

  var button = function(text) {
    return text_item(text)
      .css('color', dk_gray)
      .css('padding', '2px 4px')
      .css('min-height', '19px')
      .css('min-width', '8px')
      .css('cursor', 'pointer')
      .css('background-color', white)
    ;
  };

  var row_button = function(text) {
    return button(text)
      .css('background-color', lt_gray)
      .css('display', 'inline-block')
      .css('vertical-align', 'top')
      .css('margin-left', '2px')
      .css('margin-top', '1px')
      .css('margin-bottom', '1px')
    ;
  };

  var row_block = function(text) {
    return div().text(text)
      .css('background-color', white)
      .css('color', black)
      .css('display', 'inline-block')
      .css('vertical-align', 'top')
      .css('margin-left', '2px')
      .css('margin-top', '1px')
      .css('margin-bottom', '1px')
    ;
  };


  var edit_org_panel = function(org) {
    return panel('edit_org_panel')
      .css('width', 2 * anchor_panel.width() + 'px')
      .append(edit_org_item(org));
  };


  var body = $('body')
    .css('font-family', 'monospace')
    .css('font-size', '14px')
    .css('margin', 0);

  var highlight = function(item) {
    item.css('background-color', lt_gray);
    return item;
  };

  var unhighlight = function(item) {
    item.css('background-color', white);
    return item;
  };

  var anchor_panel = function() {
    var a = panel('anchor_panel');
    a.highlight = function(org) {

      a.find('div.panel_item').each(function(index) {
        var panel_item = $(this);
        var text_item = panel_item.find('div.text_item').first();
        unhighlight(text_item);
      });

      if (clicked_anchor_panel_item != null) {
        var clicked_text_item = clicked_anchor_panel_item.find('div.text_item');
        highlight(clicked_text_item);
        clicked_anchor_panel_item = null;
      }

      return a;
    };

    a.remove_items = function() {
      a.find('div.panel_item').each(function(index) {
        if (index > 0) {
          $(this).remove();
        }
      }); 
      return a;
    };



    return a;
  }();


  var io = function() {

    var i = $('#io')
      .css('color', white)
      .append(anchor_panel)
      ;

    i.remove_panels = function() {
      i.find('div.panel').each(function(index) {
        if (index > 0) {
          $(this).remove();
        }
      }); 
      return i;
    };

    i.add_panel = function(panel) {
      i.append(panel);
      return i;
    };

    i.css('white-space', 'nowrap');

    return i;

  }();

  var current_org = null;

  var on_current_org_change = function(org) {
    current_org = org;

    io.remove_panels();
    if (org != null) {
      io.add_panel(edit_org_panel(org));
    }
    
  };

  var saved_org = null;
  var on_saved_org_change = function(org) {
    saved_org = org;
    anchor_panel.highlight(org);
  };

  var on_current_org_name_change = function(org) {
    current_org = org;
  };

  var on_new_org_change = function(new_org) {

    var id = new_org.id;
    anchor_panel.append(mod_panel_item(id, 'new')
      .click(function() {
        clicked_anchor_panel_item = $(this);
        dragoman.state.create_new_organization()
      })
    );
    
  };


  var control_bar = function() {
    var d = div().attr('id', 'control_bar')
      .append(
        inline_mod_text_item('Dragoman')
        .css('color', white)
      )
      .css('background-color', green)
      .css('border-bottom', '1px solid ' + lt_gray);
    d.insertBefore(io);
    return d;
  }();
  

  var qword_option_div = function(qword, position, query_phrase_type) {
    return button(qword.name)
      .css('background-color', white)
      .css('color', dk_gray)
      .mouseleave(function() {
        $(this).css('background-color', white);
      })
      .mouseenter(function() {
        $(this).css('background-color', lt_gray);
      })
      .click(function() {
        dragoman.state.replace_qword(qword, position, query_phrase_type); 
      })
    ;

  };

  var replace_qword_selection_div = function(qword_selection) {

    var id = 'qword_selection';
    $('#' + id).remove();

    if (qword_selection != null) {

      var d = div().attr('id', id)
        .css('display', 'inline-block')
        .css('vertical-align', 'top')
        .css('position', 'absolute')
        .css('margin-top', '0px')
        .css('z-index', '100')
        .css('border', '1px solid ' + gray)
        ;

      var position = qword_selection.position;
      var query_phrase_type = qword_selection.query_phrase_type;
      var qwords = qword_selection.qwords;

      _.forEach(qwords, function(qword) {

        d.append(qword_option_div(qword, position, query_phrase_type));

      });
      
      d.insertAfter(clicked_installed_qword_div);

    } 

  };

  var on_qword_selection_change = function(qword_selection) {
    if (edit_org_panel != null) {
      replace_qword_selection_div(qword_selection);
    } 
  };

  var on_organizations_change = function(orgs) {

    anchor_panel.remove_items();

    _.forEach(orgs, function(org) {
      var id = org.id;

      var item = mod_panel_item(id, org.name)
        .click(function() {
          clicked_anchor_panel_item = $(this);
          dragoman.state.change_current_org(org);
          dragoman.state.view_organization();
        });

      if (org == saved_org) {
        highlight(item.find('div.text_item'));
      }

      anchor_panel.append(item);

    });

  };

  var on_current_dir_change = function(dir) {

    io.remove_panels();
    if (dir == null) {
      if (current_org != null) {
        io.add_panel(edit_org_panel(current_org));
      }
    } else {

      var files = dir.children; 

      var id = '';
      var p = wide_panel(id);

      var header_item = panel_item('')
        .css('overflow', 'hidden')
        ;
      if (dir.parent != null) {

        header_item.append(inline_mod_text_item('<<')
          .css('cursor', 'pointer')
          .click(function() {
            //go up one level
            dragoman.state.view_children(dir.parent);
          })
        );

        var d = dir;
        var path = '';
        while (d != null) {
          path = '/' + _.map(d.pairs, function(pair) {
            return pair.value_qword.name;
          }).join(' x ') + path;
          d = d.parent;
        }
        header_item.append(inline_mod_text_item(path));
      }

      header_item.append(
        inline_mod_text_item('edit')
        .css('float', 'right')
        .css('cursor', 'pointer')
        .click(function() {
          dragoman.state.remove_current_dir();
        })
      );
      

      p.append(header_item);

      children = null;
      _.forEach(files, function(file) {

        if (file.file_type == dragoman.file_types.dir) {

          var name_array = _.map(file.pairs, function(pair) {
            return pair.value_qword.name;
          }); 
          var name = name_array.join(' x ');
          var id = _.reduce(file.pairs, function(result, pair) {
            return result + '_' + pair.attr_qword.name + '-eq-' + pair.value_qword.name
          }, 'dir'); 
          var item = mod_panel_item(id, name)
            .click(function() {
              dragoman.state.view_children(file);
            })
          ;
          p.append(item);

        } else if (file.file_type == dragoman.file_types.leaf) {

          p.append(leaf_panel_item(file));

        }

      });

      io.add_panel(p);
    }

  };

  var on_user_change = function(user) {
    $('#user_heading').remove();
    control_bar.append(
      inline_mod_text_item(user.contact.name)
      .attr('id', 'user_heading')
      .css('float', 'right')
    );
  };


  var handler = {
    on_new_org_change: on_new_org_change,
    on_saved_org_change: on_saved_org_change, 
    on_current_org_change: on_current_org_change,
    on_current_org_name_change: on_current_org_name_change,
    on_qword_selection_change: on_qword_selection_change,
    on_organizations_change: on_organizations_change,
    on_current_dir_change: on_current_dir_change,
    on_user_change: on_user_change
  };

  dragoman.state.subscribe(handler);

});

