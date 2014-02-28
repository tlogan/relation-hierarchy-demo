dragoman.io = function(){

  var div = function() {
    return $('<div></div>');
  };
  var mod_height = '50px';
  var blue = '#77b';
  var green = '#7b7'; 
  var dk_gray = '#aaa';
  var gray = '#ddd';
  var blue_gray = '#eef';
  var white = '#fff';

  var panel = function(id) {
    return div().attr('id', id).attr('class', 'panel')
      .css('width', '400px')
      .css('height', '100%')
      .css('background-color', gray)
      .css('display', 'inline-block')
      .css('vertical-align', 'top')
    ;
  };

  var panel_divider = function() {
    return div().attr('class', 'panel_divider')
      .css('height', '100%')
      .css('width', '2px')
      .css('background-color', gray)
      .css('display', 'inline-block')
      .css('vertical-align', 'top')
  };

  var panel_item = function(id) {
    return div().attr('id', id).attr('class', 'panel_item')
      .css('background-color', blue_gray)
      .css('border-bottom', '2px solid ' + gray)
    ;
  };

  var text_item = function(text) {
    return div().attr('class', 'text_item') 
      .text(text)
    ;
  };

  var mod_text_item = function(text) {
    return text_item(text) 
      .css('color', blue)
      .css('padding-top', '16px')
      .css('padding-left', '16px')
      .css('padding-bottom', '16px')
    ;
  };

  var table = function() {
    return $('<table></table>');
  };

  var tr = function() {
    return $('<tr></tr>');
  };

  var td = function() {
    return $('<td></td>').css('color', blue);
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
      .css('font-size', 'inherit')
      .css('padding', '2px')
      .css('outline', 'none')
      .css('border', 'none')
      .css('border', '1px solid ' + dk_gray)
      .focus(function() {
        $(this).css('border', '1px solid ' + green)
      })
      .blur(function() {
        $(this).css('border', '1px solid ' + dk_gray)
      })
    ;
  };

  var qword_div = function() {
    return div() 
      .css('color', white)
      .css('background-color', dk_gray)
      .css('padding', '4px')
      .css('min-height', '19px')
      .css('min-width', '19px')
      .css('cursor', 'pointer')
  };

  var installed_qword_div = function(qword, position, query_type) {

    var d = qword_div() 
      .text(qword.text)
      .attr('id', position + '-' + query_type) 
      .attr('value', qword.id) 
      .css('display', 'inline-block')
      .css('vertical-align', 'top')
      .css('margin-left', '4px')
      .click(function() {
        dragoman.state.change_qword_selection(position, query_type);
      })
    ;

    d.qword = qword;

    return d;

  };

  var installed_qword_divs = function(phrase_type, qwords) {

    return _.map(qwords, function(qword, index) {
      return installed_qword_div(qword, index, phrase_type);
    });
  };

  var table_text_item = function(text) {
    return text_item(text)
      .css('background-color', green)
      .css('color', white)
      .css('text-align', 'right')
      .css('padding', '4px');
  };

  var organization_item = function(org) {

    var rows = _.union(

      [ tr().append(td().append(table_text_item('name')), td().append(text_input(org.name))) ],

      _.map(org.query, function(qwords, query_type) {
        return tr().append( 
          td().append(table_text_item(query_type)), 
          td().append(installed_qword_divs(query_type, qwords)) 
        );
      })

    );

    return panel_item('organization')
      .append(mod_text_item('message organization')
        .css('background-color', blue)
        .css('color', white)
      )
      .append(
        table().css('padding-left', '4px')
          .css('padding-top', '4px')
          .css('padding-bottom', '4px')
          .append(rows)
      )
    ;
  };


  var org_panel = function(org) {
    var p = panel('organization')
      .append(organization_item(org));

    show_options = function(qword_selection) {

      var position = qword_selection.position;
      var type = qword_selection.query_type;
      var qwords = qword_selection.query_type;

      return p;
    };

    return p;
  };

  var body = $('body')
    .css('margin', 0);

  var io = function() {

    var i = $('#io')
      .css('font-family', 'sans-serif')
      .css('color', white)
      .css('background-color', dk_gray)
      .css('height', '100%')
      .append(div().attr('id', 'control_bar')
        .css('height', mod_height)
        .css('background-color', green)
      )
      .append(panel('anchor_panel'))

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
      i.append(panel_divider())
      i.append(panel);
      return i;
    };


    return i;

  }();

  var anchor_panel = function() {
    var a = io.find('#anchor_panel');
    a.highlight = function(id) {

      a.find('div.panel_item').each(function(index) {
        var panel_item = $(this);
        var text_item = panel_item.find('div.text_item').first();
        if (panel_item.attr('id') == id) {
          text_item.css('background-color', blue);
          text_item.css('color', white);
        } else {
          text_item.css('background-color', blue_gray);
          text_item.css('color', blue);
        } 
      });
      return a;
    };
    return a;
  }();

  var on_foc_org_change = function(foc_org) {

    if (foc_org != null) {
      anchor_panel.highlight(foc_org.id);
    }
    
  };

  var edit_org_panel = null;

  var on_edit_org_change = function(edit_org) {

    io.remove_panels();
    if (edit_org != null) {
      edit_org_panel = org_panel(edit_org);
      io.add_panel(edit_org_panel);
    }
    
  };

  var on_new_org_change = function(new_org) {

    var id = new_org.id;
    anchor_panel.append(mod_panel_item(id, id)
      .click(function() {
        dragoman.state.create_new_organization()
      })
    );
    
  };

  var qword_option_div = function(qword) {
    return qword_div()
      .text(qword.text)
      .attr('id', qword.id)
      .css('background-color', gray)
      .css('color', dk_gray)
      .mouseenter(function() {
        $(this).css('background-color', dk_gray)
        $(this).css('color', gray)
      })
      .mouseleave(function() {
        $(this).css('background-color', gray)
        $(this).css('color', dk_gray)
      })
    ;

  };

  var qword_selection_div = function(qword_selection) {
    var id = 'qword_selection';
    $('#' + id).remove();
    var d = div().attr('id', id)
      .css('display', 'inline-block')
      .css('vertical-align', 'top')
      .css('border-bottom', '2px solid ' + white)
      .css('border-left', '2px solid ' + white)
      .css('position', 'absolute')
      .css('z-index', '100')
      ;

    var position = qword_selection.position;
    var query_type = qword_selection.query_type;
    var qwords = qword_selection.qwords;

    _.forEach(qwords, function(qword) {

      d.append(qword_option_div(qword));


    });

    return d;
  };

  var on_qword_selection_change = function(qword_selection) {
    if (edit_org_panel != null) {

      var position = qword_selection.position;
      var query_type = qword_selection.query_type;
      qword_selection_div(qword_selection)
        .insertAfter('#' + position + '-' + query_type);

    } 
  };

  var handler = {
    on_new_org_change: on_new_org_change,
    on_foc_org_change: on_foc_org_change,
    on_edit_org_change: on_edit_org_change,
    on_qword_selection_change: on_qword_selection_change
  };

  var start = function() {

    dragoman.state.subscribe(handler);

  };


  return {
    start: start
  };

}();

