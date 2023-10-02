jQuery(document).ready(function ($) {
    "use strict";
    
    var $body = $('body'),
        has_rtl = $body.hasClass('rtl');
    
    /* NOTIFICATIONS */
    function azirspares_setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }
    
    function azirspares_getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    
    $(document).on('click', '.remove_from_cart_button', function () {
        var cart_item_key = $(this).data('cart_item_key');
        azirspares_setCookie("cart_item_key_just_removed", cart_item_key, 1);
        azirspares_setCookie("undo_cart_link", azirspares_ajax_frontend.wp_nonce_url + '&undo_item=' + cart_item_key, 1);
    });
    
    $(document.body).on('removed_from_cart', function (a, b) {
        var cart_item_key = azirspares_getCookie("cart_item_key_just_removed");
        var undo_cart_link = azirspares_getCookie("undo_cart_link");
        var config = [];
        config['title'] = azirspares_ajax_frontend.growl_notice_text;
        config['message'] =
            '<p class="growl-content">' + azirspares_ajax_frontend.removed_cart_text;
        
        $.growl.notice(config);
    });
    $body.on('click', 'a.add_to_cart_button', function () {
        $('a.add_to_cart_button').removeClass('recent-added');
        $(this).addClass('recent-added');
        
        if ($(this).is('.product_type_variable, .isw-ready')) {
            $(this).addClass('loading');
        }
        
    });
    
    // On single product page
    $body.on('click', 'button.single_add_to_cart_button', function () {
        $('button.single_add_to_cart_button').removeClass('recent-added');
        $(this).addClass('recent-added');
    });
    
    $body.on('click', '.add_to_wishlist', function () {
        $(this).addClass('loading');
    });
    
    $body.on('added_to_cart', function () {
        var config = [];
        config['title'] = azirspares_ajax_frontend.growl_notice_text;
        
        $('.add_to_cart_button.product_type_variable.isw-ready').removeClass('loading');
        
        var $recentAdded = $('.add_to_cart_button.recent-added, button.single_add_to_cart_button.recent-added'),
            $img = $recentAdded.closest('.product-item').find('img.img-responsive'),
            pName = $recentAdded.attr('aria-label');
        
        // if add to cart from wishlist
        if (!$img.length) {
            $img = $recentAdded.closest('.wishlist_item')
                .find('.wishlist_item_product_image img');
        }
        
        // if add to cart from single product page
        if (!$img.length) {
            $img = $recentAdded.closest('.summary')
                .prev()
                .find('.woocommerce-main-image img');
        }
        
        // reset state after 5 sec
        setTimeout(function () {
            $recentAdded.removeClass('added').removeClass('recent-added');
            $recentAdded.next('.added_to_cart').remove();
        }, 5000);
        
        if (typeof pName == 'undefined' || pName == '') {
            pName = $recentAdded.closest('.summary').find('.product_title').text().trim();
        }
        
        if (typeof pName !== 'undefined') {
            
            config['message'] = (
                $img.length ? '<img src="' + $img.attr('src') + '"' + ' alt="' + pName + '" class="growl-thumb" />' : ''
            ) + '<p class="growl-content">' + pName + ' ' + azirspares_ajax_frontend.added_to_cart_notification_text + '&nbsp;<a href="' + azirspares_ajax_frontend.wc_cart_url + '">' + azirspares_ajax_frontend.view_cart_notification_text + '</a></p>';
            
        } else {
            config['message'] =
                azirspares_ajax_frontend.added_to_cart_text + '&nbsp;<a href="' + azirspares_ajax_frontend.wc_cart_url + '">' + azirspares_ajax_frontend.view_cart_notification_text + '</a>';
        }
        
        $.growl.notice(config);
    });
    $body.on('added_to_wishlist', function () {
        var config = [];
        config['title'] = azirspares_ajax_frontend.growl_notice_text;
        
        $('#yith-wcwl-popup-message').remove();
        
        config['message'] =
            '<p class="growl-content">' + azirspares_ajax_frontend.added_to_wishlist_text + '&nbsp;<a href="' + azirspares_ajax_frontend.wishlist_url + '">' + azirspares_ajax_frontend.browse_wishlist_text + '</a></p>';
        
        $.growl.notice(config);
    });
    
    function famiau_resizefFiltermenu() {
    
    }
    
    function famiau_accodion_filter($elem) {
    
    }
    
    function azirspares_banner_adv() {
        if ($('#banner-adv').length > 0) {
            $('.close-banner').on('click', function () {
                $('#banner-adv').hide();
            });
        }
    }
    
    function azirspares_sticky_single() {
        var _previousScroll = 0,
            _headerOrgOffset = $('#header').outerHeight();
        if ($(window).width() > 1024) {
            $(document).on('scroll', function (ev) {
                var _currentScroll = $(this).scrollTop();
                if (_currentScroll > _headerOrgOffset) {
                    if (_currentScroll > _previousScroll) {
                        $('body').addClass('show-sticky_info_single');
                    }
                } else {
                    $('body').removeClass('show-sticky_info_single');
                }
                _previousScroll = _currentScroll;
            });
        }
    }
    
    function azirspares_clone_append_category() {
        if ($('.product-category').length > 0) {
            $('.shop-page .main-content .azirspares-products').prepend('<ul class="list-cate"></ul>')
            $('.product-category').detach().prependTo('.list-cate');
            
        }
    }
    
    function azirspares_fix_vc_full_width_row() {
        if ($('body.rtl').length) {
            var $elements = $('[data-vc-full-width="true"]');
            $.each($elements, function () {
                var $el = $(this);
                $el.css('right', $el.css('left')).css('left', '');
            });
        }
    }
    
    function azirspares_force_vc_full_width_row_rtl() {
        var _elements = $('[data-vc-full-width="true"]');
        $.each(_elements, function (key, item) {
            var $this = $(this);
            if ($this.parent('[data-vc-full-width="true"]').length > 0) {
                return;
            } else {
                var this_left = $this.css('left'),
                    this_child = $this.find('[data-vc-full-width="true"]');
                
                if (this_child.length > 0) {
                    $this.css({
                        'left': '',
                        'right': this_left
                    });
                    this_child.css({
                        'left': 'auto',
                        'padding-left': this_left.replace('-', ''),
                        'padding-right': this_left.replace('-', ''),
                        'right': this_left
                    });
                } else {
                    $this.css({
                        'left': 'auto',
                        'right': this_left
                    });
                }
            }
        }), $(document).trigger('azirspares-force-vc-full-width-row-rtl', _elements);
    };
    
    function azirspares_fix_full_width_row_rtl() {
        if (has_rtl) {
            $('.chosen-container').each(function () {
                $(this).addClass('chosen-rtl');
            });
            $(document).on('vc-full-width-row', function () {
                azirspares_force_vc_full_width_row_rtl();
            });
        }
    };
    
    function azirspares_sticky_menu($elem) {
        var $this = $elem;
        $this.on('azirspares_sticky_menu', function () {
            $this.each(function () {
                var previousScroll = 0,
                    header = $(this).closest('.header'),
                    header_wrap_stick = $(this),
                    header_position = $(this).find('.header-position'),
                    headerOrgOffset = header_position.offset().top;
                
                if ($(window).width() > 1024) {
                    header_wrap_stick.css('height', header_wrap_stick.outerHeight());
                    $(document).on('scroll', function (ev) {
                        var currentScroll = $(this).scrollTop();
                        if (currentScroll > headerOrgOffset) {
                            if (currentScroll > previousScroll) {
                                header_position.addClass('hide-header');
                            } else {
                                header_position.removeClass('hide-header');
                                header_position.addClass('fixed');
                            }
                        } else {
                            header_position.removeClass('fixed');
                        }
                        previousScroll = currentScroll;
                    });
                } else {
                    header_wrap_stick.css("height", "auto");
                }
            })
        }).trigger('azirspares_sticky_menu');
        $(window).on('resize', function () {
            $this.trigger('azirspares_sticky_menu');
        });
    }
    
    function azirspares_vertical_menu($elem) {
        /* SHOW ALL ITEM */
        var _countLi = 0,
            _verticalMenu = $elem.find('.vertical-menu'),
            _blockNav = $elem.closest('.block-nav-category'),
            _blockTitle = $elem.find('.block-title');
        
        $elem.each(function () {
            var _dataItem = $(this).data('items') - 1;
            _countLi = $(this).find('.vertical-menu>li').length;
            
            if (_countLi > (_dataItem + 1)) {
                $(this).addClass('show-button-all');
            }
            $(this).find('.vertical-menu>li').each(function (i) {
                _countLi = _countLi + 1;
                if (i > _dataItem) {
                    $(this).addClass('link-other');
                }
            })
        });
        
        $elem.find('.vertical-menu').each(function () {
            var _main = $(this);
            _main.children('.menu-item.parent').each(function () {
                var curent = $(this).find('.submenu');
                $(this).children('.toggle-submenu').on('click', function () {
                    $(this).parent().children('.submenu').stop().slideToggle(300);
                    _main.find('.submenu').not(curent).stop().slideUp(300);
                    $(this).parent().toggleClass('show-submenu');
                    _main.find('.menu-item.parent').not($(this).parent()).removeClass('show-submenu');
                });
                var next_curent = $(this).find('.submenu');
                next_curent.children('.menu-item.parent').each(function () {
                    var child_curent = $(this).find('.submenu');
                    $(this).children('.toggle-submenu').on('click', function () {
                        $(this).parent().parent().find('.submenu').not(child_curent).stop().slideUp(300);
                        $(this).parent().children('.submenu').stop().slideToggle(300);
                        $(this).parent().parent().find('.menu-item.parent').not($(this).parent()).removeClass('show-submenu');
                        $(this).parent().toggleClass('show-submenu');
                    })
                });
            });
        });
        
        /* VERTICAL MENU ITEM */
        if (_verticalMenu.length > 0) {
            $(document).on('click', '.open-cate', function (e) {
                _blockNav.find('li.link-other').each(function () {
                    $(this).slideDown();
                });
                $(this).addClass('close-cate').removeClass('open-cate').html($(this).data('closetext'));
                e.preventDefault();
            });
            $(document).on('click', '.close-cate', function (e) {
                _blockNav.find('li.link-other').each(function () {
                    $(this).slideUp();
                });
                $(this).addClass('open-cate').removeClass('close-cate').html($(this).data('alltext'));
                e.preventDefault();
            });
            
            _blockTitle.on('click', function () {
                $(this).toggleClass('active');
                $(this).parent().toggleClass('has-open');
                $body.toggleClass('category-open');
            });
        }
    }
    
    function azirspares_auto_width_vertical_menu() {
        var full_width = parseInt($('.container').outerWidth()) - 50;
        var menu_width = parseInt($('.vertical-menu').outerWidth());
        var w = (full_width - menu_width);
        $('.vertical-menu').find('.megamenu').each(function () {
            $(this).css('max-width', w + 'px');
        });
    };
    
    function azirspares_animation_tabs($elem, _tab_animated) {
        _tab_animated = (_tab_animated == undefined || _tab_animated == "") ? '' : _tab_animated;
        if (_tab_animated == "") {
            return;
        }
        $elem.find('.owl-slick .slick-active, .product-list-grid .product-item').each(function (i) {
            var _this = $(this),
                _style = _this.attr('style'),
                _delay = i * 200;
            
            _style = (_style == undefined) ? '' : _style;
            _this.attr('style', _style +
                ';-webkit-animation-delay:' + _delay + 'ms;'
                + '-moz-animation-delay:' + _delay + 'ms;'
                + '-o-animation-delay:' + _delay + 'ms;'
                + 'animation-delay:' + _delay + 'ms;'
            ).addClass(_tab_animated + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                _this.removeClass(_tab_animated + ' animated');
                _this.attr('style', _style);
            });
        });
    }
    
    function azirspares_init_carousel($elem) {
        $elem.not('.slick-initialized').each(function () {
            var _this = $(this),
                _responsive = _this.data('responsive'),
                _config = [];
            
            if (has_rtl) {
                _config.rtl = true;
            }
            if (_this.hasClass('slick-vertical')) {
                _config.prevArrow = '<span class="fa fa-angle-up prev"></span>';
                _config.nextArrow = '<span class="fa fa-angle-down next"></span>';
            } else {
                _config.prevArrow = '<span class="fa fa-angle-left prev"></span>';
                _config.nextArrow = '<span class="fa fa-angle-right next"></span>';
            }
            _config.responsive = _responsive;
            
            _this.on('init', function (event, slick, direction) {
                azirspares_popover_button();
            });
            _this.slick(_config);
            _this.on('afterChange', function (event, slick, direction) {
                azirspares_init_lazy_load(_this.find('.lazy'));
            });
        });
    }
    
    function azirspares_product_thumb($elem) {
        $elem.on('azirspares_product_thumb', function () {
            $elem.not('.slick-initialized').each(function () {
                var _this = $(this),
                    _responsive = JSON.parse(azirspares_global_frontend.data_responsive),
                    _config = JSON.parse(azirspares_global_frontend.data_slick);
                
                if (has_rtl) {
                    _config.rtl = true;
                }
                _config.infinite = false;
                _config.prevArrow = '<span class="fa fa-angle-left prev"></span>';
                _config.nextArrow = '<span class="fa fa-angle-right next"></span>';
                _config.responsive = _responsive;
                
                _this.slick(_config);
            });
        }).trigger('azirspares_product_thumb');
    }
    
    function azirspares_countdown($elem) {
        $elem.on('azirspares_countdown', function () {
            $elem.each(function () {
                var _this = $(this),
                    _text_countdown = '';
                
                _this.countdown(_this.data('datetime'), function (event) {
                    _text_countdown = event.strftime(
                        '<span class="days"><span class="number">%D</span><span class="text">' + azirspares_global_frontend.countdown_day + '</span></span>' +
                        '<span class="hour"><span class="number">%H</span><span class="text">' + azirspares_global_frontend.countdown_hrs + '</span></span>' +
                        '<span class="mins"><span class="number">%M</span><span class="text">' + azirspares_global_frontend.countdown_mins + '</span></span>' +
                        '<span class="secs"><span class="number">%S</span><span class="text">' + azirspares_global_frontend.countdown_secs + '</span></span>'
                    );
                    _this.html(_text_countdown);
                });
            });
        }).trigger('azirspares_countdown');
    }
    
    function azirspares_init_lazy_load($elem) {
        var _this = $elem;
        _this.each(function () {
            var _config = [];
            
            _config.beforeLoad = function (element) {
                if (element.is('div') == true) {
                    element.addClass('loading-lazy');
                } else {
                    element.parent().addClass('loading-lazy');
                }
            };
            _config.afterLoad = function (element) {
                if (element.is('div') == true) {
                    element.removeClass('loading-lazy');
                } else {
                    element.parent().removeClass('loading-lazy');
                }
            };
            _config.effect = "fadeIn";
            _config.enableThrottle = true;
            _config.throttle = 250;
            _config.effectTime = 600;
            if ($(this).closest('.megamenu').length > 0)
                _config.delay = 0;
            $(this).lazy(_config);
        });
    }
    
    // azirspares_init_dropdown
    $(document).on('click', function (event) {
        var _target = $(event.target).closest('.azirspares-dropdown'),
            _parent = $('.azirspares-dropdown');
        
        if (_target.length > 0) {
            _parent.not(_target).removeClass('open');
            if (
                $(event.target).is('[data-azirspares="azirspares-dropdown"]') ||
                $(event.target).closest('[data-azirspares="azirspares-dropdown"]').length > 0
            ) {
                _target.toggleClass('open');
                event.preventDefault();
            }
        } else {
            $('.azirspares-dropdown').removeClass('open');
        }
    });
    
    // category product
    function azirspares_category_product($elem) {
        $elem.each(function () {
            var _main = $(this);
            _main.find('.cat-parent').each(function () {
                if ($(this).hasClass('current-cat-parent')) {
                    $(this).addClass('show-sub');
                    $(this).children('.children').stop().slideDown(300);
                }
                $(this).children('.children').before('<span class="carets"></span>');
            });
            _main.children('.cat-parent').each(function () {
                var curent = $(this).find('.children');
                $(this).children('.carets').on('click', function () {
                    $(this).parent().toggleClass('show-sub');
                    $(this).parent().children('.children').stop().slideToggle(300);
                    _main.find('.children').not(curent).stop().slideUp(300);
                    _main.find('.cat-parent').not($(this).parent()).removeClass('show-sub');
                });
                var next_curent = $(this).find('.children');
                next_curent.children('.cat-parent').each(function () {
                    var child_curent = $(this).find('.children');
                    $(this).children('.carets').on('click', function () {
                        $(this).parent().toggleClass('show-sub');
                        $(this).parent().parent().find('.cat-parent').not($(this).parent()).removeClass('show-sub');
                        $(this).parent().parent().find('.children').not(child_curent).stop().slideUp(300);
                        $(this).parent().children('.children').stop().slideToggle(300);
                    })
                });
            });
        });
    }
    
    function azirspares_magnific_popup() {
        $('.famiau-play-video').magnificPopup({
            type: 'iframe',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            preloader: false,
            disableOn: false,
            fixedContentPos: false
        });
        $('.play-video').magnificPopup({
            type: 'iframe',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            preloader: false,
            disableOn: false,
            fixedContentPos: false
        });
        $('.product-video-button a').magnificPopup({
            type: 'iframe',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            preloader: false,
            disableOn: false,
            fixedContentPos: false
        });
        $('.product-360-button a').magnificPopup({
            type: 'inline',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            disableOn: false,
            preloader: false,
            fixedContentPos: false,
            callbacks: {
                open: function () {
                    // $(window).resize(); // ??
                }
            }
        });
    }
    
    function azirspares_better_equal_elems($elem) {
        $elem.each(function () {
            if ($(this).find('.equal-elem').length) {
                $(this).find('.equal-elem').css({
                    'height': 'auto'
                });
                var _height = 0;
                $(this).find('.equal-elem').each(function () {
                    if (_height < $(this).height()) {
                        _height = $(this).height();
                    }
                });
                $(this).find('.equal-elem').height(_height);
            }
        });
    }
    
    function azirspares_equal_categories($elem) {
        $elem.each(function () {
            if ($(this).find('.product-categories > .cat-item').length) {
                $(this).find('.product-categories > .cat-item').css({
                    'height': 'auto'
                });
                var _height = 0;
                $(this).find('.product-categories > .cat-item').each(function () {
                    if (_height < $(this).height()) {
                        _height = $(this).height();
                    }
                });
                $(this).find('.product-categories > .cat-item').height(_height);
            }
        });
    }
    
    // Azirspares Ajax Tabs
    $(document).on('click', '.azirspares-tabs .tab-link a, .azirspares-accordion .panel-heading a', function (e) {
        e.preventDefault();
        var _this = $(this),
            _ID = _this.data('id'),
            _tabID = _this.attr('href'),
            _ajax_tabs = _this.data('ajax'),
            _sectionID = _this.data('section'),
            _tab_animated = _this.data('animate'),
            _loaded = _this.closest('.tab-link,.azirspares-accordion').find('a.loaded').attr('href');
        
        if (_ajax_tabs == 1 && !_this.hasClass('loaded')) {
            $(_tabID).closest('.tab-container,.azirspares-accordion').addClass('loading');
            _this.parent().addClass('active').siblings().removeClass('active');
            $.ajax({
                type: 'POST',
                url: azirspares_ajax_frontend.ajaxurl,
                data: {
                    action: 'azirspares_ajax_tabs',
                    security: azirspares_ajax_frontend.security,
                    id: _ID,
                    section_id: _sectionID,
                },
                success: function (response) {
                    if (response['success'] == 'ok') {
                        $(_tabID).html($(response['html']).find('.vc_tta-panel-body').html());
                        $(_tabID).closest('.tab-container,.azirspares-accordion').removeClass('loading');
                        $('[href="' + _loaded + '"]').removeClass('loaded');
                        azirspares_countdown($(_tabID).find('.azirspares-countdown'));
                        azirspares_init_carousel($(_tabID).find('.owl-slick:not(.cat_list_mobile)'));
                        if ($('.owl-slick .product-item').length > 0) {
                            azirspares_hover_product_item($(_tabID).find('.owl-slick .row-item,' +
                                '.owl-slick .product-item.style-1,' +
                                '.owl-slick .product-item.style-2,' +
                                '.owl-slick .product-item.style-3,' +
                                '.owl-slick .product-item.style-4'));
                        }
                        if ($(_tabID).find('.variations_form').length > 0) {
                            $(_tabID).find('.variations_form').each(function () {
                                $(this).wc_variation_form();
                            });
                        }
                        $(_tabID).trigger('azirspares_ajax_tabs_complete');
                        _this.addClass('loaded');
                        $(_loaded).html('');
                    } else {
                        $(_tabID).closest('.tab-container,.azirspares-accordion').removeClass('loading');
                        $(_tabID).html('<strong>Error: Can not Load Data ...</strong>');
                    }
                    /* for accordion */
                    _this.closest('.panel-default').addClass('active').siblings().removeClass('active');
                    _this.closest('.azirspares-accordion').find(_tabID).slideDown(400);
                    _this.closest('.azirspares-accordion').find('.panel-collapse').not(_tabID).slideUp(400);
                },
                complete: function () {
                    $(_tabID).addClass('active').siblings().removeClass('active');
                    setTimeout(function (args) {
                        azirspares_animation_tabs($(_tabID), _tab_animated);
                    }, 10);
                }
            });
        } else {
            _this.parent().addClass('active').siblings().removeClass('active');
            $(_tabID).addClass('active').siblings().removeClass('active');
            /* for accordion */
            _this.closest('.panel-default').addClass('active').siblings().removeClass('active');
            _this.closest('.azirspares-accordion').find(_tabID).slideDown(400);
            _this.closest('.azirspares-accordion').find('.panel-collapse').not(_tabID).slideUp(400);
            azirspares_animation_tabs($(_tabID), _tab_animated);
        }
    });
    
    $(document).on('click', 'a.backtotop', function (e) {
        $('html, body').animate({scrollTop: 0}, 800);
        e.preventDefault();
    });
    
    $(document).on('scroll', function () {
        if ($(window).scrollTop() > 200) {
            $('.backtotop').addClass('active');
        } else {
            $('.backtotop').removeClass('active');
        }
        if ($(window).scrollTop() > 0) {
            $('body').addClass('scroll-mobile');
        } else {
            $('body').removeClass('scroll-mobile');
        }
    });
    
    $(document).on('click', '.quantity .quantity-plus', function (e) {
        var _this = $(this).closest('.quantity').find('input.qty'),
            _value = parseInt(_this.val()),
            _max = parseInt(_this.attr('max')),
            _step = parseInt(_this.data('step')),
            _value = _value + _step;
        if (_max && _value > _max) {
            _value = _max;
        }
        _this.val(_value);
        _this.trigger("change");
        e.preventDefault();
    });
    
    $(document).on('change', function () {
        $('.quantity').each(function () {
            var _this = $(this).find('input.qty'),
                _value = _this.val(),
                _max = parseInt(_this.attr('max'));
            if (_value > _max) {
                $(this).find('.quantity-plus').css('pointer-events', 'none')
            } else {
                $(this).find('.quantity-plus').css('pointer-events', 'auto')
            }
        })
    });
    
    $(document).on('click', '.quantity .quantity-minus', function (e) {
        var _this = $(this).closest('.quantity').find('input.qty'),
            _value = parseInt(_this.val()),
            _min = parseInt(_this.attr('min')),
            _step = parseInt(_this.data('step')),
            _value = _value - _step;
        if (_min && _value < _min) {
            _value = _min;
        }
        if (!_min && _value < 0) {
            _value = 0;
        }
        _this.val(_value);
        _this.trigger("change");
        e.preventDefault();
    });
    
    function azirspares_product_gallery($elem) {
        $elem.each(function () {
            var _items = $(this).closest('.product-inner').data('items'),
                _main_slide = $(this).find('.product-gallery-slick'),
                _dot_slide = $(this).find('.gallery-dots');
            
            _main_slide.not('.slick-initialized').each(function () {
                var _this = $(this),
                    _config = [];
                
                if ($('body').hasClass('rtl')) {
                    _config.rtl = true;
                }
                _config.prevArrow = '<span class="fa fa-angle-left prev"></span>';
                _config.nextArrow = '<span class="fa fa-angle-right next"></span>';
                _config.cssEase = 'linear';
                _config.infinite = true;
                _config.fade = true;
                _config.slidesMargin = 0;
                _config.arrows = false;
                _config.asNavFor = _dot_slide;
                _this.slick(_config);
            });
            _dot_slide.not('.slick-initialized').each(function () {
                var _config = [];
                if ($('body').hasClass('rtl')) {
                    _config.rtl = true;
                }
                _config.slidesToShow = _items;
                _config.infinite = true;
                _config.focusOnSelect = true;
                _config.vertical = true;
                _config.slidesMargin = 0;
                _config.prevArrow = '<span class="fa fa-angle-up prev"></span>';
                _config.nextArrow = '<span class="fa fa-angle-down next"></span>';
                _config.asNavFor = _main_slide;
                _config.responsive = [
                    {
                        breakpoint: 1199,
                        settings: {
                            vertical: false,
                            prevArrow: '<span class="fa fa-angle-left prev"></span>',
                            nextArrow: '<span class="fa fa-angle-right next"></span>',
                        }
                    }
                ];
                $(this).slick(_config);
            })
        })
    }
    
    function azirspares_hover_product_item($elem) {
        $elem.each(function () {
            var _winw = $(window).innerWidth();
            if (_winw > 1024) {
                $(this).on('mouseenter', function () {
                    $(this).closest('.slick-list').css({
                        'padding-left': '15px',
                        'padding-right': '15px',
                        'padding-bottom': '100px',
                        'margin-left': '-15px',
                        'margin-right': '-15px',
                        'margin-bottom': '-100px'
                    });
                });
                $(this).on('mouseleave', function () {
                    $(this).closest('.slick-list').css({
                        'padding-left': '0',
                        'padding-right': '0',
                        'padding-bottom': '0',
                        'margin-left': '0',
                        'margin-right': '0',
                        'margin-bottom': '0'
                    });
                });
            }
        });
    }
    
    function azirspares_hover_product_item_both($elem) {
        $elem.each(function () {
            var _winw = $(window).innerWidth();
            $(this).on('mouseenter', function () {
                $(this).closest('.slick-list').css({
                    'padding-left': '15px',
                    'padding-right': '15px',
                    'margin-left': '-15px',
                    'margin-right': '-15px'
                });
            });
            $(this).on('mouseleave', function () {
                $(this).closest('.slick-list').css({
                    'padding-left': '0',
                    'padding-right': '0',
                    'margin-left': '0',
                    'margin-right': '0'
                });
            });
        });
    }
    
    function azirspares_google_map($elem) {
        $elem.each(function () {
            var $id = $(this).data('id'),
                $latitude = $(this).data('latitude'),
                $longitude = $(this).data('longitude'),
                $zoom = $(this).data('zoom'),
                $map_type = $(this).data('map_type'),
                $title = $(this).data('title'),
                $address = $(this).data('address'),
                $phone = $(this).data('phone'),
                $email = $(this).data('email'),
                $hue = '',
                $saturation = '',
                $modify_coloring = true,
                $coinpo_map = {
                    lat: $latitude,
                    lng: $longitude
                };
            
            if ($modify_coloring === true) {
                var $styles = [
                    {
                        stylers: [
                            {hue: $hue},
                            {invert_lightness: false},
                            {saturation: $saturation},
                            {lightness: 1},
                            {
                                featureType: "landscape.man_made",
                                stylers: [{
                                    visibility: "on"
                                }]
                            }
                        ]
                    },
                ];
            }
            var map = new google.maps.Map(document.getElementById($id), {
                zoom: $zoom,
                center: $coinpo_map,
                mapTypeId: google.maps.MapTypeId.$map_type,
                styles: $styles
            });
            
            var contentString = '<div style="background-color:#fff; padding: 30px 30px 10px 25px; width:290px;line-height: 22px" class="coinpo-map-info">' +
                '<h4 class="map-title">' + $title + '</h4>' +
                '<div class="map-field"><i class="fa fa-map-marker"></i><span>&nbsp;' + $address + '</span></div>' +
                '<div class="map-field"><i class="fa fa-phone"></i><span>&nbsp;<a href="tel:' + $phone + '">' + $phone + '</a></span></div>' +
                '<div class="map-field"><i class="fa fa-envelope"></i><span><a href="mailto:' + $email + '">&nbsp;' + $email + '</a></span></div> ' +
                '</div>';
            
            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });
            
            var marker = new google.maps.Marker({
                position: $coinpo_map,
                map: map
            });
            marker.addListener('click', function () {
                infowindow.open(map, marker);
            });
        });
    }
    
    function azirspares_accodion_single_shop() {
        var allPanels = $('.accordion > .entry-content').hide();
        $(document).on('click', '.accordion > h3 > a', function () {
            allPanels.slideUp();
            $(this).parent().next().slideDown();
            return false;
        });
    }
    
    function azirspares_popover_button() {
        $('[data-toggle="tooltip"]').each(function () {

                $(this).tooltip({
                    title: $(this).text()
                });

        });
        // ,.product-item .add-to-cart a
        $('.product-item .yith-wcqv-button,.product-item .compare,.product-item .yith-wcwl-add-to-wishlist a').each(function () {
            $(this).tooltip({
                title: $(this).text(),
                trigger: 'hover',
                placement: 'top'
            });
        });
    }
    
    function azirspares_popup_newsletter() {
        var _popup = document.getElementById('popup-newsletter');
        if (_popup != null) {
            if (azirspares_global_frontend.azirspares_enable_popup_mobile != 1) {
                if ($(window).innerWidth() <= 992) {
                    return;
                }
            }
            var disabled_popup_by_user = getCookie('azirspares_disabled_popup_by_user');
            if (disabled_popup_by_user == 'true') {
                return;
            } else {
                if (azirspares_global_frontend.azirspares_enable_popup == 1) {
                    setTimeout(function () {
                        $(_popup).modal({
                            keyboard: false
                        });
                        $(_popup).find('.lazy').lazy({
                            delay: 0
                        });
                    }, azirspares_global_frontend.azirspares_popup_delay_time);
                }
            }
            $(document).on('click', '#popup-newsletter .checkbox', function () {
                setCookie('azirspares_disabled_popup_by_user', 'true', 7);
            });
        }
        
        function setCookie() {
            var d = new Date();
            d.setTime(d.getTime() + (arguments[2] * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = arguments[0] + "=" + arguments[1] + "; " + arguments[2];
        }
        
        function getCookie() {
            var name = arguments[0] + "=",
                ca = document.cookie.split(';'),
                i = 0,
                c = 0;
            for (; i < ca.length; ++i) {
                c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }
    }
    
    // Single product mobile add to cart fixed button
    $(document).on('click', '.azirspares-single-add-to-cart-fixed-top', function (e) {
        var $this = $(this);
        if ($('.product .summary button.single_add_to_cart_button').length) {
            $('.product .summary button.single_add_to_cart_button').trigger('click');
        }
        e.preventDefault();
    });
    
    $(document).on('click', '.box-mobile-menu .close-menu, .body-overlay,.box-mibile-overlay', function (e) {
        $('body').removeClass('box-mobile-menu-open real-mobile-show-menu');
        $('.hamburger').removeClass('is-active');
    });
    /*  Mobile Menu on real mobile (if header mobile is enabled) */
    $(document).on('click', '.mobile-hamburger-navigation ', function (e) {
        $(this).find('.hamburger').toggleClass('is-active');
        if ($(this).find('.hamburger').is('.is-active')) {
            $('body').toggleClass('real-mobile-show-menu box-mobile-menu-open');
        } else {
            $('body').removeClass('real-mobile-show-menu box-mobile-menu-open');
        }
        e.preventDefault();
    });
    /* Mobile menu (Desktop/responsive) */
    $(document).on('click', '.box-mobile-menu .clone-main-menu .toggle-submenu', function (e) {
        var $this = $(this);
        var thisMenu = $this.closest('.clone-main-menu');
        var thisMenuWrap = thisMenu.closest('.box-mobile-menu');
        thisMenu.removeClass('active');
        var text_next = $this.prev().text();
        thisMenuWrap.find('.box-title').html(text_next);
        thisMenu.find('li').removeClass('mobile-active');
        $this.parent().addClass('mobile-active');
        $this.parent().closest('.submenu').css({
            'position': 'static',
            'height': '0'
        });
        thisMenuWrap.find('.back-menu, .box-title').css('display', 'block');
        // Fix lazy for mobile menu
        if ($this.parent().find('.fami-lazy:not(.already-fix-lazy)').length) {
            $this.parent().find('.fami-lazy:not(.already-fix-lazy)').lazy({
                bind: 'event',
                delay: 0
            }).addClass('already-fix-lazy');
        }
        e.preventDefault();
    });
    
    $(document).on('click', '.box-mobile-menu .back-menu', function (e) {
        var $this = $(this);
        var thisMenuWrap = $this.closest('.box-mobile-menu');
        var thisMenu = thisMenuWrap.find('.clone-main-menu');
        thisMenu.find('li.mobile-active').each(function () {
            thisMenu.find('li').removeClass('mobile-active');
            if ($(this).parent().hasClass('main-menu')) {
                thisMenu.addClass('active');
                $('.box-mobile-menu .box-title').html('MAIN MENU');
                $('.box-mobile-menu .back-menu, .box-mobile-menu .box-title').css('display', 'none');
            } else {
                thisMenu.removeClass('active');
                $(this).parent().parent().addClass('mobile-active');
                $(this).parent().css({
                    'position': 'absolute',
                    'height': 'auto'
                });
                var text_prev = $(this).parent().parent().children('a').text();
                $('.box-mobile-menu .box-title').html(text_prev);
            }
            e.preventDefault();
        })
    });
    /* Mobile Tabs on real mobile */
    $(document).on('click', '.box-tabs .box-tab-nav', function (e) {
        var $this = $(this);
        var thisTab = $this.closest('.box-tabs');
        var tab_id = $this.attr('href');
        
        if ($this.is('.active')) {
            return false;
        }
        
        thisTab.find('.box-tab-nav').removeClass('active');
        $this.addClass('active');
        
        thisTab.find('.box-tab-content').removeClass('active');
        thisTab.find(tab_id).addClass('active');
        
        e.preventDefault();
    });
    
    // Wish list on real menu mobile
    if ($('.box-mobile-menu .wish-list-mobile-menu-link-wrap').length) {
        if (!$('.box-mobile-menu').is('.moved-wish-list')) {
            var wish_list_html = $('.box-mobile-menu .wish-list-mobile-menu-link-wrap').html();
            $('.box-mobile-menu .wish-list-mobile-menu-link-wrap').remove();
            $('.box-mobile-menu .main-menu').append('<li class="menu-item-for-wish-list menu-item menu-item-type-custom menu-item-object-custom">' + wish_list_html + '</li>');
            $('.box-mobile-menu').addClass('moved-wish-list');
        }
    }
    
    //Account mobile
    $(document).on('click', '.next-action', function (e) {
        $('.myaccount-action').show().addClass('element-acc-show');
        $(this).parent().hide().removeClass('element-acc-show');
        e.preventDefault();
    });
    //Single tabs desc
    $(document).on("click", '.button-togole', function (e) {
        var $this = $(this);
        $this.parent().addClass('tab-show');
        $('html').addClass('body-hide');
        e.preventDefault();
    });
    $(document).on("click", '.close-tab', function (e) {
        var $this = $(this);
        $('.tabs-mobile-content').removeClass('tab-show');
        $('html').removeClass('body-hide');
        e.preventDefault();
    });
    //Share product
    $(document).on("click", '.button-share', function (e) {
        var $this = $(this);
        $this.parent().addClass('element-share-show');
        e.preventDefault();
    });
    $(document).on('click', '.share-overlay', function (e) {
        $('.social-share-product').removeClass('element-share-show');
    });
    
    // Live chat open
    $(document).on('click', '.live-chat', function (e) {
        if ($('jdiv').length) {
            jivo_api.open();
        }
        e.preventDefault();
        return false;
    });
    
    // Fix prdctfltr_down
    $('.prdctfltr_regular_title').each(function () {
        var this_text = $(this).text();
        $(this).attr('data-org_title', this_text);
    });
    $(document).on('click', '.prdctfltr_down .prdctfltr_checkboxes > label', function () {
        var selected_text = $(this).text();
        if ($(this).find('input[type="checkbox"]').length) {
            selected_text = $(this).find('input[type="checkbox"]').val();
        }
        if ($(this).find('.prdctfltr_customize_name').length) {
            selected_text = $(this).find('.prdctfltr_customize_name').text();
        }
        
        if (selected_text == '') {
            selected_text = $(this).closest('.prdctfltr_filter').find('.prdctfltr_regular_title').attr('data-org_title');
        }
        
        if (selected_text != '') {
            $(this).closest('.prdctfltr_filter').find('.prdctfltr_regular_title').html(selected_text + '<i class="prdctfltr-up"></i>');
        }
        
    });
    
    // Wow
    new WOW().init();
    
    // Load all needed functions when document ready
    famiau_resizefFiltermenu();
    azirspares_banner_adv();
    azirspares_fix_vc_full_width_row();
    azirspares_sticky_single();
    azirspares_clone_append_category();
    azirspares_accodion_single_shop();
    if ($('.vertical-menu').length > 0) {
        azirspares_auto_width_vertical_menu();
    }
    
    if ($('.lazy').length > 0) {
        azirspares_init_lazy_load($('.lazy'));
    }
    
    // Window load
    $(window).load(function () {
        if ($('.wpb_widgetised_column .widget_product_categories').length) {
            azirspares_equal_categories($('.wpb_widgetised_column .widget_product_categories'));
        }
        
        if ($('.famiau-map-filters-form .famiau-fields-wrap').length && $.fn.scrollbar) {
            $('.famiau-map-filters-form .famiau-fields-wrap').scrollbar();
        }
        if ($('.famiau-mega-filter-inner').length) {
            famiau_accodion_filter($('.famiau-mega-filter-inner'));
        }
        if ($('.azirspares-countdown').length) {
            azirspares_countdown($('.azirspares-countdown'));
        }
        if ($('.owl-slick').length) {
            $('.owl-slick').each(function () {
                if (!$(this).is('.cat_list_mobile')) {
                    azirspares_init_carousel($(this));
                }
            });
        }
        
        if ($('.product-gallery').length) {
            azirspares_product_gallery($('.product-gallery'));
        }
        
        if ($('.owl-slick .product-item').length) {
            azirspares_hover_product_item($('.azirspares-products.style-02 .owl-slick .row-item,' +
                '.azirspares-products.style-04 .owl-slick .row-item,' +
                '.azirspares-products.style-05 .owl-slick .row-item,' +
                '.owl-slick .product-item.style-02' +
                '.owl-slick .product-item.style-04' +
                '.owl-slick .product-item.style-05'));
        }
        
        if ($('.owl-slick .product-item.style-03').length) {
            azirspares_hover_product_item_both($('.azirspares-products.style-03 .owl-slick .row-item,' +
                '.owl-slick .product-item.style-03'));
        }
        
        if ($('.block-nav-category').length) {
            azirspares_vertical_menu($('.block-nav-category'));
        }
        if ($('.azirspares-custommenu.style1').length) {
            azirspares_vertical_menu($('.azirspares-custommenu.style1'));
        }
        if ($('.widget_azirspares_nav_menu').length) {
            azirspares_vertical_menu($('.widget_azirspares_nav_menu'));
        }
        if ($('.burger-mid-menu').length) {
            azirspares_vertical_menu($('.burger-mid-menu'));
        }
        if ($('.flex-control-thumbs').length) {
            azirspares_product_thumb($('.flex-control-thumbs'));
        }
        if ($('.category-search-option').length) {
            $('.category-search-option').chosen();
        }
        if ($('.category .chosen-results').length && $.fn.scrollbar) {
            $('.category .chosen-results').scrollbar();
        }
        if ($('.burger-wrap .burger-inner').length && $.fn.scrollbar) {
            $('.burger-wrap .burger-inner').scrollbar();
        }
        if ($('.block-minicart .cart_list').length && $.fn.scrollbar) {
            $('.block-minicart .cart_list').scrollbar();
        }
        if ($('.widget_product_categories .product-categories').length) {
            azirspares_category_product($('.widget_product_categories .product-categories'));
        }
        if ($('.azirspares-google-maps').length) {
            azirspares_google_map($('.azirspares-google-maps'));
        }
        if ($('.header-sticky .header-wrap-stick').length) {
            azirspares_sticky_menu($('.header-sticky .header-wrap-stick'));
        }
        if ($('.equal-container.better-height').length) {
            azirspares_better_equal_elems($('.equal-container.better-height'));
        }
        if ($('.seller-items').length) {
            azirspares_better_equal_elems($('.seller-items'));
        }
        if ($('.wpb_widgetised_column .widget_product_categories').length) {
            azirspares_equal_categories($('.wpb_widgetised_column .widget_product_categories'));
        }
        
        azirspares_popover_button();
        azirspares_popup_newsletter();
        azirspares_magnific_popup();
        
    });
    
    // Window resize
    $(window).resize(function () {
        famiau_resizefFiltermenu();
        if ($('.famiau-mega-filter-inner').length) {
            famiau_accodion_filter($('.famiau-mega-filter-inner'));
        }
        if ($('.vertical-menu').length > 0) {
            azirspares_auto_width_vertical_menu();
        }
        if ($('.equal-container.better-height').length) {
            azirspares_better_equal_elems($('.equal-container.better-height'));
        }
    });
    
    // AJAX completed
    $(document).ajaxComplete(function (event, xhr, settings) {
        if ($('.lazy').length > 0) {
            azirspares_init_lazy_load($('.lazy'));
        }
        
        if ($('.equal-container.better-height').length) {
            azirspares_better_equal_elems($('.equal-container.better-height'));
        }
        
        azirspares_popover_button();
        if ($('.block-minicart .cart_list').length > 0 && $.fn.scrollbar) {
            $('.block-minicart .cart_list').scrollbar();
        }
    });
    
});
