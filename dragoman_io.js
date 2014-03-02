dragoman.io = function(){

  var div = function() {
    return $('<div></div>');
  };
  var mod_height = '50px';
  var blue = '#77b';
  var green = '#7b7';
  var dk_gray = '#999';
  var gray = '#ddd';
  var blue_gray = '#eef';
  var white = '#fff';

  var vertical_pane = function() {
    return div()
      .css('background-color', gray)
      .css('display', 'inline-block')
      .css('vertical-align', 'top')
      .css('height', body.height - 19 + 'px')
  };

  var panel = function(id) {
    return vertical_pane().attr('id', id).attr('class', 'panel')
      .css('width', '400px')
    ;
  };

  var panel_divider = function() {
    return vertical_pane().attr('class', 'panel_divider')
      .css('width', '2px')
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
      .css('min-height', '19px')
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
      .css('class', 'qword')
      .css('color', white)
      .css('background-color', green)
      .css('padding', '4px')
      .css('min-height', '19px')
      .css('min-width', '19px')
      .css('cursor', 'pointer')
  };

  var installed_qword_div = function(qword, position, query_type) {


    return qword_div() 
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

  };

  var installed_qword_divs = function(phrase_type, qwords) {

    return _.map(qwords, function(qword, index) {
      return installed_qword_div(qword, index, phrase_type);
    });
  };

  var table_text_item = function(text) {
    return text_item(text)
      .css('color', dk_gray)
      .css('text-align', 'right')
      .css('padding', '4px');
  };

  var capitalized = function(string) {
    var first = string.substring(0, 1).toUpperCase();
    var rest = string.substring(1);
    return first + rest;
  };

  var edit_org_item = function(org) {


    var rows = _.union(

      [ tr().append(td().append(table_text_item('Name')), td().append(text_input(org.name))) ],

      _.map(org.query, function(qwords, query_type) {
        return tr().append( 
          td().append(table_text_item(capitalized(query_type))), 
          td().append(installed_qword_divs(query_type, qwords)) 
        );
      })

    );

    return panel_item('edit_org_item')
      .append(mod_text_item('Message Organization Settings')
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


  var edit_org_panel = function(org) {
    return panel('edit_org_panel')
      .append(edit_org_item(org));
  };


  var body = $('body')
    .css('margin', 0);


  var anchor_panel = function() {
    var a = panel('anchor_panel');
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




  var io = function() {

    var i = $('#io')
      .css('font-family', 'sans-serif')
      .css('color', white)
      .css('background-color', gray)
      .css('height', '100%')
      .append(div().attr('id', 'control_bar')
        .css('height', mod_height)
        .css('background-color', gray)
      )
      .append(anchor_panel)
      ;

    i.remove_panels = function() {
      i.find('div.panel_divider').each(function(index) {
          $(this).remove();
      }); 
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



  var on_foc_org_change = function(foc_org) {

    if (foc_org != null) {
      anchor_panel.highlight(foc_org.id);
    }
    
  };

  var on_edit_org_change = function(edit_org) {

    io.remove_panels();
    if (edit_org != null) {
      io.add_panel(edit_org_panel(edit_org));
    }
    
  };

  var on_new_org_change = function(new_org) {

    var id = new_org.id;
    anchor_panel.append(mod_panel_item(id, '')
      .click(function() {
        dragoman.state.create_new_organization()
      })
    );
    
  };

  var qword_option_div = function(qword, position, query_type) {
    return qword_div()
      .text(qword.text)
      .attr('id', qword.id)
      .css('background-color', white)
      .css('color', dk_gray)
      .mouseleave(function() {
        $(this).css('background-color', white);
      })
      .mouseenter(function() {
        $(this).css('background-color', gray);
      })
      .click(function() {
        dragoman.state.replace_qword(qword, position, query_type); 
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
        .css('z-index', '100')
        ;

      var position = qword_selection.position;
      var query_type = qword_selection.query_type;
      var qwords = qword_selection.qwords;

      _.forEach(qwords, function(qword) {

        d.append(qword_option_div(qword, position, query_type));


      });
      
      d.insertAfter('#' + position + '-' + query_type);

    } 

  };

  var on_qword_selection_change = function(qword_selection) {
    if (edit_org_panel != null) {
      replace_qword_selection_div(qword_selection);
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

