/**
 * Tooltip extension for MailCheck extension.
 * This script is based on work made by @ptech for zepto-tooltip project.
 * http://github.com/ptech/zepto-tooltip
 * 
 * Author
 * Matthieu Bilbille (@bilubilu28)
 */
 var mailcheck = mailcheck || {};
 mailcheck.tooltip = {
    source: '',
    suggestion: '',
    
    timeout: '',
    target: '',

    element: $('<div class="mailcheck-tooltip"></div>'),
    left: 0,
    top: 0,
    width: 0,
    height: 0,

    create: function(source, suggestion){
        this.source = source;
        this.suggestion = suggestion;
        suggestion = chrome.i18n.getMessage("notifMessage", ['<a href="#">' + suggestion + '</a>']);
        this.element.css('opacity', 0).html(suggestion).appendTo('body');
        this.width = this.element.width();
        this.height = this.element.height();
        return this;
    },
    show: function(target){
        this.target = target;
        this.left = target.offset().left + 20;
        this.top = target.offset().top + target.height();

        this.element.css({
            left: this.left,
            top: this.top
        }).animate({
            translateY: "10px",
            opacity: 1
        }, 50);

        // Close tooltip
        this.timeout = window.setTimeout(mailcheck.tooltip.close.bind(this), 1e4);
        this.element.on("click", mailcheck.tooltip.close.bind(this)); 
        target.on("focus.notkeep", mailcheck.tooltip.close.bind(this));
        this.element.children('a').on("click", function(){
            var val = mailcheck.tooltip.target.val();
            val = val.replace(mailcheck.tooltip.source, mailcheck.tooltip.suggestion);
            mailcheck.tooltip.target.val(val);
        });
    },
    close: function(){
        this.element.off("click");
        this.target.off("focus.notkeep");
        clearTimeout(this.timeout);
        this.element.children('a').off("click");
        this.element.animate({
            translateY: "-10px",
            opacity: 0
        }, 50, 'linear', function() {
            mailcheck.tooltip.element.remove();
        });
    }
}
