jQuery(document).ready(function () {
        var iframe = $("<iframe>", {
            "id": "calendar",
            "src": "https://www.google.com/calendar/embed...",
            "target": "_top"
        });
        iframe.on("load", function (e) {
            $(e.target)
                .contents()
                .find(".blablah")
                .css("display", "none");
            return false
        });
    })(jQuery);