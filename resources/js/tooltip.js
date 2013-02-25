/**
 * Tooltip extension for MailCheck extension.
 * This script is based on work made by @ptech for zepto-tooltip project.
 * http://github.com/ptech/zepto-tooltip
 * 
 * Author
 * Matthieu Bilbille (@bilubilu28)
 */

 var MailCheckTooltip = {
    source: '',
    suggestion: '',
    tooltip: $('<div class="mailcheck-tooltip"></div>'),
    timeout: '',
    target: '',

    left: 0,
    top: 0,
    width: 0,
    height: 0,


    create: function(source, suggestion){
        MailCheckTooltip.source = source;
        MailCheckTooltip.suggestion = suggestion;
        suggestion = chrome.i18n.getMessage("notifMessage", ['<a href="#">' + suggestion + '</a>']);
        MailCheckTooltip.tooltip.css('opacity', 0).html(suggestion).appendTo('body');
        MailCheckTooltip.width = MailCheckTooltip.tooltip.width();
        MailCheckTooltip.height = MailCheckTooltip.tooltip.height();
        return MailCheckTooltip;
    },
    show: function(target){
        MailCheckTooltip.target = target;
        MailCheckTooltip.left = target.offset().left + 20;
        MailCheckTooltip.top = target.offset().top + target.height();

        MailCheckTooltip.tooltip.css({
            left: MailCheckTooltip.left,
            top: MailCheckTooltip.top
        }).animate({
            translateY: "10px",
            opacity: 1
        }, 50);

        // Close tooltip
        MailCheckTooltip.timeout = window.setTimeout(function() { 
            MailCheckTooltip.close() 
        }, 5000);
        MailCheckTooltip.tooltip.on("click", function(){
            MailCheckTooltip.close();
        }); 
        target.on("focus.notkeep", function(){
            MailCheckTooltip.close();
        });
        MailCheckTooltip.tooltip.children('a').on("click", function(){
            var val = MailCheckTooltip.target.val();
            MailCheckTooltip.target.val(val.replace(MailCheckTooltip.source, MailCheckTooltip.suggestion));
        });
    },
    close: function(){
        MailCheckTooltip.tooltip.off("click");
        MailCheckTooltip.target.off("focus.notkeep");
        clearTimeout(MailCheckTooltip.timeout);
        MailCheckTooltip.tooltip.children('a').off("click");
        MailCheckTooltip.tooltip.animate({
            translateY: "-10px",
            opacity: 0
        }, 50, 'linear', function() {
            MailCheckTooltip.tooltip.remove();
        });
    }
}
