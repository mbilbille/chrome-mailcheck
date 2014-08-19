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
    suggestion: {},
    element: null,
    timeout: 0,
    flag: false,

    options: {
        container: "body",
        placement: "bottom",
        trigger: "manual",
        html: "true",
        template: "<div class='cm-tooltip tooltip' role='tooltip'><button type='button' class='cm-close'><span>&times;</span></button><div class='cm-tooltip-arrow tooltip-arrow'></div><div class='cm-tooltip-inner tooltip-inner'></div></div>"
    },

    show: function(source, suggestion, element) {
        this.source = source;
        this.suggestion = suggestion;

        // Generate tooltip
        $(element).tooltip($.extend({}, ChromeMailcheck.tooltip.options, {
           title: chrome.i18n.getMessage("notifMessage", ["<a class='cm-link' href='#'>" + suggestion.full + "</a>"])
        }));

        // ... and show
        $(element).tooltip("show");
        var id = $(element).attr("aria-describedby");

        // close tooltip
        //  - automatically after x seconds
        //  - manually closed
        //  - click on suggestion
        clearTimeout(this.timeout);
        this.timeout = window.setTimeout(function() {
            ChromeMailcheck.tooltip.hide(element);
        }, ChromeMailcheck.options.displayTime);
        $("#" + id + " .cm-close").on("click", function() {
            (ChromeMailcheck.tooltip.flag) ? ChromeMailcheck.tooltip.hide(element) : ChromeMailcheck.tooltip.addDomain(element);
        });
        $("#" + id + " a").on("click", function(e){
            e.preventDefault();
            var val = $(ChromeMailcheck.tooltip.element).val();
            val = val.replace(ChromeMailcheck.tooltip.source, ChromeMailcheck.tooltip.suggestion.full);
            $(ChromeMailcheck.tooltip.element).val(val);
            ChromeMailcheck.tooltip.hide(element);
        });
    },

    reset: function(element) {
        var id = $(element).attr("aria-describedby");
        clearTimeout(this.timeout);
        $("#" + id).children("a").off("click");
    },

    hide: function(element) {
        var id = $(element).attr("aria-describedby");
        ChromeMailcheck.tooltip.reset(element);
        $(element).tooltip("destroy");
        $("#" + id + " .cm-close").off("click");
        this.flag = false;
    },

    addDomain: function(element) {
        var id = $(element).attr("aria-describedby");
        var domain = ChromeMailcheck.tooltip.source.replace(/.*@/, "");
        ChromeMailcheck.tooltip.reset(element);
        $(".tooltip-inner").html(chrome.i18n.getMessage("notifAddToWhitelist", ["<a class='cm-link' href='#'>" + domain + "</a>"]));
        $("#" + id + " a").on("click", function(e){
            e.preventDefault();
            ChromeMailcheck.options.domains.push(items.domains);
            chrome.storage.sync.set({"domains" : ChromeMailcheck.options.domains});
        });
        this.flag = true;
    }
};
