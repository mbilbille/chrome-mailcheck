/**
 * Tooltip extension for MailCheck extension.
 *
 * Author
 * Matthieu Bilbille (@bilubilu28)
 */
 var ChromeMailcheck = ChromeMailcheck || {};
 ChromeMailcheck.tooltip = {
    id: "",
    source: "",
    suggestion: "",
    element: null,
    timeout: 0,

    show: function(source, suggestion, element) {
        this.source = source;
        this.suggestion = suggestion;
        this.element = element;

        // Generate tooltip
        $(this.element).tooltip({
           title: chrome.i18n.getMessage("notifMessage", ["<strong class='cm-mail'>" + suggestion + "</strong>"]),
           container: "body",
           placement: "bottom",
           trigger: "manual",
           html: "true",
           template: "<div class='cm-tooltip tooltip' role='tooltip'><button type='button' class='cm-close'><span>&times;</span></button><div class='cm-tooltip-arrow tooltip-arrow'></div><div class='cm-tooltip-inner tooltip-inner'></div></div>"
        });

        // ... and show
        $(this.element).tooltip("show");
        this.id = $(this.element).attr("aria-describedby");

        // close tooltip
        //  - automatically after x seconds
        //  - manually closed
        //  - click on suggestion
        this.timeout = window.setTimeout(function() {
            ChromeMailcheck.tooltip.hide();
        }, 7500);
        $("#" + this.id + " .cm-close").on("click", function() {
            ChromeMailcheck.tooltip.hide();
        });
        $("#" + this.id + " .cm-mail").on("click", function(){
            var val = $(ChromeMailcheck.tooltip.element).val();
            val = val.replace(ChromeMailcheck.tooltip.source, ChromeMailcheck.tooltip.suggestion);
            $(ChromeMailcheck.tooltip.element).val(val);
            ChromeMailcheck.tooltip.hide();
        });
    },

    hide: function() {
        $(this.element).tooltip("destroy");
        $(".tooltip").off("click");
        $("#" + this.id).children("a").off("click");
        clearTimeout(this.timeout);
    }
};
