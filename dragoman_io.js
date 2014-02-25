dragoman.io = function(){

  var div = function() {
    return $('<div></div>');
  };



  var start = function() {

    var body = $('body')
      .css('margin', 0);

    var mod_height = '50px';
    var text_color = '#88c';

    var panel = function(id) {
      return div().attr('id', id).attr('class', 'panel')
        .css('width', '400px')
        .css('height', '100%')
        .css('background-color', '#ddd')
        .css('display', 'inline-block')
        .css('vertical-align', 'top')
      ;
    };

    var panel_item = function(id) {
      return div().attr('id', id).attr('class', 'panel_item')
        .css('background-color', '#eef')
        .css('border-bottom', '2px solid #ccc')
        .css('border-left', '2px solid #9d9')
      ;
    };

    var text_item = function(text) {
      return div() 
        .text(text)
        .css('color', text_color)
        .css('padding-top', '15px')
        .css('padding-left', '15px')
      ;
    };

    var table = function() {
      return $('<table></table>');
    };

    var td = function() {
      return $('<td></td>').css('color', text_color);
    };

    var tr = function() {
      return $('<tr></tr>');
    };

    var mod_panel_item = function(id, text) {
      return panel_item(id)
        .css('cursor', 'pointer')
        .css('height', mod_height)
        .append(text_item(text))
      ;
    };

    var text_input = function() {
      return $('<input type="text"/>');
    };

    var organization_settings_item = function() {

      return panel_item('organization_settings')
        .css('padding-top', '15px')
        .css('padding-bottom', '15px')
        .append(text_item('message organization:'))
        .append(function() {
          var t = table() 
            .css('padding-left', '15px');
          _.forEach([
            ['anchor as', text_input()],
            ['group by', ''] ,
            ['filter where', ''], 
            ['display as', ''] 
          ], function(item) {
            t.append(
              tr().append(
                td().text(item[0])
              ).append(
                td().append(item[1])
              )
            );
          }); 
          return t;
        })
    };

    var add_panel = function(panel) {
      io.append(panel);
    };

    var remove_panels = function() {
      io.find('div.panel').each(function(index) {
        if (index > 0) {
          $(this).remove();
        }
      }) 
    };


    var io = function() {
      return $('#io')
        .css('font-family', 'sans-serif')
        .css('color', '#fff')
        .css('background-color', '#ccc')
        .css('height', '100%')
        .append(div().attr('id', 'control_bar')
          .css('height', mod_height)
          .css('background-color', '#9d9')
        )
        .append(panel('root')
          .append(mod_panel_item('new', 'new')
            .click(function() {
              remove_panels();
              add_panel(panel('organization_settings')
                .append(organization_settings_item())
              );
            })
          )
        )
      ;
    }();
    
  };


  return {
    start: start
  };

}();

