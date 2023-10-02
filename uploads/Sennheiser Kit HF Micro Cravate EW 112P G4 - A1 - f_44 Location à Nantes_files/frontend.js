(function (a) {
    function h() {
        var i = jQuery("body").innerWidth();
        i += c();
        if (i > 991) {
            a(".azirspares-menu-wapper").each(function () {
                if (a(this).length > 0) {
                    var j = a(this);
                    if (j != "undefined") {
                        var l = 0, k = j.offset();
                        l = j.innerWidth();
                        setTimeout(function () {
                            a(".main-menu .item-megamenu").each(function (p, o) {
                                a(o).children(".megamenu").css({"max-width": l + "px"});
                                var v = a(o).children(".megamenu").outerWidth(), r = a(o).outerWidth(), m = k.left,
                                    n = (m + l), q = a(o).offset().left, t = (v / 2 > (q - m)), u = ((v / 2 + q) > n);
                                a(o).children(".megamenu").css({left: "-" + (v / 2 - r / 2) + "px"});
                                if (t) {
                                    var s = (q - m);
                                    a(o).children(".megamenu").css({left: -s + "px"})
                                }
                                if (u && !t) {
                                    var s = (q - m);
                                    s = s - (l - v);
                                    a(o).children(".megamenu").css({left: -s + "px"})
                                }
                            })
                        }, 100)
                    }
                }
            })
        }
    }

    function b() {
        var i = parseInt(a(".container").innerWidth()) - 30;
        a(".azirspares-menu-wapper.vertical.support-mega-menu").each(function () {
            var j = parseInt(a(this).actual("width")), k = (i - j);
            if (k > 0) {
                a(this).find(".megamenu").each(function () {
                    var l = a(this).attr("style");
                    l = (l == undefined) ? "" : l;
                    l = l + " max-width:" + k + "px;";
                    a(this).attr("style", l)
                })
            }
        })
    }

    function c() {
        var i = jQuery('<div style="width:100%;height:200px;">test</div>'),
            j = jQuery('<div style="width:200px;height:150px;position:absolute;top:0;left:0;visibility:hidden;overflow:hidden;"></div>').append(i),
            k = i[0], l = j[0];
        jQuery("body").append(l);
        var m = k.offsetWidth;
        j.css("overflow", "scroll");
        var n = l.clientWidth;
        j.remove();
        return (m - n)
    }

    function f() {
        if (!a(".azirspares-menu-clone-wrap").length && a(".azirspares-clone-mobile-menu").length > 0) {
            a("body").prepend('<div class="azirspares-menu-clone-wrap"><div class="azirspares-menu-panels-actions-wrap"><a class="azirspares-menu-close-btn azirspares-menu-close-panels" href="#">x</a></div><div class="azirspares-menu-panels"></div></div>')
        }
        var j = 0, k = Array();
        if (!a(".azirspares-menu-clone-wrap .azirspares-menu-panels #azirspares-menu-panel-main").length) {
            a(".azirspares-menu-clone-wrap .azirspares-menu-panels").append('<div id="azirspares-menu-panel-main" class="azirspares-menu-panel azirspares-menu-panel-main"><ul class="depth-01"></ul></div>')
        }
        a(".azirspares-clone-mobile-menu").each(function () {
            var i = a(this), p = i, m = p.attr("id"), l = "azirspares-menu-clone-" + m;
            if (!a("#" + l).length) {
                var n = i.clone(true);
                n.find(".menu-item").addClass("clone-menu-item");
                n.find("[id]").each(function () {
                    n.find('.vc_tta-panel-heading a[href="#' + a(this).attr("id") + '"]').attr("href", "#" + e(a(this).attr("id"), "azirspares-menu-clone-"));
                    n.find('.azirspares-menu-tabs .tabs-link a[href="#' + a(this).attr("id") + '"]').attr("href", "#" + e(a(this).attr("id"), "azirspares-menu-clone-"));
                    a(this).attr("id", e(a(this).attr("id"), "azirspares-menu-clone-"))
                });
                n.find(".azirspares-menu-menu").addClass("azirspares-menu-menu-clone");
                var o = a(".azirspares-menu-clone-wrap .azirspares-menu-panels #azirspares-menu-panel-main ul");
                o.append(n.html());
                d(o, j)
            }
        })
    }

    function d(j, k) {
        if (j.find(".menu-item-has-children").length) {
            j.find(".menu-item-has-children").each(function () {
                var m = a(this);
                d(m, k);
                var i = "azirspares-menu-panel-" + k;
                while (a("#" + i).length) {
                    k++;
                    i = "azirspares-menu-panel-" + k
                }
                m.prepend('<a class="azirspares-menu-next-panel" href="#' + i + '" data-target="#' + i + '"></a>');
                var l = a("<div>").append(m.find("> .submenu").clone()).html();
                m.find("> .submenu").remove();
                a(".azirspares-menu-clone-wrap .azirspares-menu-panels").append('<div id="' + i + '" class="azirspares-menu-panel azirspares-menu-sub-panel azirspares-menu-hidden">' + l + "</div>")
            })
        }
    }

    function e(j, i) {
        return i + j
    }

    function g(i, k) {
        var j = new RegExp(i + "=([^&]*)", "i").exec(k);
        return j && j[1] || ""
    }

    a(document).ready(function () {
        h();
        b();
        a(document).on("click", ".menu-toggle", function () {
            a(".azirspares-menu-clone-wrap").addClass("open");
            return false
        });
        a(document).on("click", ".azirspares-menu-clone-wrap .azirspares-menu-close-panels", function () {
            a(".azirspares-menu-clone-wrap").removeClass("open");
            return false
        });
        a(document).on("click", function (i) {
            if (i.offsetX > a(".azirspares-menu-clone-wrap").width()) {
                a(".azirspares-menu-clone-wrap").removeClass("open")
            }
        });
        a(document).on("click", ".azirspares-menu-next-panel", function (j) {
            var i = a(this), n = i.closest(".menu-item"), o = i.closest(".azirspares-menu-panel"), m = i.attr("href");
            if (a(m).length) {
                o.addClass("azirspares-menu-sub-opened");
                a(m).addClass("azirspares-menu-panel-opened").removeClass("azirspares-menu-hidden").attr("data-parent-panel", o.attr("id"));
                var l = n.find(".azirspares-menu-item-title").attr("title"), k = "";
                if (a(".azirspares-menu-panels-actions-wrap .azirspares-menu-current-panel-title").length > 0) {
                    k = a(".azirspares-menu-panels-actions-wrap .azirspares-menu-current-panel-title").html()
                }
                if (typeof l != "undefined" && typeof l != false) {
                    if (!a(".azirspares-menu-panels-actions-wrap .azirspares-menu-current-panel-title").length) {
                        a(".azirspares-menu-panels-actions-wrap").prepend('<span class="azirspares-menu-current-panel-title"></span>')
                    }
                    a(".azirspares-menu-panels-actions-wrap .azirspares-menu-current-panel-title").html(l)
                } else {
                    a(".azirspares-menu-panels-actions-wrap .azirspares-menu-current-panel-title").remove()
                }
                a(".azirspares-menu-panels-actions-wrap .azirspares-menu-prev-panel").remove();
                a(".azirspares-menu-panels-actions-wrap").prepend('<a data-prenttitle="' + k + '" class="azirspares-menu-prev-panel" href="#' + o.attr("id") + '" data-cur-panel="' + m + '" data-target="#' + o.attr("id") + '"></a>')
            }
            j.preventDefault()
        });
        a(document).on("click", ".azirspares-menu-prev-panel", function (k) {
            var i = a(this), j = i.attr("data-cur-panel"), n = i.attr("href");
            a(j).removeClass("azirspares-menu-panel-opened").addClass("azirspares-menu-hidden");
            a(n).addClass("azirspares-menu-panel-opened").removeClass("azirspares-menu-sub-opened");
            var m = a(n).attr("data-parent-panel");
            if (typeof m == "undefined" || typeof m == false) {
                a(".azirspares-menu-panels-actions-wrap .azirspares-menu-prev-panel").remove();
                a(".azirspares-menu-panels-actions-wrap .azirspares-menu-current-panel-title").remove()
            } else {
                a(".azirspares-menu-panels-actions-wrap .azirspares-menu-prev-panel").attr("href", "#" + m).attr("data-cur-panel", n).attr("data-target", "#" + m);
                var l = a("#" + m).find('.azirspares-menu-next-panel[data-target="' + n + '"]').closest(".menu-item").find(".azirspares-menu-item-title").attr("data-title");
                l = a(this).data("prenttitle");
                if (typeof l != "undefined" && typeof l != false) {
                    if (!a(".azirspares-menu-panels-actions-wrap .azirspares-menu-current-panel-title").length) {
                        a(".azirspares-menu-panels-actions-wrap").prepend('<span class="azirspares-menu-current-panel-title"></span>')
                    }
                    a(".azirspares-menu-panels-actions-wrap .azirspares-menu-current-panel-title").html(l)
                } else {
                    a(".azirspares-menu-panels-actions-wrap .azirspares-menu-current-panel-title").remove()
                }
            }
            k.preventDefault()
        })
    });
    a(window).on("resize", function () {
        h();
        b()
    });
    a(window).load(function () {
        f()
    })
})(jQuery);