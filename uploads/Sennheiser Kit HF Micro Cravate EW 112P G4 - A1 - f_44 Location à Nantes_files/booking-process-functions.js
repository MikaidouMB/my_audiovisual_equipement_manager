/**
 * JS Helper functions for Booking Template
 * @namespace bkap_functions
 * @since 4.1.0
 */

var bkap_functions = function ( $ ) {

    return {

        /**
         * This function returns string for the booking place for attributes.
         *
         * @function attr_bookings_placed
         * @memberof bkap_functions
         * @since 4.10.0
         */

        attr_bookings_placed: function( settings ){
            var attr_bookings_placed = "";
            
            if ( settings.wapbk_attribute_list != undefined ) {
                
                var attribute_list = settings.wapbk_attribute_list.split(",");

                for ( i = 0; i < attribute_list.length; i++ ) {

                    if ( attribute_list[i] != "" && jQuery( "#" + attribute_list[i] ).val() > 0 ) {

                        var field_name = "#wapbk_bookings_placed_" + attribute_list[i];
                        
                        if ( jQuery( field_name ).length > 0 ) {
                            attr_bookings_placed = attr_bookings_placed + attribute_list[i] + "," + jQuery( field_name ).val() + ";";
                        }
                    }
                }
            }
            return attr_bookings_placed;
        },

        /**
         * This function returns the selected quantity
         *
         * @function bkap_get_qty
         * @memberof bkap_functions
         * @since 4.10.0
         */

        bkap_get_qty: function(){

            var quantity = jQuery( "input[class='input-text qty text']" ).prop( "value" );
            var bkap_edit_params   = window['bkap_edit_params'];
            if( bkap_edit_params != undefined && bkap_edit_params != '' && bkap_edit_params.bkap_page_type == 'checkout' ) {
                quantity = bkap_edit_params.bkap_cart_item.quantity;
            }
            if ( typeof quantity == "undefined" ) {
                quantity = 1;
            }
            return quantity;
        },

        /**
         * This function show the Add to cart button and Quantity field
         *
         * @function bkap_show_qty_and_cart
         * @memberof bkap_functions
         * @since 4.10.0
         */

        bkap_show_qty_and_cart: function(){
            jQuery( ".single_add_to_cart_button" ).show();
            jQuery( '.quantity input[name="quantity"]' ).show();
        },

        /**
         * This function hide the Add to cart button and Quantity field
         *
         * @function bkap_hide_qty_and_cart
         * @memberof bkap_functions
         * @since 4.10.0
         */

        bkap_hide_qty_and_cart: function(){
            jQuery( ".single_add_to_cart_button" ).hide();
            jQuery( '.quantity input[name="quantity"]' ).hide();
        },

        /**
         * This function disables the Add to cart button and Quantity field
         *
         * @function bkap_disable_qty_and_cart
         * @memberof bkap_functions
         * @since 4.10.0
         */

        bkap_disable_qty_and_cart: function(){
            // disable the add to cart and qty buttons
            jQuery( ".single_add_to_cart_button" ).prop( "disabled", true );
            jQuery( '.quantity input[name="quantity"]' ).prop( "disabled", true );
            jQuery( ".plus").prop( "disabled", true );
            jQuery( ".minus").prop( "disabled", true );

            jQuery( ".bkap_create_booking").attr( "disabled", "disabled" );
        },

        /**
         * This function enables the Add to cart button and Quantity field
         *
         * @function bkap_enable_qty_and_cart
         * @memberof bkap_functions
         * @since 4.10.0
         */

        bkap_enable_qty_and_cart: function(){
            // disable the add to cart and qty buttons
            jQuery( ".single_add_to_cart_button" ).prop( "disabled", false );
            jQuery( '.quantity input[name="quantity"]' ).prop( "disabled", false );
            jQuery( ".plus").prop( "disabled", false );
            jQuery( ".minus").prop( "disabled", false );
            jQuery( ".bkap_create_booking").removeAttr( "disabled" );;
        },

        /**
         * This function hides the loader
         *
         * @function bkap_hide_loader
         * @memberof bkap_functions
         * @since 4.13.0
         */

        bkap_hide_loader: function( modal_id ){
            jQuery( modal_id + ".ajax_img" ).hide();
        },

        /**
         * This function returns additional data of product
         *
         * @function settings
         * @memberof bkap_functions
         * @since 4.10.0
         */

        settings: function() {
            return JSON.parse( bkap_process_params.additional_data );
        },

        /**
         * This function returns booking settings of product
         *
         * @function bkap_labels
         * @memberof bkap_functions
         * @since 4.10.0
         */

        bkap_settings: function() {
            return JSON.parse( bkap_process_params.bkap_settings );
        },

        /**
         * This function returns labels
         *
         * @function bkap_labels
         * @memberof bkap_functions
         * @since 4.10.0
         */

        bkap_labels: function() {
            return JSON.parse( bkap_process_params.labels );
        },

        /**
         * This function returns global booking settings
         *
         * @function global_settings
         * @memberof bkap_functions
         * @since 4.10.0
         */

        global_settings: function() {
            return JSON.parse( bkap_process_params.global_settings );
        },

        /**
         * This function updates the GF prices
         *
         * @function update_GF_prices
         * @memberof bkap_functions
         * @since 4.1.0
         */
        update_GF_prices: function() {

            var options                 = parseFloat( $( ".ginput_container_total" ).find( ".gform_hidden" ).val() ),
                booking_price_charged   = $( "#bkap_price_charged" ).val(),
                booking_price           = 0,
                pricing_obj             = bkap_functions.update_option_prices( 'gf', options );

            $( "#bkap_gf_options_total" ).val( pricing_obj.cart_options_total );

            if ( parseFloat( pricing_obj.total_booking_price ) > parseFloat( booking_price_charged ) ) {
                booking_price = $( "#total_price_calculated" ).val();
            } else {
                booking_price = $( "#bkap_price_charged" ).val() - pricing_obj.options_total; // the subtotal should not include the gf options 
            }

            if ( typeof(wc_gravityforms_params) !== 'undefined' ) {
                if ( $( ".formattedBasePrice" ).length > 0 ) {
                    $( ".formattedBasePrice" ).html( bkap_functions.bkap_format_money( wc_gravityforms_params, parseFloat( booking_price ) ) );
                }

                if ( $( ".formattedVariationTotal" ).length > 0 ) {
                    $( ".formattedVariationTotal" ).html( bkap_functions.bkap_format_money( wc_gravityforms_params, parseFloat( pricing_obj.options_total ) ) );
                }

                if ( $( ".formattedTotalPrice" ).length > 0 ) {
                    var formatted_total = parseFloat( booking_price ) + parseFloat( pricing_obj.options_total );
                    $( ".formattedTotalPrice" ).html( bkap_functions.bkap_format_money( wc_gravityforms_params, formatted_total ) );
                }
            }
        },

        /**
         * This function perform the price calculation for multiple days when options of wpa is changed
         *
         * @function doc_ready_other_plugin_actions
         * @memberof bkap_functions
         * @since 4.15.0
         */

        doc_ready_other_plugin_actions: function() {

            var global_settings = bkap_functions.global_settings(),
				bkap_settings 	= bkap_functions.bkap_settings(),
                settings 		= bkap_functions.settings(),
                bkap_labels 	= bkap_functions.bkap_labels();;
            
            /**
             * WooCommerce Product Addon Compatibility - Calculating price on chagne of option change events.
             * It will be called only for the multiple nights booking
             */
            if ( jQuery( "#product-addons-total" ).length > 0 ) {
                var $cart = jQuery( ".cart" );
                $cart
                .on( 'keyup change', '.wc-pao-addon input, .wc-pao-addon textarea', function() {
                    bkap_functions.bkap_call_price_calculation();
                } )
                .on( 'change', '.wc-pao-addon input, .wc-pao-addon textarea, .wc-pao-addon select', function() {
                    bkap_functions.bkap_call_price_calculation();
                } )                
                .on( 'click', '.wc-pao-addon-image-swatch', function( e ) {
                    bkap_functions.bkap_call_price_calculation();
                });
            }
        },

        /**
         * This function displays the html for WPA when multiple nights is enable for product.
         *
         * @function bkap_call_price_calculation
         * @memberof bkap_functions
         * @since 4.20.0
         */
        bkap_call_price_calculation: function() {
            if ( jQuery( MODAL_ID + "#wapbk_hidden_date" ).val() != "" && jQuery( MODAL_ID + "#wapbk_hidden_date_checkout" ).val() != "" ){
                bkap_calculate_price(); 
            } else if ( jQuery( MODAL_ID + "#wapbk_hidden_date" ).val() != "" ) {
                bkap_single_day_price();
            }
        },

        /**
         * This function displays the html for WPA when multiple nights is enable for product.
         *
         * @function update_wpa_multiple_prices
         * @memberof bkap_functions
         * @since 4.15.0
         */

        update_wpa_multiple_prices: function( bkap_settings, global_settings, settings, bkap_labels ) {
            
            var html      = '';
            var diff_days = $( "#wapbk_diff_days" ).val();
            var quantity  = parseInt( $( "input[class=\"input-text qty text\"]" ).prop( "value" ) );

            if ( settings.sold_individually == 'yes' ) {
                quantity = 1;
            }

            if ( diff_days == "" ) {
                diff_days = 1;
            }

            var price_per_qty = jQuery( "#bkap_price_charged" ).val() / quantity ;
            jQuery( "#product-addons-total" ).data( "price", price_per_qty ); 
            
            var formatted_sub_total = 0;
            var $totals             = $('body').find( '#product-addons-total' );

            if ( bkap_settings.booking_partial_payment_radio != undefined && bkap_settings.booking_partial_payment_radio == "security_deposit" ){
                total_booking_price = parseFloat( $( "#bkap_price_charged" ).val() ); 
            } else {
                total_booking_price = parseFloat( $( "#total_price_calculated" ).val() );
            }

            if ( typeof( woocommerce_addons_params ) !== 'undefined' ) {

                var addons              = $totals.data('price_data');
                var options             = addons;
                var sub_total_string    = typeof( $totals.data( 'i18n_sub_total' ) ) === 'undefined' ? woocommerce_addons_params.i18n_sub_total : $totals.data( 'i18n_sub_total' );
                formatted_sub_total     = total_booking_price;
                
                for ( c_key in options ) {
                    
                    if ( global_settings.woo_product_addon_price == "on" ){
                        options[c_key].cost = options[c_key].cost * diff_days;
                    }
                    formatted_sub_total = formatted_sub_total + options[c_key].cost;
                };

                if ( settings.partial_deposit_addon && bkap_settings.booking_partial_payment_enable && bkap_settings.booking_partial_payment_enable === 'yes' && $("input[name='payment_type']:checked").val() != 'full_payment' ) {
                
                    if ( bkap_settings.booking_partial_payment_radio == 'percent' ) {
                        deposit_price = parseFloat(formatted_sub_total ) * ( parseFloat( bkap_settings.booking_partial_payment_value_deposit ) / 100 );
                    } else {
                        deposit_price = parseFloat( $( "#bkap_price_charged" ).val() ) ;
                    }
                }

                formatted_sub_total = bkap_functions.bkap_format_money( woocommerce_addons_params, formatted_sub_total );
                var productName     = $( '.product_title' ).html(),
                productPrice        = bkap_functions.bkap_format_money( woocommerce_addons_params, total_booking_price );
            
                var html = '<div class="product-addon-totals"><ul><li><div class="wc-pao-col1"><strong>' + quantity + woocommerce_addons_params.quantity_symbol + productName + '</strong></div><div class="wc-pao-col2"><strong>' + productPrice + '</strong></div></li>';

                if ( typeof (options) != 'undefined' && options.length ) {
                    $.each( options, function( i, addon ) {
                        if ( 'quantity_based' === addon.price_type ) {
                            //var cost = wcPaoInitAddonTotals.getCostByTax( addon.cost_raw, addon.cost );
                            var formattedValue = 0 === addon.cost ? '-' : bkap_functions.bkap_format_money( woocommerce_addons_params, addon.cost );
                            html = html + '<li class="wc-pao-row-quantity-based"><div class="wc-pao-col1">' + addon.name + '</div><div class="wc-pao-col2"><span class="amount">' + formattedValue + '</span></div></li>';
                        }
                    } );
                    $.each( options, function( i, addon ) {
                        if ( 'quantity_based' !== addon.price_type ) {
                            
                            var cost = addon.cost;

                            var formattedValue = 0 === cost ? '-' : ( '<span class="amount">'+ bkap_functions.bkap_format_money( woocommerce_addons_params, addon.cost ) + '</span>' );
                            html = html + '<li><div class="wc-pao-col1"><strong>' + addon.name + '</strong></div><div class="wc-pao-col2">' + formattedValue + '</div></li>';
                        }
                    } );
                }
                
                html = html + '<li class="wc-pao-subtotal-line"><p class="price">' + sub_total_string + ' <span class="amount">' + formatted_sub_total + '</span></p></li>';      
                
                if ( settings.partial_deposit_addon && bkap_settings.booking_partial_payment_enable && bkap_settings.booking_partial_payment_enable === 'yes' && $("input[name='payment_type']:checked").val() != 'full_payment' ){
                    html = html + '<li class="wc-pao-subtotal-line"><p class="price">' + bkap_labels.bkap_deposit_amt_label +' <span class="amount">' + bkap_functions.bkap_format_money( woocommerce_addons_params, deposit_price ) + '</span></p></li></ul></div>'; 
                }
                
                $totals.html( html );
            }
            
            if ( $totals.data('addons-price') ){
                $( 'body' ).trigger( 'bkap_update_addon_prices', [ bkap_process_params.bkap_cart_item_key, $totals.data('addons-price') ] );
            }
        },

        /**
         * Updates WooCommerce Product Addon Prices
         *
         * @function update_wpa_prices
         * @memberof bkap_functions
         * @since 4.2
         */
        update_wpa_prices: function() {

            var options                 = '',
                booking_price_charged   = $( "#bkap_price_charged" ).val(),
                booking_price           = 0,
                pricing_obj             = {},
                $totals                 = $('body').find( '#product-addons-total' ),
                html                    = '',
                formatted_options       = '',
                formatted_total         = '',
                subtotal                = '';

            var bkap_settings           = JSON.parse( bkap_process_params.bkap_settings ),

            options                     = $totals.data('addons-price');
            pricing_obj                 = bkap_functions.update_option_prices( 'wpa', options );

            if( bkap_settings.booking_partial_payment_radio != undefined && bkap_settings.booking_partial_payment_radio == "security_deposit" ){
                hidden_field_price = $( "#bkap_price_charged" ).val();
            }else{
                hidden_field_price = $( "#total_price_calculated" ).val();
            }

            booking_price = pricing_obj.options_total + parseFloat(hidden_field_price);
            
            if ( typeof( woocommerce_addons_params ) !== 'undefined' ) {

                formatted_options   = bkap_functions.bkap_format_money( woocommerce_addons_params, pricing_obj.options_total );
                formatted_total     = bkap_functions.bkap_format_money( woocommerce_addons_params, booking_price );

                if ( woocommerce_addons_params.i18n_grand_total ) {
                    subtotal = woocommerce_addons_params.i18n_grand_total;
                }else if ( woocommerce_addons_params.i18n_sub_total ) {
                    subtotal = woocommerce_addons_params.i18n_sub_total;
                }

                html = '<dl class="product-addon-totals"><dt>' + woocommerce_addons_params.i18n_addon_total + '</dt><dd><strong><span class="amount">' + formatted_options + '</span></strong></dd>';
                html = html + '<dt>' + subtotal + '</dt><dd><strong><span class="amount">' + formatted_total + '</span></strong></dd></dl>';
                $totals.html( html );
            }
        },

        /**
         * Updates WooCommerce Product Addon Prices
         *
         * @function update_option_prices
         * @memberof bkap_functions
         * @param {string} addon_type - Addon type
         * @param {string} options - Options total price
         * @returns {object} Calculated totals
         * @since 4.2
         */
        update_option_prices: function( addon_type, options ) {

            var global_settings         = JSON.parse( bkap_process_params.global_settings ),
                total_booking_price     = parseFloat( $( "#total_price_calculated ").val() ),
                diff_days               = $( "#wapbk_diff_days" ).val(),
                quantity                = $( "input[class=\"input-text qty text\"]" ).prop( "value" ),
                options_total           = 0,
                cart_options_total      = 0,
                bkap_setting            = '';

            if ( options > 0 ) {
                options_total = options;
            }

            if ( addon_type === 'gf' ) {
                bkap_setting = global_settings.woo_gf_product_addon_option_price;
            }else if ( addon_type === 'wpa' ){
                bkap_setting = global_settings.woo_product_addon_price;
            }

            if ( diff_days > 1 && bkap_setting === "on" && options_total > 0 ) {
                options_total = options * diff_days;
                cart_options_total = options_total;
            } else {
                cart_options_total = options;
            }

            if ( typeof quantity == "undefined" ) {
                quantity = 1;
            }
            
            // if cart_options_total is greater than 0, multiply with the qty
            if ( cart_options_total > 0 ) {
                cart_options_total = cart_options_total * quantity;
            }
            
            // if options_total is greater than 0, multiply with the qty
            if ( options_total > 0 ) {
                options_total = options_total * quantity;
            }

            total_booking_price = total_booking_price + options_total;

            /**
             * Indicates that the pop-up is visible now
             * 
             * @event bkap_update_addon_prices
             * @param {string} bkap_cart_item_key - Cart Item Key
             * @param {string} options_total - Addon Options Totals
             * @since 4.2.0
             */
            $( 'body' ).trigger( 'bkap_update_addon_prices', [ bkap_process_params.bkap_cart_item_key, options_total ] );

            return {
                'cart_options_total': cart_options_total,
                'options_total': options_total,
                'total_booking_price': total_booking_price
            };
        },

        /**
         * Format money as per currency selected
         *
         * @function bkap_format_money
         * @memberof bkap_functions
         * @param {object} param_name - Addon Param Name
         * @param {string|float} price - Price to be formatted
         * @returns {float} Formatted Currency
         * @since 4.2
         */ 
        bkap_format_money: function( param_name, price ) {

            return accounting.formatMoney( parseFloat( price ), {
                symbol      : param_name['currency_format_symbol'],
                decimal     : param_name['currency_format_decimal_sep'],
                thousand    : param_name['currency_format_thousand_sep'],
                precision   : param_name['currency_format_num_decimals'],
                format      : param_name['currency_format']
            });
        },

        /**
         * Get selected products for composite products
         *
         * @function bkap_get_composite_selections
         * @memberof bkap_functions
         * @returns {object} Component Selected Data
         * @since 4.7.0
         */ 
        bkap_get_composite_selections: function() {

            var components        = '',
                component_id      = '',
                component_data    = {},
                selected_product  = '',
                selected_quantity = '';

            components = $('.component');
            for( var sub_comp in components ){
                if ( 'object' === typeof( components[sub_comp] ) && $( components[sub_comp] ).data('item_id') ) {
                    component_id = $( components[sub_comp] ).data('item_id');
                    selected_product = $('select[name="wccp_component_selection[' + component_id + ']"]').val();

                    if ( $('input[name="wccp_component_quantity[' + component_id + ']"]').val() ) {
                        selected_quantity = $('input[name="wccp_component_quantity[' + component_id + ']"]').val();
                    }

                    component_data[component_id] = {};
                    component_data[component_id]['p_id'] = selected_product;
                    component_data[component_id]['qty'] = selected_quantity;

                    if ( $( 'input[name="wccp_variation_id['+ component_id +']"]' ) &&
                         $( 'input[name="wccp_variation_id['+ component_id +']"]' ).val() !== '' ) {
                        component_data[component_id]['v_id'] = $( 'input[name="wccp_variation_id['+ component_id +']"]' ).val();
                    }
                }
            }

            return component_data;
        },

        /**
         * Set Checkout date for inline calendar
         *
         * @function test_bkap_init_inline
         * @memberof bkap_functions
         * @since 4.1.0
         */
        test_bkap_init_inline: function() {
            // extra code Pinal
            var checkin_date  = $( "#wapbk_hidden_date" ).val(),
                days          = $( "#block_option_number_of_day" ).val();

                var checkin_date_obj = bkap_functions.bkap_create_date_obj( checkin_date );
                var checkout_date    = bkap_functions.bkap_add_days_to_date( checkin_date_obj, days );

                $( "#inline_calendar_checkout" ).datepicker( "option", "minDate", checkout_date );
                $( "#inline_calendar_checkout" ).datepicker( "setDate", checkout_date );
                
                date = bkap_functions.bkap_create_date( checkout_date );
                jQuery("#wapbk_hidden_date_checkout").val( date );

                bkap_calculate_price();
        },
        
        /**
         * Create date in j-n-y format
         *
         * @param {string} date - Date
         *
         * @returns {string} date string
         *
         * @function bkap_create_date
         * @memberof bkap_functions
         *
         * @since 4.1.0
         */
        bkap_create_date: function( date ) {
        	var m = date.getMonth(), d = date.getDate(), y = date.getFullYear();
        	today = d + "-" + (m+1) + "-" + y;
        	
        	return today;
        },

        /**
         * Create date in y-m-d format
         *
         * @param {string} date - Date
         *
         * @returns {string} date string
         *
         * @function bkap_create_date_ymd
         * @memberof bkap_functions
         *
         * @since 4.1.0
         */

        bkap_create_date_ymd: function( date ){
            var m = date.getMonth(), d = date.getDate(), y = date.getFullYear();

            var bkap_month = m < 10 ? "0" + (m+1) : (m+1);

            return [y, bkap_month, d].join('-');
        },

        /**
         * Create current date in  format
         *
         * @returns {string} date string
         *
         * @function bkap_today_date
         * @memberof bkap_functions
         *
         * @since 4.1.0
         */

        bkap_today_date: function(){
            
            var dt    = new Date();
            var today = dt.getDate() + "-" + dt.getMonth() + "-" + dt.getFullYear();

            return today;
        },

        /**
         * Create date object 
         *
         * @param {string} date - Date - j-n-y format
         *
         * @returns {string} date string
         *
         * @function bkap_create_date_obj
         * @memberof bkap_functions
         *
         * @since 4.8.0
         */

        bkap_create_date_obj: function( date ) {

            var min_date = date.split( "-" );

            var date = new Date( min_date[2], min_date[1]-1, min_date[0] );
                        
            return date;
        },

        /**
         * Add days to given date
         *
         * @param {string} date - Date
         * @param {string} days - number
         *
         * @returns {string} date string
         *
         * @function bkap_add_days_to_date
         * @memberof bkap_functions
         *
         * @since 4.8.0
         */

        bkap_add_days_to_date: function( date, days ) {

            var result = new Date( date );
            result.setDate( result.getDate() + parseInt(days) );
            return result;
        },

        /**
         * Create date in j-n-y format
         *
         * @function bkap_init
         * @memberof bkap_functions
         *
         * @since 4.1.0
         */
        bkap_init: function() {

            var min_date = jQuery( "#wapbk_minimum_seach_date" ).val().split( "-" );

            var checkout_date = new Date( min_date[2], min_date[1], min_date[0] );
            jQuery( "#booking_calender_checkout" ).datepicker( "option", "minDate", checkout_date );
        },

        /**
         * Hide WooCommerce Notice
         *
         * @function bkap_hide_wc_notice
         * @memberof bkap_functions
         *
         * @since 4.14.0
         */
        bkap_hide_wc_notice: function() {

            if ( jQuery( ".woocommerce-error" ).length > 0 ) {
                setTimeout( function() {
                    jQuery( ".woocommerce-error" ).remove();
                }, 5000 );
            }
        },

        /**
         * Calculate diff days based on the UTC dates
         *
         * @function bkap_date_utc
         * @memberof bkap_functions
         *
         * @since 4.14.0
         */
        bkap_date_utc: function( firstDate, secondDate ) {

            var oneDay              = 86400000; // hours*minutes*seconds*milliseconds 86400000
            var firstDate_test      = Date.UTC( firstDate.getFullYear(), firstDate.getMonth() , firstDate.getDate() );
            var secondDate_test     = Date.UTC( secondDate.getFullYear(), secondDate.getMonth() , secondDate.getDate() );
            var diffDays            = Math.abs( ( firstDate_test.valueOf() - secondDate_test.valueOf() ) / ( oneDay ) );  // This is the fix for the timezone issue(Berlin).

            return diffDays;
        
        },

        /**
         * Set Checkout date for Fixed Blocks configuration and calculate prices
         *
         * @function test_bkap_init
         * @memberof bkap_functions
         * @since 4.1.0
         */
        test_bkap_init: function() { 
            
            var checkin_date = jQuery( "#booking_calender" ).val();
            var days = jQuery( "#block_option_number_of_day" ).val();

            var checkin_date_obj = bkap_functions.bkap_create_date_obj( checkin_date );
            var checkout_date    = bkap_functions.bkap_add_days_to_date( checkin_date_obj, days );
            
            date = bkap_functions.bkap_create_date( checkout_date );
            jQuery( "#wapbk_hidden_date_checkout" ).val( date );
            jQuery( "#booking_calender_checkout" ).datepicker( "setDate", checkout_date );
            bkap_calculate_price();
        },

        /**
         * Set Checkout date for inline calendar
         *
         * @function bkap_init_inline_multiple
         * @memberof bkap_functions
         * @param {object} global_settings - Global Settings
         * @param {object} bkap_settings - Product Level Settings
         * @param {object} settings - Additional Data
         * @since 4.1.0
         */
        bkap_init_inline_multiple: function( global_settings, bkap_settings, settings ) {

            // This fix is when the next day is holiday and same day booking is enable. 
            if( settings.wapbk_same_day === "on") { 
                var checkin_date = jQuery("#inline_calendar").datepicker( "getDate" );
                var date = checkin_date.getDate();
                var month = checkin_date.getMonth() + 1;
                var year = checkin_date.getFullYear();

                var date_selected = date + "-" + month + "-" + year;
                jQuery("#wapbk_hidden_date_checkout").val( date_selected );     
            }else{
                var date_selected_checkout = '',
                    checkout_date = '',
                    date = '',
                    month = '',
                    year = '';

                if ( jQuery("#wapbk_hidden_date_checkout").val() ) {
                    date_selected_checkout = jQuery("#wapbk_hidden_date_checkout").val();
                }else {
                    checkout_date = jQuery("#inline_calendar_checkout").datepicker( "getDate" );
                    date = checkout_date.getDate();
                    month = checkout_date.getMonth() + 1;
                    year = checkout_date.getFullYear();

                    date_selected_checkout = date + "-" + month + "-" + year;
                    jQuery("#wapbk_hidden_date_checkout").val( date_selected_checkout );
                }
            }
            if ( date_selected != "" && date_selected_checkout != "" ){
                bkap_calculate_price();
            }
        },

        /**
         * This checks the mindate day based on the recurring days setting for product. 
         * .
         *
         * @function bkap_checkout_mindate_day_check
         * @memberof bkap_functions
         * @param {date} minDate - Date
         * @param {Object} bkap_settings - Booking settings of the product
         * @returns {date} Returns date based on the recurring weekdays
         * @since 4.13.0
         */

        bkap_checkout_mindate_day_check: function( minDate, bkap_settings ){

            var specificDates   = bkap_settings.booking_specific_date;
            var weekdays        = bkap_settings.booking_recurring;
            var mindatecheck    = true;
            var a               = 1;
            
            do {
                day         = 'booking_weekday_' + minDate.getDay();
                day_check   = weekdays[ day ];
                if ( day_check == "on" || a > 7 ){
                    mindatecheck = false;
                } else {

                    datejny = bkap_functions.bkap_create_date( minDate );

                    if ( datejny in specificDates ){
                        mindatecheck = false;
                    } else {
                        minDate.setDate( minDate.getDate() + 1 );    
                    }
                }
                a++;
            } while ( mindatecheck );

            return minDate;
        },

        bkap_check_disable_day_between_checkin_checkout: function( calculate, date, cdate, bkap_settings ){

            var specificDates   = bkap_settings.booking_specific_date;
            var weekdays        = bkap_settings.booking_recurring;
            let checkin_Date    = date;
            let checkout_Date   = cdate;

            var count           = bkap_gd( checkin_Date, checkout_Date, "days" );

            for ( var i = 1; i <= count; i++ ) {

                day         = 'booking_weekday_' + checkin_Date.getDay();
                day_check   = weekdays[ day ];
                datejny     = bkap_functions.bkap_create_date( checkin_Date );
                if ( day_check == "" ){
                    if ( datejny in specificDates ) {
                    } else {
                        calculate = false;
                        break;
                    }
                }

                checkin_Date = new Date( bkap_ad( checkin_Date, 1 ) );
            }

            return calculate;
        },

		/**
		 * This function disables the dates in the calendar for holidays, 
		 * global holidays set and for which lockout is reached for Multiple day booking feature.
		 *
		 * @function bkap_check_booked_dates
		 * @memberof bkap_functions
		 * @param {date} date - Date to be checked
		 * @returns {bool} Returns true or false based on date available or not
		 * @since 4.1.0
		 */
		bkap_check_booked_dates: function( date ) {
			
            var settings 			= JSON.parse( bkap_process_params.additional_data );
            var global_settings 	= JSON.parse( bkap_process_params.global_settings );
			var bkap_settings 		= JSON.parse( bkap_process_params.bkap_settings );
			var labels 				= JSON.parse( bkap_process_params.labels );

			var m = date.getMonth(),
                d = date.getDate(),
                y = date.getFullYear();
            var holidayDates        = "";
            var bookedDates         = "";
            var bookedDatesCheckout = "";

			var holidayDates 		        = JSON.parse( "[" + settings.holidays + "]" );
            var bookedDates 				= JSON.parse( "[" + settings.wapbk_hidden_booked_dates + "]" );
			var bookedDatesCheckout 		= JSON.parse( "[" + settings.wapbk_hidden_booked_dates_checkout + "]" );

            if ( bkap_settings.booking_charge_per_day != undefined && 
                bkap_settings.booking_charge_per_day == 'on' && 
                bkap_settings.booking_same_day != undefined && 
                bkap_settings.booking_same_day == 'on' ) {
                
                bookedDatesCheckout = bookedDates; // Disabling the same dates in checkout calendar as well.
            }

			var block_option_start_day		= jQuery( "#block_option_start_day" ).val();
			var block_option_price			= jQuery( "#block_option_price" ).val();

            var disabled_checkin_week_days  = "";
            if ( settings.wapbk_block_checkin_weekdays ){
                disabled_checkin_week_days  = JSON.parse( "[" + settings.wapbk_block_checkin_weekdays + "]" );
            }
            var disabled_checkout_week_days = "";			
            if ( settings.wapbk_block_checkout_weekdays ){
                disabled_checkout_week_days = JSON.parse( "[" + settings.wapbk_block_checkout_weekdays + "]" );
            }
			
			var maximum_numbers_of_days 	= parseInt( settings.number_of_dates );

			var id_booking = jQuery(this).attr("id");
			var bkap_rent = JSON.parse( "[" + settings.bkap_rent + "]" );


            var specificDates   = JSON.parse( "[" + settings.specific_dates + "]" );
            var datejny         = bkap_functions.bkap_create_date( date );

			if ( id_booking == "booking_calender" || id_booking == "inline_calendar" ) {

				for ( iii = 0; iii < bookedDates.length; iii++ ) {
					if( jQuery.inArray(d + "-" + (m+1) + "-" + y,bookedDates) != -1 ){
						if( bkap_rent.length > 0 ) { 
							return [false, "bkap-rent-date", labels.rent_label ];
						} else {
							return [false, "bkap-unavailable-date", labels.unavailable_label ];							
						}
					}
				}
				for ( jjj = 0; jjj < disabled_checkin_week_days.length; jjj++ ) {
					if( jQuery.inArray( date.getDay(), disabled_checkin_week_days) != -1 ) {

                        if (  specificDates.length > 0 ) {
                            if( jQuery.inArray( datejny, specificDates ) != -1 ){
                                return [ true ];
                            } else {
                                return [false, "bkap-blocked-date", labels.blocked_label ];
                            }
                        } else {
                            return [false, "bkap-blocked-date", labels.blocked_label ];    
                        }
					}
				}
				
				for ( ii = 0; ii < holidayDates.length; ii++ ) {
					if( jQuery.inArray(d + "-" + (m+1) + "-" + y,holidayDates) != -1 ) {
						return [false, "bkap-holiday-date",labels.holiday_label ];
					}
				}
			}
			
			if ( id_booking == "booking_calender_checkout" || id_booking == "inline_calendar_checkout" ) {

                if ( jQuery("#wapbk_hidden_date").val() != "" ) {
                    let same_day_check = true;
                    if ( settings.rental_system_addon ) {
                        if ( bkap_settings.booking_same_day == undefined || ( bkap_settings.booking_same_day != undefined && bkap_settings.booking_same_day == '' ) ) {
                            same_day_check = true;
                        } else {
                            same_day_check = false;
                        }
                    }

                    if ( same_day_check ) {
                        var split_c        = jQuery("#wapbk_hidden_date").val().split("-");
                        split_c[1]         = split_c[1] - 1;
                        var  CheckinDate   = new Date( split_c[2], split_c[1], split_c[0] );
                        let checkin__date  = bkap_functions.bkap_add_days_to_date( CheckinDate, 1 );
                        if ( checkin__date.getTime() === date.getTime() ) {
                            return [ true ];
                        }
                    }
                }
				
				for ( iii = 0; iii < bookedDatesCheckout.length; iii++ ) {
					if( jQuery.inArray(d + "-" + (m+1) + "-" + y,bookedDatesCheckout) != -1 ) {
						return [false, "bkap-unavailable-date", labels.unavailable_label ];
					}
				}

				for ( jjj = 0; jjj < disabled_checkout_week_days.length; jjj++ ) {
					if ( jQuery.inArray( date.getDay(), disabled_checkout_week_days) != -1 ) {
                        if (  specificDates.length > 0 ) {
                            if( jQuery.inArray( datejny, specificDates ) != -1 ){
                                return [ true ];
                            } else {
                                return [false, "bkap-blocked-date", labels.blocked_label ];
                            }
                        } else {
                            return [false, "bkap-blocked-date", labels.blocked_label ];
                        }
					}
                }
                
                if( global_settings.booking_include_global_holidays == "on" ) {
					for ( ii = 0; ii < holidayDates.length; ii++ ) {
						if( jQuery.inArray(d + "-" + (m+1) + "-" + y,holidayDates) != -1 ) {
							return [false, "bkap-holiday-date",labels.holiday_label ];
						}
					}
				}

                // Allowing to select holidays as checkout dates.
                if( global_settings.booking_include_global_holidays !== "on" ) {
                    if ( jQuery("#wapbk_hidden_date").val() != "" ) {
                                        
                        var m1 = d1 = y1 = "";

                        var split_c        = jQuery("#wapbk_hidden_date").val().split("-");
                        split_c[1]         = split_c[1] - 1;		
                        var  CheckinDate   = new Date( split_c[2], split_c[1], split_c[0] );
                        
                        // Enable check-out date when product level holiday    
                        for ( iii = 1; iii < maximum_numbers_of_days ; iii++ ) {
                            var res = CheckinDate.getTime() + (iii * 24 * 60 * 60 * 1000);
                            var date_holidays 	= new Date(res);

                            m1                 = date_holidays.getMonth();
                            d1                 = date_holidays.getDate() ;
                            y1                 = date_holidays.getFullYear();
                            
                            var k1 = d1 + "-" + ( m1 + 1 ) + "-" + y1;
                            
                            var f = "false";
                            if( jQuery.inArray( k1 ,holidayDates) != -1 ) {
                                f = "true";
                            }
                            
                            if ( f == "true" ){
                
                            var index = holidayDates.indexOf(k1);
                            
                            if ( index > -1) {
                                    holidayDates.splice(index, 1);
                                    // disabling next date in the ccheckout calendar
                                    var next_date_str 	= date_holidays.getTime() + (1 * 24 * 60 * 60 * 1000); 
                                    next_date 			= new Date(next_date_str);

                                    next_m1                 = next_date.getMonth();
                                    next_d1                 = next_date.getDate() ;
                                    next_y1                 = next_date.getFullYear();
                                    var next_k1 			= next_d1 + "-" + ( next_m1 + 1 ) + "-" + next_y1;
                                    holidayDates.push(next_k1);
                            }
                            break;
                            }
                        }

                        for ( ii = 0; ii < holidayDates.length; ii++ ){

                            if( jQuery.inArray(d + "-" + (m+1) + "-" + y, holidayDates) != -1 ) {
                                return [false, "bkap-holiday-date",labels.holiday_label ];
                            }
                        }	                
                    } // end if
                }
			}

			/**** Attribute Lockout Start ****/
			if ( settings.wapbk_attribute_list != undefined ) {
				var attribute_list = settings.wapbk_attribute_list.split(",");

				for ( i = 0; i < attribute_list.length; i++ ) {

					if ( attribute_list[i] != "" ) {

						var field_name   = "#wapbk_lockout_" + attribute_list[i];
                        var lockoutdates = "";
                        if ( jQuery( field_name ).val() ){
                            var field_name_str      = jQuery( field_name ).val();
                            field_name_str          = field_name_str.replace( /\"/g, "" );
                            lockoutdates            = field_name_str.split(",");
                            
                            var dt                  = new Date();
                            var today               = dt.getMonth() + "-" + dt.getDate() + "-" + dt.getFullYear();
                            if ( id_booking == "booking_calender" || id_booking == "inline_calendar" ) {

                                for ( iii = 0; iii < lockoutdates.length; iii++ ) {
                                    if ( jQuery.inArray(d + "-" + (m+1) + "-" + y,lockoutdates) != -1 && jQuery( "#" + attribute_list[i] ).val() > 0 ) {
                                        return [ false, "bkap-booked-date", labels.booked_label ];
                                    }
                                }
                            }
                        }

						var field_name = "#wapbk_lockout_checkout_" + attribute_list[i];
                        if ( jQuery( field_name ).val() ) {
                            
                            var field_name_str      = jQuery( field_name ).val();
                            field_name_str          = field_name_str.replace( /\"/g, "" );
                            var lockoutdates        = field_name_str.split(",");
                            var dt                  = new Date();
                            var today               = dt.getMonth() + "-" + dt.getDate() + "-" + dt.getFullYear();
                            if ( id_booking == "booking_calender_checkout" || id_booking == "inline_calendar_checkout" ) {

                                for ( iii = 0; iii < lockoutdates.length; iii++ ) {
                                    if( jQuery.inArray(d + "-" + (m+1) + "-" + y,lockoutdates) != -1 && jQuery( "#" + attribute_list[i] ).val() > 0 ) {
                                        return [false, "bkap-booked-date", labels.booked_label ];
                                    }
                                }
                            }
                        }						
					}
				}
			}

			/****** Variation Lockout start *******/
			var variation_id_selected    = 0;			
			var variation_by_name        = document.getElementsByName( "variation_id" ).length;

			if ( jQuery( ".variation_id" ).length > 0 ) {
				variation_id_selected = jQuery( ".variation_id" ).val();
			} else if ( variation_by_name > 0 ) {
				variation_id = document.getElementsByName("variation_id")[0].value; 
			}

			var field_name   = "#wapbk_lockout_" + variation_id_selected;

            if ( jQuery( field_name ).val() ) {

                var field_name_str  = jQuery( field_name ).val();
                field_name_str      = field_name_str.replace(/\"/g, "");
                var lockoutdates    = field_name_str.split(",");
                                
                var dt           = new Date();
                var today        = dt.getMonth() + "-" + dt.getDate() + "-" + dt.getFullYear();
                
                if ( id_booking == "booking_calender" || id_booking == "inline_calendar" ) {
                    for ( iii = 0; iii < lockoutdates.length; iii++ ) {
                        if ( jQuery.inArray(d + "-" + (m+1) + "-" + y,lockoutdates) != -1 ) {
                            return [false, "bkap-booked-date", labels.booked_label ];
                        }
                    }
                }
            }			

			var field_name = "#wapbk_lockout_checkout_" + variation_id_selected;
            if ( jQuery( field_name ).val() ) {

                var field_name_str  = jQuery( field_name ).val();
                field_name_str      = field_name_str.replace(/\"/g, "");
                var lockoutdates    = field_name_str.split(",");
                
                var dt              = new Date();
                var today           = dt.getMonth() + "-" + dt.getDate() + "-" + dt.getFullYear();
                if ( id_booking == "booking_calender_checkout" || id_booking == "inline_calendar_checkout" ) {
                    for ( iii = 0; iii < lockoutdates.length; iii++ ) {
                        if ( jQuery.inArray(d + "-" + (m+1) + "-" + y,lockoutdates ) != -1 ) {
                            return [false, "bkap-booked-date", labels.booked_label ];
                        }
                    }
                }
            }
			

			/****** Variations Lockout end ********/
			
			/****** Resource Lockout Etart *******/
            if ( bkap_settings._bkap_resource == "on" && settings.resource_ids != undefined && ( settings.product_type == "simple" || settings.product_type == "subscription" ) ) {
                if ( settings.bkap_resource_assigned == "bkap_automatic_resource" ) {
                
                    var show_rdate = [];
                    
                    for( i=0; i < settings.resource_ids.length; i++){

                        resource_id_selected            = settings.resource_ids[i];
                        wapbk_resource_lockout          = settings.bkap_booked_resource_data[resource_id_selected]['bkap_locked_dates'];
                        wapbk_resource_disaabled_dates  = settings.resource_disable_dates[resource_id_selected];    
                            
                        var lockoutdates                = JSON.parse("[" + wapbk_resource_lockout + "]");
                        lockoutdates                    = lockoutdates.concat(wapbk_resource_disaabled_dates);

                        if ( id_booking == "booking_calender" || id_booking == "inline_calendar" || id_booking == "booking_calender_checkout" ) {
                            
                            for ( iii = 0; iii < lockoutdates.length; iii++ ) {
                                if ( jQuery.inArray( d + "-" + (m+1) + "-" + y, lockoutdates ) != -1 ) {
                                    show_rdate.push( true );
                                } else {
                                    show_rdate.push( false );
                                }
                            }
                        }
                    }

                    if ( show_rdate.length == 0 || jQuery.inArray( false, show_rdate ) != -1 ) {
                    } else {
                        return [ false, "bkap-booked-date", labels.booked_label ];
                    }

                } else {
                    var resource_id_selected = 0;
                
                    if ( jQuery( MODAL_FORM_ID + "#bkap_front_resource_selection").length > 0 ) {
                        resource_id_selected    = jQuery( MODAL_FORM_ID + "#bkap_front_resource_selection").val();
                                
                        wapbk_resource_lockout  = settings.bkap_booked_resource_data[resource_id_selected]['bkap_locked_dates'];
                        wapbk_resource_disaabled_dates  = settings.resource_disable_dates[resource_id_selected];

                        var lockoutdates        = JSON.parse("[" + wapbk_resource_lockout + "]");
                        lockoutdates            = lockoutdates.concat(wapbk_resource_disaabled_dates);
                        var dt                  = new Date();
                        var today               = dt.getMonth() + "-" + dt.getDate() + "-" + dt.getFullYear();

                        if ( id_booking == "booking_calender" || id_booking == "inline_calendar" || id_booking == "booking_calender_checkout" ) {
                            
                            for ( iii = 0; iii < lockoutdates.length; iii++ ) {
                                if ( jQuery.inArray(d + "-" + (m+1) + "-" + y,lockoutdates) != -1 ) {
                                    return [ false, "bkap-booked-date", labels.booked_label ];
                                }
                            }
                        }
                    }
                }
            }
            

			/****** Resource Lockout End *******/
			
			if ( 'on' == bkap_settings.booking_enable_multiple_day ) {
				var bkap_rent = JSON.parse( "[" + settings.bkap_rent + "]" );
				for (i = 0; i < bkap_rent.length; i++) {
					if( jQuery.inArray(d + "-" + (m+1) + "-" + y, bkap_rent ) != -1 ) {
						return [ false, "bkap-unavailable-date", labels.unavailable_label ];
					}
				}
			}

			// if a fixed date range is enabled, then check if the date lies in the range and enable/disable accordingly
			if ( settings.fixed_ranges !== undefined && settings.fixed_ranges.length > 0 ) {
				var in_range = fixed_range( date, id_booking );

				if ( in_range == true ) {
					//return [true];
				} else {
					return [ false ];
				}
			}
			
            var block_option_enabled = jQuery( "#block_option_enabled" ).val();
			
            if ( block_option_enabled =="on" ) {

				if ( id_booking == "booking_calender" || id_booking == "inline_calendar" ) {
					if ( block_option_start_day == date.getDay() || block_option_start_day == "any_days" ) {
						return [ true ];
					} else {
						return [ false ];
					}
				}
				/*var bcc_date=jQuery( "#booking_calender_checkout" ).datepicker( "getDate" );
				if (bcc_date == null) {
					var bcc_date = jQuery( "#inline_calendar_checkout" ).datepicker( "getDate" );
				}*/

                var checkin_date        = $( "#wapbk_hidden_date" ).val(),
                days                    = $( "#block_option_number_of_day" ).val();
                var checkin_date_obj    = bkap_functions.bkap_create_date_obj( checkin_date );
                var bcc_date            = bkap_functions.bkap_add_days_to_date( checkin_date_obj, days );

				if ( bcc_date != null ) {
					var dd         = bcc_date.getDate();
					var mm         = bcc_date.getMonth()+1; //January is 0!
					var yyyy       = bcc_date.getFullYear();
					var checkout   = dd + "-" + mm + "-"+ yyyy;
					jQuery( "#wapbk_hidden_date_checkout" ).val( checkout );

					if ( id_booking == "booking_calender_checkout" || id_booking == "inline_calendar_checkout" ) {
						if ( Date.parse( bcc_date ) === Date.parse( date ) ) {
							return [ true ];
						} else{
							return [ false ];
						}
					}
				}
			}

			return [ true ];
		}
	};
}( jQuery );