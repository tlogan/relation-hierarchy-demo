dragoman.io = function(){

  var div = function(id) {
    return $('<div id="' + id + '"></div>');
  };



  var start = function() {

    var body = $('body')
      .css('margin', 0);

    var mod_height = '50px';

    var panel = function(id) {
      return div(id).attr('class', 'panel')
        .css('width', '400px')
        .css('height', '100%')
        .css('background-color', '#ddd')
        .css('display', 'inline-block')
        .css('vertical-align', 'top')
      ;
    };

    var panel_item = function(id) {
      return div(id).attr('class', 'panel_item')
        .css('background-color', '#eef')
        .css('border-bottom', '2px solid #ccc')
        .css('border-left', '2px solid #9d9')
        .css('cursor', 'pointer')
      ;
    };

    var text_item = function(text) {
      return $('<div></div>')
        .text(text)
        .css('color', '#88c')
        .css('padding-left', '15')
      ;
    };

    var mod_panel_item = function(id, text) {
      return panel_item(id)
        .css('height', mod_height)
        .append(text_item(text)
          .css('padding-top', '15')
        )
      ;
    };

    var organization_settings_item = function() {
      return panel_item('organization_settings')
        .append(text_item('message organization:')) 
        .append(text_item('anchor as')) 
        .append(text_item('group by')) 
        .append(text_item('filter where')) 
        .append(text_item('display as')) 
      ;
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
        .append(div('control_bar')
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

