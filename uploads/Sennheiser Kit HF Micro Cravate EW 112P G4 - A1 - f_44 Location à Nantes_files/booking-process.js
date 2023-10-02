var bkap_process_init = function( $, bkap_process_params ){

	var global_settings = bkap_functions.global_settings(),
		bkap_settings 	= bkap_functions.bkap_settings(),
		settings 		= bkap_functions.settings(),
		add_to_cart_labels = bkap_process_params.add_to_cart_labels;
		calendar_type	= '',
		checkin_class	= '',
		checkout_class	= '',
		datepicker_options = {};

	window.MODAL_ID 			= '';
	window.MODAL_FORM_ID 		= '';
	window.MODAL_DATE_ID 		= '';
	window.MODAL_END_DATE_ID 	= '';

	if ( $( '#modal-body-'+bkap_process_params.bkap_cart_item_key ).length ) {

		MODAL_ID 			= '#modal-body-'+bkap_process_params.bkap_cart_item_key+' ';
		MODAL_FORM_ID 		= MODAL_ID + '#bkap-booking-form ';
		MODAL_DATE_ID 		= MODAL_FORM_ID + '#bkap_start_date ';
		MODAL_END_DATE_ID 	= MODAL_FORM_ID + '#bkap_end_date ';
	}

	if ( bkap_settings.enable_inline_calendar === 'on') {

		calendar_type 	= 'inline';
		checkin_class 	= MODAL_DATE_ID + '#inline_calendar';
		checkout_class 	= MODAL_END_DATE_ID + '#inline_calendar_checkout';
		
	} else {

		calendar_type 	= 'normal';
		checkin_class 	= MODAL_DATE_ID + '#booking_calender';
		checkout_class 	= MODAL_END_DATE_ID + '#booking_calender_checkout';

		if ( jQuery( checkin_class ).length == 0 ){ return false; } // Return if Start Date field is not present on page.

		if ( jQuery( MODAL_ID + "#wapbk_widget_search" ).val() !== undefined && 
			 jQuery( MODAL_ID + "#wapbk_widget_search" ).val() == 1 &&
			 bkap_settings.booking_enable_multiple_day === 'on' ) {

			 bkap_functions.bkap_init();

		} else if ( jQuery( MODAL_ID + "#wapbk_widget_search" ).val() !== undefined && 
			jQuery( MODAL_ID + "#wapbk_widget_search" ).val() == 1 &&
			bkap_settings.booking_enable_multiple_day === 'on' && 
			bkap_settings.booking_fixed_block_enable !== undefined && 
			bkap_settings.booking_fixed_block_enable === 'booking_fixed_block_enable' ) {

			bkap_functions.test_bkap_init();
		}
	}

	$.datepicker._selectDay = function( id, month, year, td ) {

		var inst,
			target = $( id );

		if ( id === '#inline_calendar' || id === '#booking_calender' ) {
			target = $( MODAL_DATE_ID + id );
		} else if ( id === '#inline_calendar_checkout' || id === '#booking_calender_checkout' ) {
			target = $( MODAL_END_DATE_ID + id );
		}

		if ( $( td ).hasClass( this._unselectableClass ) || this._isDisabledDatepicker( target[ 0 ] ) ) {
			return;
		}

		inst = this._getInst( target[ 0 ] );

		inst.selectedDay 	= inst.currentDay 	= $( "a", td ).html();
		inst.selectedMonth 	= inst.currentMonth = month;
		inst.selectedYear 	= inst.currentYear 	= year;

		this._selectDate( id, this._formatDate( inst,
			inst.currentDay, inst.currentMonth, inst.currentYear ) );
	};

	// The following functions are default datepicker functions overriden to work on modal popup
	$.datepicker._selectDate = function( id, dateStr ) {

		var onSelect,
			target = $( id );
			
		if ( id === '#inline_calendar' || id === '#booking_calender' ) {
			target = $( MODAL_DATE_ID + id );
		}else if ( id === '#inline_calendar_checkout' || id === '#booking_calender_checkout' ) {
			target = $( MODAL_END_DATE_ID + id );
		}

		var inst 	= this._getInst( target[ 0 ] );
		dateStr 	= ( dateStr != null ? dateStr : this._formatDate( inst ) );

		if ( inst.input ) {
			inst.input.val( dateStr );
		}
		this._updateAlternate( inst );

		onSelect = this._get( inst, "onSelect" );
		
		if ( onSelect ) {
			onSelect.apply( ( inst.input ? inst.input[ 0 ] : null ), [ dateStr, inst ] );  // trigger custom callback
		} else if ( inst.input ) {
			inst.input.trigger( "change" ); // fire the change event
		}

		if ( inst.inline ) {
			this._updateDatepicker( inst );
		} else {
			this._hideDatepicker();
			this._lastInput = inst.input[ 0 ];
			if ( typeof( inst.input[ 0 ] ) !== "object" ) {
				inst.input.trigger( "focus" ); // restore focus
			}
			this._lastInput = null;
		}		
	}

	/* Adjust one of the date sub-fields. */
	$.datepicker._adjustDate = function( id, offset, period ) {
		var target = $( id );

		if ( id === '#inline_calendar' || id === '#booking_calender' ) {
			target = $( MODAL_DATE_ID + id );
		}else if ( id === '#inline_calendar_checkout' || id === '#booking_calender_checkout' ) {
			target = $( MODAL_END_DATE_ID + id );
		}

		var inst = this._getInst( target[ 0 ] );

		if ( this._isDisabledDatepicker( target[ 0 ] ) ) {
			return;
		}

		this._adjustInstDate( inst, offset, period );
		this._updateDatepicker( inst );
	}
	
	bkap_functions.bkap_hide_loader( MODAL_ID );

	// recalculate the prices when qty is changed
	jQuery( "form.cart" ).on( "change", "input.qty", function() {
		if ( jQuery( this ).val() >= 1 ) {
		
			if ( 'on' == bkap_settings.booking_enable_multiple_day ) {
				if ( jQuery( MODAL_ID + "#wapbk_hidden_date" ).val() != "" && jQuery( MODAL_ID + "#wapbk_hidden_date_checkout" ).val() != "" ) {
					bkap_calculate_price();
				}
			} else {
				if ( jQuery( MODAL_ID + "#wapbk_hidden_date" ).val() != "" ) {
					bkap_single_day_price();
				} else if ( "on" == bkap_settings.booking_purchase_without_date ) {
					bkap_purchase_without_date( settings );
				}
			}
		}
	});
	
	if ( 'bundle' === settings.product_type || "composite" === settings.product_type ) {
		
		if ( jQuery( ".bundled_product_checkbox" ).length > 0 ) {
			jQuery( ".bundled_product_checkbox" ).on( "click", function(){

				if ( 'on' == bkap_settings.booking_enable_multiple_day ) {
					if ( jQuery( MODAL_ID + "#wapbk_hidden_date" ).val() != "" && jQuery( MODAL_ID + "#wapbk_hidden_date_checkout" ).val() != "" ) {
						bkap_calculate_price();
					}
				} else {
					if ( jQuery( MODAL_ID + "#wapbk_hidden_date" ).val() != "" ) {
						bkap_single_day_price();
					} else if ( "on" == bkap_settings.booking_purchase_without_date ) {
						bkap_purchase_without_date(settings);
					}
				}
			});
		}

		if ( jQuery( ".component_options_select" ).length > 0 ) {
			jQuery( ".component_options_select" ).on( "change", function(){

				if ( 'on' == bkap_settings.booking_enable_multiple_day ) {
					if ( jQuery( MODAL_ID + "#wapbk_hidden_date" ).val() != "" && jQuery( MODAL_ID + "#wapbk_hidden_date_checkout" ).val() != "" ) {
						bkap_calculate_price();
					}
				} else {
					if ( jQuery( MODAL_ID + "#wapbk_hidden_date" ).val() != "" ) {
						bkap_single_day_price();
					} else if ( "on" == bkap_settings.booking_purchase_without_date ) {
						bkap_purchase_without_date(settings);
					}
				}
			});
		}
	} else if ( 'variable' === settings.product_type ) {
		
		jQuery(document).on("change", "select" + bkap_process_params.on_change_attr_list, function() {
			
			// hide the bundle price
			if ( jQuery( ".bundle_price" ).length > 0 ) {
				jQuery( ".bundle_price" ).hide();
			}
			
			// Refresh the datepicker to ensure the correct dates are displayed as available when an attribute is changed
			if ( calendar_type === 'inline' ) {
				jQuery( checkin_class ).datepicker( "refresh" );
				jQuery( checkout_class ).datepicker( "refresh" );
			}
			
			if ( bkap_settings.booking_block_price_enable == "booking_block_price_enable" ) {

				var attribute_values 	= "";
				var attribute_selected 	= "";

				if ( bkap_process_params.attr_value != "" ) {
					a_v = bkap_process_params.attr_value;
					a_v = a_v.split( "," );

					$.each( a_v, function( key, value ) {
					  attribute_values = attribute_values + '|' + jQuery( "[name='"+value+"']" ).val();
					});
				}

				if ( bkap_process_params.attr_selected != "" ) {
					a_v_s = bkap_process_params.attr_selected;
					a_v_s = a_v_s.split( "," );

					$.each( a_v_s, function( key, value ) {
					  attribute_selected = attribute_selected + '|' + jQuery( "[name='"+value+"'] :selected" ).text();
					});
				}
				
				// @TODO ID
				jQuery( "#wapbk_variation_value" ).val( attribute_selected );
			}
			
			if ( jQuery( MODAL_ID + "#wapbk_hidden_date" ).val() != "" && jQuery( MODAL_ID + "#wapbk_hidden_date_checkout" ).val() != "" )
				bkap_calculate_price();

		});
	}

	/**
	 * This event is for choosing the options from Gravity Forms.
	 */
	if ( settings.gf_enabled == "yes" ) {
		jQuery( document ).on( "change", jQuery( "#1" ), function() {
			if ( bkap_settings.booking_enable_multiple_day === 'on' ) {
				if ( jQuery( "#wapbk_hidden_date" ).val() != "" && jQuery( "#wapbk_hidden_date_checkout" ).val() != "" ){
					bkap_calculate_price();
	           	}
			} else {
				if ( jQuery( "#wapbk_hidden_date" ).val() != "" ){
					bkap_single_day_price();	
				}
			}
        });
	}

	/**
	 * This event for changing the fixed bock dropdown on the front end of the product page.
	 */

	jQuery( document ).on( 'change', "select#block_option", function () {
		
		if ( jQuery( "#block_option" ).val() != "" ) {
			
			var passed_id 	= this.value;
			var exploded_id = passed_id.split('&');
			
			jQuery("#block_option_start_day").val(exploded_id[0]);
			jQuery("#block_option_number_of_day").val(exploded_id[1]);
			jQuery("#block_option_price").val(exploded_id[2]);
			jQuery("#wapbk_diff_days").val(parseInt(exploded_id[1]));


			if ( calendar_type === 'inline' ) {
				jQuery( checkin_class ).datepicker( "refresh" );
				jQuery( checkout_class ).datepicker( "refresh" );
			}
			
			if ( bkap_settings.enable_inline_calendar != 'on' ) {
				// reset the date fields
				jQuery("#wapbk_hidden_date").val("");
				jQuery("#wapbk_hidden_date_checkout").val("");

				//jQuery("#show_time_slot").html("");
				jQuery("#show_time_slot").html("");
				jQuery( checkin_class ).datepicker("setDate");
			    jQuery( checkout_class ).datepicker("setDate");

				// disable the add to cart and qty buttons
	            bkap_functions.bkap_disable_qty_and_cart();
			    
			    // hide the price
			    jQuery( "#bkap_price" ).html("");
			    jQuery( "#bkap_no_of_days" ).html("");
			}

		    if ( bkap_settings.enable_inline_calendar === 'on' ) {

		    	jQuery("#wapbk_hidden_date").val("");
				jQuery("#wapbk_hidden_date_checkout").val("");
				var min_date 	= settings.min_date;
				var split_date 	= min_date.split( '-' );

				current_Date 		= new Date ( split_date[1] + '/' + split_date[0] + '/' + split_date[2] );

				first_date 			= bkap_first_fixed_block_date( current_Date, exploded_id );
				
				wapbk_hidden_date 	= bkap_functions.bkap_create_date( first_date );

				jQuery("#wapbk_hidden_date").val(wapbk_hidden_date);
				jQuery( checkin_class ).datepicker( "option", "minDate", first_date );
				jQuery( checkin_class ).datepicker("setDate", first_date );

				if ( typeof( bkap_functions.test_bkap_init_inline ) != "undefined" && typeof( bkap_functions.test_bkap_init_inline ) == "function" ) { // this function is present only for the inline datepicker
				    bkap_functions.test_bkap_init_inline();				    
				}
			}			
		}
	});

	var default_date = bkap_functions.bkap_create_date_obj( settings.default_date );

	var variation_id 		= 0;	
	var variation_by_name 	= document.getElementsByName( MODAL_ID + "variation_id" ).length;
	
	if ( jQuery( MODAL_ID + ".variation_id" ).length > 0 ) {
		
		if ( jQuery( MODAL_ID + ".variation_id" ).length > 1 ) {
			
			var variation_id = "";
			
			jQuery( MODAL_ID + ".variation_id" ).each( function ( i, obj ) {
				
				if ( jQuery( obj ).val() > 0 ) {
					variation_id += jQuery( obj ).val() + ",";
				}
			});

			variation_id = variation_id.slice(0, -1);

		} else {
			variation_id = jQuery( MODAL_ID + ".variation_id" ).val();
		}

	} else if ( variation_by_name > 0 ) {
		variation_id = document.getElementsByName( MODAL_ID + "variation_id" )[0].value; 
	}

	if ( variation_id == 0 && settings.default_var_id > 0 ) {
		variation_id = settings.default_var_id;
	}

	var time_slots_arr = "";
    if ( bkap_settings.booking_enable_time === "on" ) {
        time_slots_arr = bkap_settings.booking_time_settings;
    } else if ( bkap_settings.booking_enable_time === "duration_time" ) {
        time_slots_arr = bkap_settings.bkap_duration_settings;
    }
		
	var time_slot_lockout	= "",
		attr_lockout 		= "";

	if ( settings.product_type !== 'bundle' && settings.product_type === 'variable' ) {
		
		var field_name 			= "#wapbk_timeslot_lockout_" + variation_id;
		var time_slot_lockout 	= "";

		if ( jQuery( field_name ).length > 0 ) {
			time_slot_lockout = jQuery( field_name ).val();
		}

		var attr_lockout = "";
		
		if ( settings.wapbk_attribute_list !== undefined ) {
			var attribute_list = settings.wapbk_attribute_list.split( "," );

			for ( i = 0; i < attribute_list.length; i++ ) {

				if ( attribute_list[i] != "" && jQuery( "#" + attribute_list[i] ).val() > 0 ) {

					var field_name = "#wapbk_timeslot_lockout_" + attribute_list[i];

					if ( jQuery( field_name ).length > 0 ) {
						attr_lockout = attr_lockout + attribute_list[i] + "," + jQuery( field_name ).val() + ";";
					}
				}
			}
		}
	}

	jQuery.extend( jQuery.datepicker, { afterShow: function( event ) {
		jQuery.datepicker._getInst( event.target ).dpDiv.css( "z-index", 9999 );
	}});

	var on_select_date, show_day;

	if ( bkap_settings.booking_enable_multiple_day === 'on' ) {
		on_select_date 	= bkap_set_checkin_date;
		show_day 		= bkap_functions.bkap_check_booked_dates;
	} else {
		on_select_date 	= bkap_show_times;
		show_day 		= bkap_show_book;
	}

	datepicker_options = {
		dateFormat: 	global_settings.booking_date_format,
		numberOfMonths: parseInt( global_settings.booking_months ),
		firstDay: 		parseInt( global_settings.booking_calendar_day ),
		defaultDate: 	default_date,
		beforeShowDay: 	show_day,
		onSelect: 		on_select_date
	}

	if ( jQuery( MODAL_ID + "#block_option_enabled" ).val() === "on" ) {
		datepicker_options['onClose'] = on_close_fixed_blocks; 
	}

	if ( calendar_type === 'inline' ) {
		var avd_obj 					= bkap_avd();
		datepicker_options['minDate'] 	= avd_obj.minDate;
		datepicker_options['maxDate'] 	= avd_obj.maxDate;
		datepicker_options['altField'] 	= MODAL_DATE_ID + '#booking_calender';
		datepicker_options['regional'] 	= settings.bkap_lang;
	}else {
		datepicker_options['beforeShow'] = bkap_avd;
	}

	jQuery( checkin_class )
		.datepicker(datepicker_options);
		

	if( ( global_settings.booking_global_selection == "on" ) || ( jQuery( "#wapbk_widget_search" ).val() == "1" ) || calendar_type === 'inline' ) {

		var other_data = {
			calendar_type: 		calendar_type,
			checkin_class: 		checkin_class,
			time_slots_arr: 	time_slots_arr,
			variation_id: 		variation_id,
			time_slot_lockout: 	time_slot_lockout,
			attr_lockout: 		attr_lockout
		};

		default_display_date( settings, global_settings, bkap_settings, bkap_process_params, other_data );
	}

	if ( calendar_type === 'normal' ) {
		jQuery( "#ui-datepicker-div" ).wrap( "<div class=\"hasDatepicker\"></div>" );
		
		jQuery( MODAL_DATE_ID + "#checkin_cal" ).click( function() {
			jQuery( checkin_class ).datepicker( "show" ); 
		}); 
	}

	if ( bkap_settings.booking_enable_multiple_day === 'on' ){
		multiple_days_function( bkap_settings, global_settings, settings, checkout_class, checkin_class, calendar_type );	
	}

	if( bkap_settings.booking_purchase_without_date == 'on' && bkap_settings.booking_confirmation == 'on' ) {
		if( jQuery( MODAL_ID + "#wapbk_hidden_date" ).val() == "" || jQuery( MODAL_ID + "#wapbk_hidden_date_checkout" ).val() == ""  ) {
			jQuery('.single_add_to_cart_button').text(add_to_cart_labels.bkap_add_to_cart);
		}
	}
};

/**
 * Calculating first available date for fixed block when period is changed.
 *
 * @function bkap_first_fixed_block_date
 * @memberof bkap_process
 * @param {date} current_date - Current Selected Date
 * @param {string} fixed_block - Fixed Block Selected
 * @returns {date} Returns Date modified
 * @since 4.1.0
 */
function bkap_first_fixed_block_date( current_date, fixed_block ) {

	if ( fixed_block[0] == 'any_days' ) {
		
		return current_date;
	} else {

		for ( i=1; i<=7; i++ ) {

			if ( current_date.getDay() == fixed_block[0] ) {
				return current_date;
			}else{
				current_date.setDate(current_date.getDate() + 1);
			}
		}
		return current_date;
	}
}

/**
 * Calculating first available date for fixed block when period is changed.
 *
 * @function multiple_days_function
 * @memberof bkap_process
 * @param {object} bkap_settings - Booking Settings JSON
 * @param {object} global_settings - Global Settings JSON
 * @param {object} settings - Other Settings JSON
 * @param {string} checkout_class - Class name to determine if its inline or normal
 * @param {string} checkin_class - Class name to determine if its inline or normal
 * @param {string} calendar_type - inline or normal
 * @since 4.1.0
 */
function multiple_days_function( bkap_settings, global_settings, settings, checkout_class, checkin_class, calendar_type ){

	var min_date_co,
		checkout_datepicker_options = {},
		current_dt, minDate, split, checkinDate;

	current_dt = jQuery( MODAL_ID + "#wapbk_hidden_date" ).val();

	if ( current_dt ) {
		split 		= current_dt.split( "-" );
		split[1] 	= split[1] - 1;
		minDate 	= new Date( split[2], split[1], split[0] );
		checkinDate = new Date( split[2], split[1], split[0] );
	}else{
		minDate 	= new Date();
		checkinDate = '';
	}

	var maxDate 	= new Date();
	var maxnumber 	= 365;

	if ( bkap_settings.booking_maximum_number_days_multiple !== undefined && jQuery("#block_option_enabled").val() != 'on' ) {
		var maxnumber = bkap_settings.booking_maximum_number_days_multiple;
	}

	maxDate = bkap_functions.bkap_add_days_to_date( minDate, parseInt( maxnumber ) );

	if ( bkap_settings.booking_charge_per_day != undefined && 
		bkap_settings.booking_charge_per_day == 'on' && 
		bkap_settings.booking_same_day !== '' && 
		bkap_settings.booking_same_day == 'on' ) {
		
		min_date_co = minDate;
	} else if ( minDate !== '' && minDate !== undefined ) {	
		var enable_minimum = '', 
			minimum_multiple_day = '';

		if ( bkap_settings.enable_minimum_day_booking_multiple === 'on' ) {

			enable_minimum 			= 'on';
			minimum_multiple_day 	= bkap_settings.booking_minimum_number_days_multiple;
		} else if ( global_settings.minimum_day_booking !== undefined && global_settings.minimum_day_booking === 'on' ) {

			enable_minimum 			= 'on';
			minimum_multiple_day 	= global_settings.global_booking_minimum_number_days;
		}
		
		if ( enable_minimum == "on" ) {

			if( minimum_multiple_day == 0 || !minimum_multiple_day ) {
				minimum_multiple_day = 1;
			}

			minDate = bkap_functions.bkap_add_days_to_date( minDate, parseInt( minimum_multiple_day ) );			
		} else {
			minDate.setDate( minDate.getDate() + 1 );
		}

		min_date_co = minDate;

	} else { 
		minDate.setDate( minDate.getDate() + 1 );
		min_date_co = minDate;
	}

	checkout_datepicker_options = {
		dateFormat: 	global_settings.booking_date_format,
		numberOfMonths: parseInt( global_settings.booking_months ),
		firstDay: 		parseInt( global_settings.booking_calendar_day ),
		minDate: 		min_date_co,
		maxDate: 		maxDate,
		onSelect: 		bkap_get_per_night_price,
		beforeShowDay: 	bkap_functions.bkap_check_booked_dates,
		onClose: function( selectedDate ) {
			jQuery( checkin_class ).datepicker( "option", "maxDate", selectedDate );
		}
	};

	if ( bkap_settings.booking_fixed_block_enable !== undefined && 
		bkap_settings.booking_fixed_block_enable !== 'booking_fixed_block_enable' ){

		checkout_datepicker_options['onSelect'] = bkap_get_per_night_price
	}

	if ( calendar_type === 'inline' ) {
		checkout_datepicker_options['altField'] = MODAL_END_DATE_ID + '#booking_calender_checkout';
	}

	jQuery( checkout_class )
		.datepicker( checkout_datepicker_options )
		.focus( function( event ) {
			jQuery.datepicker.afterShow( event );
		});

	if ( ( global_settings.booking_global_selection === "on" ) || 
		( jQuery( "#wapbk_widget_search" ).val() == "1" ) ) {

		if ( checkinDate && jQuery( "#block_option_enabled" ).val() && jQuery( "#block_option_enabled" ).val() === "on" ) {
			set_checkout_mindate( checkinDate, settings, bkap_settings, global_settings, calendar_type, checkout_class );
		}
		display_checkout_date( checkout_class );
	}

	if ( bkap_settings.booking_enable_multiple_day === 'on' && 
		calendar_type === 'inline' ) {
		
		bkap_functions.bkap_init_inline_multiple( global_settings, bkap_settings, settings );
	}

	if ( calendar_type === 'normal' ) {
		jQuery( MODAL_END_DATE_ID + "#checkout_cal" ).click( function() {
			jQuery( checkout_class ).datepicker( "show" );
		});
	}

	// This section is for showing dates selected for inline calendar when search widget is on
	if ( calendar_type === 'inline') {
		if( jQuery( MODAL_ID + "#wapbk_widget_search" ) !== undefined && 
			jQuery( MODAL_ID + "#wapbk_widget_search" ) == 1 &&
			bkap_settings.booking_fixed_block_enable !== undefined && 
			bkap_settings.booking_fixed_block_enable === 'booking_fixed_block_enable' ) {

			bkap_functions.test_bkap_init_inline();
		}else if ( bkap_settings.booking_fixed_block_enable !== undefined && 
			bkap_settings.booking_fixed_block_enable === 'booking_fixed_block_enable' &&
			bkap_settings.bkap_fixed_blocks_data.length ) {

			bkap_functions.test_bkap_init_inline();
		}
	}

	
	if( bkap_settings.bkap_show_mode !== undefined && bkap_settings.bkap_show_mode == "on" ){
		 if( bkap_settings.bkap_purchase_mode == "default_sale_mode" ) {
		 	reset_booking_details();
		 }
	}

}

/**
 * Calculating first available date for fixed block when period is changed.
 *
 * @function default_display_date
 * @memberof bkap_process
 * @param {object} settings - Other Settings JSON
 * @param {object} global_settings - Global Settings JSON
 * @param {object} bkap_settings - Booking Settings JSON
 * @param {object} bkap_process_params - Booking Process Params Object
 * @param {object} other_data - Other Data for addons
 * @since 4.1.0
 */
function default_display_date( settings, global_settings, bkap_settings, bkap_process_params, other_data ){

	if ( jQuery( MODAL_ID + "#wapbk_hidden_date" ).val() == "" || jQuery( MODAL_ID + "#wapbk_hidden_date" ).val() == undefined ){
		return;
	}

	var split 		= jQuery( MODAL_ID + "#wapbk_hidden_date" ).val().split( "-" );
	split[1] 		= split[1] - 1;		
	var current_dt	= jQuery( MODAL_ID + "#wapbk_hidden_date" ).val();		
	var CheckinDate = new Date( split[2], split[1], split[0] );
	var timestamp 	= Date.parse( CheckinDate );

	if ( isNaN( timestamp ) == false ) { 
		var default_date = new Date( timestamp );
		
		jQuery( other_data.checkin_class ).datepicker( "setDate", default_date );

		if ( ( bkap_settings.booking_enable_time == "on" || bkap_settings.booking_enable_time == "duration_time" ) && Object.keys(other_data.time_slots_arr).length > 0 ) {

			if ( bkap_process_params.bkap_booking_params !== undefined ){
				if ( bkap_process_params.bkap_booking_params.selected_duration !== 'undefined' ){
					var duration_split = bkap_edit_params.bkap_booking_params.selected_duration.split("-");
					duration_split1 = duration_split[0];
					var duration = duration_split1 / bkap_settings.bkap_duration_settings.duration;

					jQuery( MODAL_FORM_ID + "#bkap_duration_field" ).val(duration);
				}
			}
			
			if ( !MODAL_ID ) {
				bkap_process_date( current_dt );
			}

			var data = {
				current_date: 				current_dt,
				post_id: 					bkap_process_params.product_id,
				date_time_type: 			bkap_settings.booking_enable_time, 
				variation_id: 				other_data.variation_id,
				variation_timeslot_lockout: other_data.time_slot_lockout,
				attribute_timeslot_lockout: other_data.attr_lockout,
				action: 					settings.method_timeslots,
				booking_post_id: 			settings.booking_post_id,
				bkap_page: 						settings.bkap_page,
				//'.$attribute_fields_str.'
			};

			if ( settings.method_timeslots == "bkap_multiple_time_slot" && settings.bkap_page == "view-order" ){
				
				var option_value = MODAL_ID.split( '-' );
				var view_item_id = "";
				if ( option_value[2] != undefined ) {
					view_item_id = option_value[2].trim();
				}
				jQuery.extend( data, { 'view_order_id': settings.view_order_id, 'view_item_id': view_item_id } );
			}
			
			if( jQuery( MODAL_FORM_ID + "#bkap_duration_field").length > 0 ) {
				bkap_duration = jQuery( MODAL_FORM_ID + "#bkap_duration_field" ).val();
				jQuery.extend( data, { 'seleced_duration': bkap_duration } );
			}

			jQuery.post( bkap_process_params.ajax_url, data, function( response ) {
				
				jQuery( MODAL_ID + ".ajax_img" ).hide();
				jQuery( MODAL_ID + "#bkap_no_of_days" ).html('');				
				jQuery( "#cadt" ).remove();
				
				jQuery( MODAL_FORM_ID + "#show_time_slot" ).html( response.bkap_time_dropdown );

				if ( jQuery( MODAL_ID + "#date_time_call" ).val() == "" ) {
					bkap_time_slot_events( settings, global_settings, bkap_settings );
				}

				if ( typeof( bkap_edit_params ) !== 'undefined' ) {

					if ( bkap_edit_params.bkap_booking_params.time_slot != undefined && bkap_edit_params.bkap_booking_params.time_slot.indexOf("<br>") !== -1 ) {
						// When using multiple timeslots and editing it in cart and checkout then this will run to pupolate selected timeslots
						var time_slot_splited = bkap_edit_params.bkap_booking_params.time_slot.split( '<br>' );

						jQuery.each( jQuery( "input[name=\"time_slot[]\"]" ), function() {
							if ( jQuery.inArray( jQuery(this).val(), time_slot_splited ) != -1 ) {
								jQuery(this).prop( 'checked', true );
								multi_timeslot( this );
							}
						});
					} else {
						jQuery( MODAL_FORM_ID + "#show_time_slot" + " #time_slot" ).val( bkap_edit_params.bkap_booking_params.time_slot ).change();
					}

					if ( bkap_settings.booking_enable_time == "duration_time" ) {
						// selected_duration = bkap_edit_params.bkap_booking_params.selected_duration.split('-');
						// jQuery( MODAL_FORM_ID + " #bkap_duration_field" ).val( selected_duration[0] );
						var data_a = jQuery( jQuery( MODAL_FORM_ID + "#show_time_slot" + " .bkap-duration-block li a" ) );
						
						jQuery.each( data_a, function( key, value ) {
							if ( value.dataset.value == bkap_edit_params.bkap_booking_params.duration_time_slot ) {
								jQuery( this ).addClass( "bkap-duration-selected" );
								jQuery( this ).click();
							}
						});
						
						// display the selected time slot
						if( settings.duration_time_selected != undefined && settings.duration_time_selected !== '' ) {
							jQuery( "#duration_time_slot" ).val( settings.duration_time_selected );
						}
						/*if( settings.duration_selected !== '' ) {
							jQuery( "#bkap_duration_field" ).val( settings.duration_selected );
							//jQuery( "#duration_time_slot" ).val( settings.duration_time_selected );
						}*/
					}

					
				}
				
				// display the selected time slot
				if( settings.time_selected !== '' ) {
					jQuery( "#time_slot" ).val( settings.time_selected );
				}

				if ( settings.multiple_time_selected != "" && settings.bkap_page == "view-order" ) { // for selecting multiple timeslots
					jQuery.each( jQuery( "input[name=\"time_slot[]\"]" ), function() {
						if ( settings.multiple_time_selected[ view_item_id ] != undefined ){

							if( settings.multiple_time_selected[ view_item_id ][ current_dt ] != undefined ){
								if ( settings.multiple_time_selected[view_item_id][current_dt].indexOf( jQuery(this).val() ) >= 0 ){
									jQuery(this).prop( 'checked', true );
								}
							}
						}
					});
				}
			});
		} else {

			bkap_process_date( current_dt );
			
			setTimeout( function(){
				var fixed_block_selected = jQuery( MODAL_ID + '#wapbk_diff_days' ).val(),
					option_value = '';
				
				if ( fixed_block_selected && fixed_block_selected !== undefined && fixed_block_selected !== '' ) {
					
					jQuery( MODAL_FORM_ID + '#block_option option' ).each(function() {
						
						option_value = jQuery(this).val().split( '&' );
						
						if ( option_value[1] && option_value[1] == fixed_block_selected ) {
							jQuery( MODAL_FORM_ID + '#block_option' ).val( jQuery(this).val() );
						}
					});
				}
			});
		}
	}
}

/**
 * Display Checkout date by default
 *
 * @function display_checkout_date
 * @memberof bkap_process
 * @param {string} checkout_class - Checkout Class Name
 * @returns {date} Returns Date modified
 * @since 4.1.0
 */
function display_checkout_date( checkout_class ) {

	var split 			= jQuery( MODAL_ID + "#wapbk_hidden_date_checkout" ).val().split( "-" );
	split[1] 			= split[1] - 1;		
	var CheckoutDate 	= new Date(split[2],split[1],split[0]);
	var timestamp 		= Date.parse(CheckoutDate);

	if ( isNaN( timestamp ) == false ) {

		var default_date = new Date(timestamp);
		jQuery( checkout_class ).datepicker( "setDate", default_date );
		bkap_calculate_price();
	}

	return default_date;
}

/**
 * This function disables the dates in the calendar for holidays, global holidays set 
 * and for which lockout is reached for Single day booking feature.
 *
 * @function bkap_show_book
 * @memberof bkap_process
 * @param {string} date - Date Selected from calendar
 * @returns {array} Returns Array with following format [enabled/disabled bool, class, label]
 * @since 4.1.0
 */
function bkap_show_book( date ) {
	
	var settings 					= bkap_functions.settings();
	var bkap_settings 				= bkap_functions.bkap_settings();
	var labels 						= bkap_functions.bkap_labels();
	
	var deliveryDates 				= JSON.parse( "[" + settings.specific_dates + "]" );
	var holidayDates 				= JSON.parse( "[" + settings.holidays + "]" );

	var dateymd 					= bkap_functions.bkap_create_date_ymd( date );
	var datejny 					= bkap_functions.bkap_create_date( date );

	var disabled_week_days = 0;
	if ( settings.wapbk_block_checkin_weekdays != undefined ){
		disabled_week_days 			= JSON.parse( "[" + settings.wapbk_block_checkin_weekdays + "]" );
		for ( jjj = 0; jjj < disabled_week_days.length; jjj++ ) {
			if ( jQuery.inArray( date.getDay(), disabled_week_days ) != -1 ) {
				return [ false, "bkap-blocked-date", labels.blocked_label ];
			}
		}
	}

	if ( settings.bkap_block_selected_weekdays != "" ) {
		var block_selected_week_days = settings.bkap_block_selected_weekdays;
		var res 					 = block_selected_week_days.split(",");
		for ( weekday = 0; weekday < res.length; weekday++  ) {
	        if ( jQuery.inArray( dateymd, res ) != -1 ) {
				return [ false, "bkap-blocked-date", labels.blocked_label ];
			}
		}
	}

	var id_booking 		= jQuery(this).attr("id");
	
	//Lockout Dates
	var lockoutdates 	= JSON.parse( "[" + settings.wapbk_lockout_days + "]" );
	for ( iii = 0; iii < lockoutdates.length; iii++ ) {
		if ( jQuery.inArray( datejny,lockoutdates ) != -1 ) {
			return [ false, "bkap-blocked-date", labels.booked_label ];
		}
	}	

	/**** Attribute Lockout Start ****/
	if ( settings.wapbk_attribute_list != undefined ) {
		
		var attribute_list = settings.wapbk_attribute_list.split( "," );

		for ( i = 0; i < attribute_list.length; i++ ) {

			if ( attribute_list[i] != "" ) {

				var field_name 		= "#wapbk_lockout_" + attribute_list[i];
				if ( jQuery( field_name ).val() ){
					var field_name_str  	= jQuery( field_name ).val();
            		field_name_str      	= field_name_str.replace( /\"/g, "" );
					var lockoutdates 		= field_name_str.split(",");

					if ( id_booking == "booking_calender" || id_booking == "inline_calendar" ) {

						for ( iii = 0; iii < lockoutdates.length; iii++ ) {
							if ( jQuery.inArray( datejny,lockoutdates ) != -1 && jQuery( "#" + attribute_list[i] ).val() > 0 ) {
								return [ false, "bkap-booked-date", labels.booked_label ];
							}
						}
					}
				}
				
			}
		}
	}

	/****** Variation Lockout start *******/	
	var variation_id_selected 	= 0;	
	var variation_by_name 		= document.getElementsByName( "variation_id" ).length;

	if ( jQuery( ".variation_id" ).length > 0 ) {
		variation_id_selected = jQuery( ".variation_id" ).val();
	} else if ( variation_by_name > 0 ) {
		variation_id_selected = document.getElementsByName( "variation_id" )[0].value; 
	}

	if ( variation_id_selected == 0 && settings.default_var_id > 0 ) {
        variation_id_selected = settings.default_var_id;
    }

    if ( variation_id_selected != 0 ) {
    	var field_name 		= "#wapbk_lockout_" + variation_id_selected;
    	if ( jQuery( field_name ).val() ) {
    		var field_name_str  	= jQuery( field_name ).val();
            field_name_str      	= field_name_str.replace( /\"/g, "" );
    		var lockoutdates 		= field_name_str.split(",");

			if ( id_booking == "booking_calender" || id_booking == "inline_calendar" ) {
				for ( iii = 0; iii < lockoutdates.length; iii++ ) {
					if ( jQuery.inArray( datejny, lockoutdates ) != -1 ) {
						return [ false, "bkap-booked-date", labels.booked_label ];
					}
				}
			}
    	}			
    }
	
	/****** Resource Lockout Start *******/

	if ( bkap_settings._bkap_resource == "on" && settings.resource_ids != undefined && ( settings.product_type == "simple" || settings.product_type == 'subscription' ) ) {
		
		if ( settings.bkap_resource_assigned == "bkap_automatic_resource" ) {
			var show_rdate = [];

			for( i=0; i < settings.resource_ids.length; i++){

		    	resource_id_selected 			= settings.resource_ids[i];
				wapbk_resource_lockout 			= settings.bkap_booked_resource_data[resource_id_selected]['bkap_locked_dates'];
				var lockoutdates 				= JSON.parse("[" + wapbk_resource_lockout + "]");
				
				if ( settings.resource_disable_dates[resource_id_selected] != undefined ){
					wapbk_resource_disaabled_dates 	= settings.resource_disable_dates[resource_id_selected];
					lockoutdates 					= lockoutdates.concat(wapbk_resource_disaabled_dates);
				}

				if ( lockoutdates.length > 0 ) {

					if ( id_booking == "booking_calender" || id_booking == "inline_calendar" ) {
						
						for ( iii = 0; iii < lockoutdates.length; iii++ ) {
							if ( jQuery.inArray( datejny, lockoutdates ) != -1 ) {
								show_rdate.push( true );
							} else {
								show_rdate.push( false );
							}
						}
					}
				} else {
					show_rdate.push( false );
				}				
    		}

    		if ( show_rdate.length == 0 || jQuery.inArray( false, show_rdate ) != -1 ) {
    		} else {
    			return [ false, "bkap-booked-date", labels.booked_label ];
    		}

		} else {
			var resource_id_selected = 0;

			if( jQuery( MODAL_FORM_ID + "#bkap_front_resource_selection").length > 0 ) {
				resource_id_selected 			= jQuery( MODAL_FORM_ID + "#bkap_front_resource_selection").val();

				wapbk_resource_lockout 			= settings.bkap_booked_resource_data[resource_id_selected]['bkap_locked_dates'];
				wapbk_resource_disaabled_dates 	= settings.resource_disable_dates[resource_id_selected];	
					
				var lockoutdates 				= JSON.parse("[" + wapbk_resource_lockout + "]");
				lockoutdates 					= lockoutdates.concat(wapbk_resource_disaabled_dates);

				if ( id_booking == "booking_calender" || id_booking == "inline_calendar" ) {
					
					for ( iii = 0; iii < lockoutdates.length; iii++ ) {
						if ( jQuery.inArray( datejny, lockoutdates ) != -1 ) {
							return [ false, "bkap-booked-date", labels.booked_label ];
						}
					}
				}
			}
		}
	}

	for ( ii = 0; ii < holidayDates.length; ii++ ) {
		if( jQuery.inArray( datejny, holidayDates ) != -1 ) {
			return [ false, "bkap-holiday-date", labels.holiday_label ];
		}
	}

	if ( settings.wapbk_hidden_booked_dates ){
		var bookedDates 	= JSON.parse( "[" + settings.wapbk_hidden_booked_dates + "]" );
		for ( i = 0; i < bookedDates.length; i++ ) {
			if( jQuery.inArray( datejny, bookedDates ) != -1 ) {
				return [ false, "bkap-unavailable-date", labels.unavailable_label ];
			}
		}	
	}	

	if ( 'on' == bkap_settings.booking_enable_multiple_day ) {
		var bkap_rent = JSON.parse( "[" + settings.bkap_rent + "]" );
		
		for ( i = 0; i < bkap_rent.length; i++ ) {
			if( jQuery.inArray( datejny, bkap_rent ) != -1 ) {
				return [ false, "bkap-rent-date", labels.rent_label ];
			}
		}
	}

	var in_range = "";
	// if a fixed date range is enabled, then check if the date lies in the range and enable/disable accordingly
	if ( settings.fixed_ranges !== undefined ) {
		in_range = fixed_range( date );
	} else {
		// if fixed bookable range is not enabled, then the variable should be set to true to ensure the date is enabled based on specific dates/recurring weekday settings.
		in_range = true;
	}
	for ( i = 0; i < deliveryDates.length; i++ ) {
		if( jQuery.inArray( datejny, deliveryDates ) != -1 && true == in_range ){
			return [ true ];
		}
	}
 
	var day 			= "booking_weekday_" + date.getDay();
	var recurring_array = bkap_settings.booking_recurring;
	
	if ( recurring_array[day] == "on" && true == in_range ){
		return [ true ];
	}
	return [ false ];
}

/**
 * This function calls an ajax when a date is selected which displays the time slots on frontend product page.
 *
 * @function bkap_show_times
 * @memberof bkap_process
 * @param {string} date - Current Date Selected
 * @param {object} inst - Instance of current object
 * @since 4.1.0
 */
function bkap_show_times( date, inst ) {

	jQuery( MODAL_ID + "#duration_time_slot" ).val("");

	bkap_functions.bkap_disable_qty_and_cart();

	var monthValue 	= inst.selectedMonth+1;
	var dayValue 	= inst.selectedDay;
	var yearValue 	= inst.selectedYear;

	var current_dt 	= dayValue + "-" + monthValue + "-" + yearValue;

	jQuery( MODAL_ID + "#wapbk_hidden_date" ).val( current_dt );
	
	bkap_process_date( current_dt );
}

/**
 * Process the current date selected
 *
 * @function bkap_process_date
 * @memberof bkap_process
 * @param {string} current_dt - Current Date Selected
 * @since 4.1.0
 */
function bkap_process_date( current_dt ) {
	
	var settings 			= bkap_functions.settings();;
	var global_settings 	= bkap_functions.global_settings();
	var bkap_settings 		= bkap_functions.bkap_settings();
	
	var sold_individually 	= settings.sold_individually;	
	var quantity 			= bkap_functions.bkap_get_qty();

	// Date information
	var wapbk_hidden_date 			= jQuery( MODAL_ID + "#wapbk_hidden_date" ).val();
	var date_in_selected_language 	= jQuery( MODAL_DATE_ID + "#booking_calender" ).val();
	
	/*** Variation Calculations Section Start ***/
		
	var variation_id 		= 0;	
	var variation_by_name 	= document.getElementsByName( MODAL_ID + "variation_id" ).length,
		variation_id_count 	= 0,
		bookings_placed 	= "",
		variation_array 	= [],
		field_name 			= '';
	var variation_id_length = jQuery( MODAL_ID + ".variation_id" ).length;

	if ( settings.product_type != "simple" ) {

		if ( variation_id_length > 0 ) {
			
			if ( variation_id_length > 1 ) {
				
				variation_id = "";
				
				jQuery( MODAL_ID + ".variation_id" ).each( function ( i, obj ) {
					variation_id += jQuery( obj ).val() + ",";
					variation_id_count++;
				});
				variation_id = variation_id.slice(0, -1);

			} else {
				variation_id = jQuery( MODAL_ID + ".variation_id" ).val();;
			}

		} else if ( variation_by_name > 0 ) {
			variation_id = document.getElementsByName( MODAL_ID + "variation_id")[0].value; 
		}

		if ( variation_id == 0 && settings.default_var_id > 0 ) {
			variation_id = settings.default_var_id;
		}

		if ( variation_id != "" ) {
			if ( variation_id_count > 0 ) {
			
				variation_array = variation_id.split( ',' );
				
				for ( var var_sub_id in variation_array ){
					
					if ( var_sub_id !== '' && var_sub_id !== undefined ) {
						field_name = "#wapbk_bookings_placed_" + var_sub_id;

						if ( jQuery( field_name ).length > 0 ) {
							bookings_placed += jQuery( field_name ).val() + ',';
						}
					}
				}
			} else {
				field_name = "#wapbk_bookings_placed_" + variation_id;

				if ( jQuery( field_name ).length > 0 ) {
					bookings_placed = jQuery( field_name ).val();
				}
			}
		}

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
	}

	/*** Variation Calculations Section Ends ***/
	
	/*** Resource Calculations Section Start ***/

	var resource_id_selected 			= 0;
	var bkap_resource_booking_placed 	= "";
	var bkap_locked_dates 				= "";
	var resource 						= false;

	if ( bkap_settings._bkap_resource == "on" && settings.resource_ids != undefined && ( settings.product_type == "simple" || settings.product_type == "subscription" ) ) {
		resource = true;
		if ( settings.bkap_resource_assigned == "bkap_automatic_resource" ) {			
			
			var show_rdate = false;
			
			for( i=0; i < settings.resource_ids.length; i++ ) {

		    	resource_id_selected 	= settings.resource_ids[i];
				wapbk_resource_lockout 	= settings.bkap_booked_resource_data[resource_id_selected]['bkap_locked_dates'];
				var lockoutdates 		= JSON.parse("[" + wapbk_resource_lockout + "]");

				if ( settings.resource_disable_dates[resource_id_selected] != undefined ){
					wapbk_resource_disaabled_dates 	= settings.resource_disable_dates[resource_id_selected];
					lockoutdates 					= lockoutdates.concat(wapbk_resource_disaabled_dates);
				}
				
				for ( iii = 0; iii < lockoutdates.length; iii++ ) {
					if ( jQuery.inArray( current_dt, lockoutdates ) != -1 ) {
					} else {
						show_rdate = true;
						break;
					}
				}
				if ( lockoutdates.length == 0 || show_rdate == true ){
					resource_id_selected = resource_id_selected.toString();
					break;
				}
			}
			jQuery( MODAL_FORM_ID + "#bkap_resource_label" ).html( '<b>' + settings.bkap_resource_data[resource_id_selected]['resource_title'] + '</b>' )

		} else {
			if ( jQuery( MODAL_FORM_ID + "#bkap_front_resource_selection").length > 0 ) {
				resource_id_selected 		 = jQuery( MODAL_FORM_ID + "#bkap_front_resource_selection").val();
			}
		}

		jQuery( MODAL_FORM_ID + "#bkap_front_resource_selection").val( resource_id_selected );
		bkap_resource_booking_placed = settings.bkap_booked_resource_data[resource_id_selected]['bkap_booking_placed'];
		bkap_locked_dates			 = settings.bkap_booked_resource_data[resource_id_selected]['bkap_time_locked_dates'];
	}

	/*** Resource Calculations Section End ***/
	
	// Availability Display for the date selected if setting is enabled

	var bkap_duration = 0;
	if( jQuery( MODAL_FORM_ID + "#bkap_duration_field").length > 0 ) {
		bkap_duration = jQuery( "#bkap_duration_field" ).val();
		jQuery( MODAL_FORM_ID + "#bkap_show_stock_status" ).hide();
	}

	if ( bkap_duration == 0 ) { // Hide availability message when duration based booking.

		var data = {
			date: 			wapbk_hidden_date,
			post_id: 		bkap_process_params.product_id,
			date_fld_val: 	date_in_selected_language,
			action: 		"bkap_date_lockout"
		};

		if ( settings.product_type != "simple" ) {
			jQuery.extend( data, { 'variation_id': variation_id, 'bookings_placed' : bookings_placed, 'attr_bookings_placed' : attr_bookings_placed } );			
		}

		if ( resource == true ) {
			jQuery.extend( data, { 'resource_id': resource_id_selected, 'resource_bookings_placed' : bkap_resource_booking_placed } );			
		}

		jQuery.post( bkap_process_params.ajax_url, data, function( response ) {

			if ( global_settings.booking_availability_display === "on"/* && bkap_duration == 0*/ ) {
				jQuery( MODAL_FORM_ID + "#bkap_show_stock_status" ).html( response.message );
			}
			
			if ( response.max_qty != "" && response.max_qty != 0 && response.max_qty != "Unlimited" ) {
				var max 				= parseInt( response.max_qty );
			    var max_availability 	= jQuery("input[name=\"quantity\"]");

			    max_availability.attr( "max", max );
			}
		});
	}

	var time 				= false;
	var seleced_duration 	= 1;

	if ( bkap_settings.booking_enable_time === "on" ) {
		var time_slots 	= bkap_settings.booking_time_settings;
		time 			= true;
	} else if ( bkap_settings.booking_enable_time === "duration_time" ) {
		var time_slots 		= bkap_settings.bkap_duration_settings;
		seleced_duration 	= parseInt( jQuery( "#bkap_duration_field" ).prop( "value" ) );
		time 				= true;
	}

	if ( time && time_slots.length !== null && time_slots !== undefined ) {
		
		if ( global_settings.display_disabled_buttons == "on" ) {
			jQuery( MODAL_ID + "#bkap_price" ).hide();
			bkap_functions.bkap_disable_qty_and_cart();
		} else {
			jQuery( MODAL_ID + "#bkap_price" ).hide();
			bkap_functions.bkap_hide_qty_and_cart();
		}

		var time_slot_lockout 	= "";
		var attr_lockout 		= "";
		
		if ( bkap_settings.booking_enable_time === "on" ) {
			
			var field_name 			= "#wapbk_timeslot_lockout_" + variation_id;
			if ( jQuery( field_name ).length > 0 ) {
				time_slot_lockout = jQuery( field_name ).val();
			}		

			if ( settings.wapbk_attribute_list != undefined ) {
				var attribute_list = settings.wapbk_attribute_list.split( "," );

				for ( i = 0; i < attribute_list.length; i++ ) {

					if ( attribute_list[i] != "" && jQuery( "#" + attribute_list[i] ).val() > 0 ) {

						var field_name = "#wapbk_timeslot_lockout_" + attribute_list[i];
						
						if ( jQuery( field_name ).length > 0 ) {
							attr_lockout = attr_lockout + attribute_list[i] + "," + jQuery( field_name ).val() + ";";
						}
					}
				}
			}
		}

		/*if ( settings.duration_selected !== undefined && settings.duration_selected !== "" && ) {
			jQuery( "#bkap_duration_field" ).val( settings.duration_selected );
		}*/
		
        jQuery( MODAL_FORM_ID + "#show_time_slot" ).block({
            message: null,
            overlayCSS: {
                background: '#eee',
                opacity: 0.6
            }
        });

		var data = {
			current_date: 				current_dt,
			post_id: 					bkap_process_params.product_id,
			action: 					settings.method_timeslots,			
			date_time_type: 			bkap_settings.booking_enable_time,
			seleced_duration: 			seleced_duration,
			bkap_page: 					settings.bkap_page,
		};

		if ( settings.bkap_page == "bkap_post" )
			data.booking_post_id = settings.booking_post_id;

		if ( variation_id > 0 )
			data.variation_id = variation_id;

		if ( time_slot_lockout != "" )
			data.variation_timeslot_lockout = time_slot_lockout;

		if ( attr_lockout != "" )
			data.attribute_timeslot_lockout = attr_lockout;

		if ( resource_id_selected > 0 ){
			data.resource_id = resource_id_selected;
			data.resource_lockoutdates = bkap_locked_dates;
		}

		// Rescheduling purpose when booking is for multiple timeslots
		if ( settings.method_timeslots == "bkap_multiple_time_slot" && settings.bkap_page == "view-order" ){
				
			var option_value = MODAL_ID.split( '-' );
			var view_item_id = "";
			if ( option_value[2] != undefined ) {
				view_item_id = option_value[2].trim();
			}
			jQuery.extend( data, { 'view_order_id': settings.view_order_id, 'view_item_id': view_item_id } );
		}

		jQuery.post( bkap_process_params.ajax_url, data, function(response) {
			
			jQuery( MODAL_ID + ".ajax_img" ).hide();
			jQuery( MODAL_ID + "#bkap_no_of_days" ).html('');

			jQuery( "#cadt" ).remove();
			jQuery( MODAL_FORM_ID + "#show_time_slot" ).html( response.bkap_time_dropdown );

			if ( jQuery( MODAL_FORM_ID + "#date_time_call" ).val() == "" ) {
				bkap_time_slot_events( settings, global_settings, bkap_settings );
			}
			
			// Dynamically assigning width and height for the duration blocks
			if ( bkap_settings.booking_enable_time === "duration_time" ) {				

				var max_width  = 0;
				var max_height = 0;

				jQuery( MODAL_FORM_ID + '#show_time_slot .bkap_block a').each( function() {
					
					var width  = jQuery(this).width();
					var height = jQuery(this).height();

					if ( width > max_width ) {
						max_width = width;
					}
					if ( height > max_height ) {
						max_height = height;
					}
				});

				jQuery('.bkap_block a').width( max_width - 1 );
				jQuery('.bkap_block a').height( max_height );

				// For Booking Edit Post
				if ( settings.duration_time_selected !== undefined && settings.duration_time_selected !== "" ) {

					jQuery( "#duration_time_slot" ).val( settings.duration_time_selected );

					var data_a = jQuery( jQuery( MODAL_FORM_ID + "#show_time_slot" + " .bkap-duration-block li a" ) );
						
					jQuery.each( data_a, function( key, value ) {
						if ( value.dataset.value == settings.duration_time_selected ) {
							jQuery( this ).addClass( "bkap-duration-selected" );
							jQuery( this ).click();
						}
					});					
				}
			}
			
			if ( settings.time_selected == '' && response.bkap_time_count == 1 ) { // auto select the timeslot if there is only one timeslot for the selected date.
				jQuery( MODAL_ID + "#time_slot" ).trigger('change');
			}

			// display the selected time slot			
			if ( settings.time_selected !== '' ) {
				jQuery( "#time_slot" ).val( settings.time_selected );
			}

			if ( settings.multiple_time_selected != "" && settings.bkap_page == "view-order" ) { // for selecting multiple timeslots
				jQuery.each( jQuery( "input[name=\"time_slot[]\"]" ), function() {
					if( settings.multiple_time_selected[ view_item_id ] != undefined ){
						if ( settings.multiple_time_selected[view_item_id][current_dt] != undefined ) {
							if ( settings.multiple_time_selected[view_item_id][current_dt].indexOf( jQuery( this ).val() ) >= 0 ){
								jQuery(this).prop( 'checked', true );
							}
						}
					}
				});
			}
		});

		bkap_single_day_price();

	} else {

		if ( 'on' != bkap_settings.booking_enable_multiple_day ) {

			if ( wapbk_hidden_date != "" ) {
				jQuery( ".payment_type" ).show();				
				if ( sold_individually == "yes" ) {
					jQuery( '.quantity input[name="quantity"]' ).hide();
				} else {
					jQuery( '.quantity input[name="quantity"]' ).show();
				}
			} else if ( wapbk_hidden_date == "" ) {
				bkap_functions.bkap_disable_qty_and_cart();
				jQuery( ".payment_type" ).hide()
				jQuery( ".partial_message" ).hide();
			}
			bkap_single_day_price();
		}
	}	
}

function bkap_time_slot_events_calculation( time_slot_value, date_time_type ) {

	var global_settings = bkap_functions.global_settings(),
		bkap_settings 	= bkap_functions.bkap_settings(),
		settings 		= bkap_functions.settings();
       	
       	var sold_individually 	= settings.sold_individually;		
		var quantity 			= bkap_functions.bkap_get_qty();

		/**
		 * Variation Lockout Calculation
		 */

		var variation_id 		= 0;		
		var variation_by_name 	= document.getElementsByName( "variation_id" ).length;

		if ( 'simple' != settings.product_type ) {

			if ( jQuery( MODAL_ID + ".variation_id" ).length > 0 ) {
				
				if ( jQuery( MODAL_ID + ".variation_id" ).length > 1 ) {
					
					var variation_id = "";
					
					jQuery( MODAL_ID + ".variation_id" ).each( function ( i, obj ) {
						if( jQuery( obj ).val() != "" ){
							variation_id += jQuery( obj ).val() + ",";	
						}
						
					});
					if( variation_id != "" ){
						variation_id = variation_id.slice(0, -1);	
					}
					
				} else {
					variation_id = jQuery( MODAL_ID + ".variation_id" ).val();;
				}

			} else if ( variation_by_name > 0 ) {
				variation_id = document.getElementsByName( "variation_id" )[0].value; 
			}

			if ( variation_id == 0 && settings.default_var_id > 0 ) {
				variation_id = settings.default_var_id;
			}

			var time_slot_bookings_placed = "";

			if( variation_id != "" ){
				var field_name 					= "#wapbk_bookings_placed_" + variation_id;	

				if ( jQuery( field_name ).length > 0 ) {
					time_slot_bookings_placed = jQuery( field_name ).val();
				}
			}

			/**
			 * Attribute Lockout Calculation
			 */

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
		}

		/**
		 * Resource Calculation
		 */
		
		var resource_id_selected		= 0;
		var bkap_time_booking_placed 	= "";
		var bkap_booking_placed 	 	= "";

		if ( jQuery( MODAL_FORM_ID + "#bkap_front_resource_selection").length > 0 ) {
			resource_id_selected		= jQuery( MODAL_FORM_ID + "#bkap_front_resource_selection").val();
			bkap_time_booking_placed 	= settings.bkap_booked_resource_data[resource_id_selected]['bkap_time_booking_placed'];
			bkap_booking_placed 		= settings.bkap_booked_resource_data[resource_id_selected]['bkap_booking_placed'];				
		}

		if ( time_slot_value !== "" && date_time_type != "duration" ) {

			var data = {
				checkin_date: 				jQuery( MODAL_ID + "#wapbk_hidden_date" ).val(),
				timeslot_value: 			time_slot_value,
				date_time_type:             date_time_type,
				post_id: 					bkap_process_params.product_id,			
				date_fld_val: 				jQuery( MODAL_DATE_ID + "#booking_calender" ).val(),
				bkap_page: 					settings.bkap_page, // Added when working for timezone : Edit Booking page
				action: 					"bkap_get_time_lockout"
			};

			if ( variation_id != 0 ){
				data.variation_id = variation_id;
				data.bookings_placed = time_slot_bookings_placed;
				data.attr_bookings_placed = attr_bookings_placed;
			}

			if ( resource_id_selected != 0 ){
				data.resource_id = resource_id_selected;
				data.resource_bookings_placed = bkap_time_booking_placed;
			}

			jQuery.post( bkap_process_params.ajax_url, data, function( response ) {
				
				if( global_settings.booking_availability_display === "on" && "" != response.message ) {
					jQuery( MODAL_FORM_ID + "#bkap_show_stock_status" ).html(response.message);
				}
				
				if( response.max_qty != "" && response.max_qty != 0 && response.max_qty != "Unlimited" ){
					var max 				= parseInt( response.max_qty );
				    var max_availability 	= jQuery("input[name=\"quantity\"]");

				    max_availability.attr( "max", max );
				}
			});

		} else {

			if ( date_time_type != "duration" ){
				var data = {
					date: 			jQuery( MODAL_ID + "#wapbk_hidden_date" ).val(),
					post_id: 	  	bkap_process_params.product_id,
					date_fld_val: 	jQuery( MODAL_DATE_ID + "#booking_calender" ).val(),
					action: 	  	"bkap_date_lockout"
				};

				if ( variation_id != 0 && variation_id != "" ){
					jQuery.extend( 	data,
									{ 'variation_id': variation_id,
									  'bookings_placed' : time_slot_bookings_placed,
									  'attr_bookings_placed' : attr_bookings_placed
									} 
								);
				}

				if ( resource_id_selected != 0 ) {
					jQuery.extend( data, { 'resource_id': resource_id_selected, 'resource_bookings_placed' : bkap_booking_placed } );
				}

				jQuery.post( bkap_process_params.ajax_url, data, function( response ) {
					
					if( global_settings.booking_availability_display === "on" && "" != response.message ) {
						jQuery( MODAL_FORM_ID + "#bkap_show_stock_status" ).html( response.message );
					}
					
					if( response.max_qty != "" && response.max_qty != 0 && response.max_qty != "Unlimited" ){
						var max 				= parseInt( response.max_qty );
					    var max_availability 	= jQuery("input[name=\"quantity\"]");

					    max_availability.attr( "max", max );
					}
				});
			}

			
		}

		if ( jQuery( "#time_slot" ).val() != "" ) {
			
			jQuery( ".payment_type" ).show();
			
			if( sold_individually == "yes" ) {
				jQuery( '.quantity input[name="quantity"]' ).hide();
				jQuery( ".payment_type" ).hide();
				jQuery(".partial_message").hide();
			} else {
				jQuery( '.quantity input[name="quantity"]' ).show();
				jQuery( ".payment_type" ).show();
			}

		} else if ( jQuery( "#time_slot" ).val() == "" ) {
			bkap_functions.bkap_disable_qty_and_cart();

			jQuery( ".payment_type" ).hide();
			jQuery( ".partial_message" ).hide();
		}
		// This is called to ensure the variable pricing for time slots is displayed
		bkap_single_day_price();        
    }


function bkap_set_selected_time( block_picker, value ) {

	var selected_block = block_picker.find( '[data-value="' + value + '"]' );
	block_picker.closest( 'ul' ).find( 'a' ).removeClass( 'bkap-duration-selected' );
	selected_block.addClass( 'bkap-duration-selected' );
}

/**
 * Click event on duration box.
 */

function bkap_time_slot_events( settings, global_settings, bkap_settings ) {

	jQuery( MODAL_ID + "#date_time_call" ).val("called");

	jQuery( MODAL_FORM_ID + '.show_time_slot').on( 'click', 'a', function() {
		var value        = jQuery(this).data( 'value' );
		var block_picker = jQuery(this).closest( 'ul' );
		jQuery( MODAL_ID + "#duration_time_slot" ).val( value );
		bkap_set_selected_time( block_picker, value );
		bkap_time_slot_events_calculation( value, "duration" );
		return false;
	});

	/**
	 * Change event on duration box.
	 */
	jQuery( MODAL_FORM_ID + "#show_time_slot" ).on( 'change', ' #time_slot', function() {

		var time_slot_value = jQuery( "#time_slot" ).val();
		
		if (typeof time_slot_value == "undefined") {
			
			var values = new Array();
			
			jQuery.each(jQuery( "input[name=\"time_slot[]\"]:checked" ), function() {
				values.push( jQuery(this).val() );
			});

			if ( values.length > 0 ) {
				time_slot_value = values.join(","); 
			}
		}
		bkap_time_slot_events_calculation( time_slot_value, "on" );		
	});
}



/**
 * This function calculates the price when a 
 * bookable product is being purchased without a date
 *
 * @function multiple_days_function
 * @memberof bkap_process
 * @since 4.1.0
 */
function bkap_purchase_without_date(settings) {

	bkap_functions.bkap_disable_qty_and_cart();

	var variation_id = 0;

	// On some client site the hidden field for the varaition id is not populated using CLASS method. Instead of that it is populating with the NAME.
	// So this fix ensure that if class property does not find then look for the NAME property.
	
	var variation_by_name = document.getElementsByName( "variation_id" ).length;

	if ( jQuery( ".variation_id" ).length > 0 ) {
		
		if ( jQuery( ".variation_id" ).length > 1 ) {
			var variation_id = "";
			jQuery( ".variation_id" ).each( function ( i, obj ) {
				variation_id += jQuery( obj ).val() + ",";
			});
		} else {
			variation_id = jQuery( ".variation_id" ).val();;
		}

	} else if ( variation_by_name > 0 ){
		variation_id = document.getElementsByName( "variation_id" )[0].value; 
	}

	if( variation_id == 0 && settings.default_var_id > 0 ) {
		variation_id = settings.default_var_id;
	}

	var quantity = bkap_functions.bkap_get_qty();

	if ( typeof quantity == "undefined" ) {
		var quantity = 1;
	}

	var data = {
		post_id: 		bkap_process_params.product_id,
		quantity: 		quantity,
		variation_id: 	variation_id,
		action: 		"bkap_purchase_wo_date_price"
	};

	jQuery.post( bkap_process_params.ajax_url, data, function(response) {
		//eval( response );
		if ( response.total_price_calculated != undefined ){
			jQuery( "#total_price_calculated" ).html( response.total_price_calculated );
		}
		if ( response.bkap_price_charged != undefined ){
			jQuery( "#bkap_price_charged" ).html( response.bkap_price_charged );
		}
		if ( response.bkap_no_of_days != undefined ){
			jQuery( "#bkap_price" ).html( response.bkap_price );
		}

		bkap_functions.bkap_enable_qty_and_cart();
		bkap_functions.bkap_show_qty_and_cart();
	});
}

/**
 * This function is used to display the price for 
 * single day bookings
 *
 * @function bkap_single_day_price
 * @memberof bkap_process
 * @since 4.1.0
 */
function bkap_single_day_price() {

	jQuery( MODAL_ID + "#bkap-price-box" ).show();
	
	var settings 		= bkap_functions.settings();
	var bkap_settings 	= bkap_functions.bkap_settings();
	var bkap_labels 	= bkap_functions.bkap_labels();
	var global_settings = bkap_functions.global_settings();

	if ( 'variable' == settings.product_type && global_settings.hide_variation_price == "on" ){
		jQuery( MODAL_FORM_ID + ".woocommerce-variation-price").css( "display", "none" );
	}
	
	var bkap_time_slots = bkap_settings.booking_time_settings;
	var booking_date 	= jQuery( MODAL_ID + "#wapbk_hidden_date" ).val();
	
	bkap_functions.bkap_disable_qty_and_cart();
	
	if ( jQuery( "#wapbk_addon_data" ).length > 0 ) {

		if ( bkap_settings.allow_full_payment != undefined && bkap_settings.allow_full_payment == "yes" ) {

			var allow_full_payment 		= "";
			var default_payment_radio 	= "";
			var deposit_x_days 			= 0;

			var date1 		= new Date();
			var date2 		= bkap_functions.bkap_create_date_obj(booking_date);
			var timeDiff 	= Math.abs( date2.getTime() - date1.getTime() );
			var diffDays 	= Math.ceil( timeDiff / ( 1000 * 3600 * 24 ) ); 

			allow_full_payment 		= bkap_settings.allow_full_payment;
			deposit_x_days 			= bkap_settings.booking_deposit_x_days;
			default_payment_radio 	= bkap_settings.booking_default_payment_radio;

			if ( jQuery( "#wapbk_addon_data" ).val() == "full_payment" ){
				jQuery( ".partial_message" ).hide();
				jQuery( ".payment_type.partial input:radio" ).attr( "disabled", false );
				jQuery( "#wapbk_addon_data" ).val( "full_payment" );
			}

			if ( deposit_x_days > 0 ) {
			    if ( diffDays <= deposit_x_days ) {
					jQuery(".payment_type input:radio:not(:disabled):first-child").attr("checked", true);
					jQuery(".payment_type.partial input:radio").attr("disabled", true);
					jQuery("#wapbk_addon_data").val( "full_payment" );
				 	jQuery(".partial_message").show();
				}
			}
		}
	}

	/**
	 * Execute bkap_js Ajax call to extend the functionality.
	 */

	if ( jQuery( "#extend_booking_calculation" ).length > 0 ) {

		var data = {
			booking_date: 	booking_date,
			post_id: 		bkap_process_params.product_id,
			addon_data:     jQuery( "#extend_booking_calculation" ).val(),
			action: 		"bkap_js"									
		};

		jQuery.post( bkap_process_params.ajax_url, data, function( response ) {		
			eval( response );
		});
	}

	// replacing $addon_price variable
	if ( 'on' != bkap_settings.booking_enable_multiple_day ) {
		
		var quantity = bkap_functions.bkap_get_qty();

		var time_slot_value = "";
		if ( bkap_settings.booking_enable_time == "on" ){
			time_slot_value = jQuery( "#time_slot" ).val();
			if ( typeof time_slot_value == "undefined" ) {
				var values = [];
				jQuery.each( jQuery( "input[name=\"time_slot[]\"]:checked" ), function() {
					values.push( jQuery(this).val() );
				});
				
				if ( values.length > 0 ) {
					time_slot_value = values.join( "," ); 
				}
			}
		} else if ( bkap_settings.booking_enable_time == "duration_time" ) {
			time_slot_value	= jQuery( "#duration_time_slot" ).val();
		}

		// Edit post page issue
		if ( !time_slot_value ) {				
			time_slot_value = settings.time_selected;
		}

		/**
		 * Composite Product Calculations
		 **/

		var composite_data = '';
		if ( 'composite' === settings.product_type ) {
			composite_data = bkap_functions.bkap_get_composite_selections();
		}

		jQuery( MODAL_ID + ".ajax_img" ).show();
		if ( 'composite' !== settings.product_type ) {
			
			var quantity_str = bkap_functions.bkap_get_qty();
			
			if ( typeof quantity_str == "undefined" ) {
				quantity_str = 1;
			}
		} else if ( 'composite' === settings.product_type ) {
			
			var quantity_str = jQuery( "input[name='quantity']" ).prop( "value" );
			
			if ( typeof quantity_str == "undefined" ) {
				quantity_str = 1;
			}
		}

		/**
		 * Group Product Calculations
		 **/

		var qty_list = "NO";

		if ( settings.product_type == "grouped" && settings.wapbk_grouped_child_ids != "" && settings.wapbk_grouped_child_ids != undefined ) {
			var quantity_str 		= "";
			var child_ids 			= settings.wapbk_grouped_child_ids;
			var child_ids_exploded 	= child_ids.split( "-" );

			var arrayLength 		= child_ids_exploded.length;
			var arrayLength 		= arrayLength - 1;

			for ( var i = 0; i < arrayLength; i++ ) {

				var quantity_grp1 = jQuery( "input[name=\"quantity[" + child_ids_exploded[i] +"]\"]" ).attr( "value" );
				
				if ( quantity_str != "" )
					quantity_str = quantity_str  + "," + quantity_grp1;
				else
					quantity_str = quantity_grp1;	
				if ( qty_list != "YES" ) {
					if ( quantity_grp1 > 0 ) {
						qty_list = "YES";
					}
				}	
			}
		}

		/**
		 * Variable Product Calculations
		 **/
		var variation_id = 0;
		if ( settings.product_type != "simple" ) {
			var variation_by_name = document.getElementsByName( MODAL_ID + "variation_id" ).length;

			if ( jQuery( MODAL_ID + ".variation_id" ).length > 0 ) {
				
				if ( jQuery( MODAL_ID + ".variation_id" ).length > 1 ) {
					var variation_id = "";
					jQuery( MODAL_ID + ".variation_id" ).each( function ( i, obj ) {
						if ( jQuery( obj ).val() != "" ) {
							variation_id += jQuery( obj ).val() + ",";	
						}
					});
				} else {
					variation_id = jQuery( MODAL_ID + ".variation_id" ).val();;
				}

			} else if ( variation_by_name > 0 ) {
				variation_id = document.getElementsByName( MODAL_ID + "variation_id" )[0].value; 
			}

			if ( variation_id == 0 && settings.default_var_id > 0 ) {
				variation_id = settings.default_var_id;
			}
		}		
		

		/**
		 * For WooCommerce subscriptions with 'Subscribe All the things'
		 **/
		var custom_data = jQuery(".wcsatt-options-product select option:selected").data('custom_data');    
		var subscription_price = 0;
		if ( custom_data ) {
			if ( custom_data['overrides_price'] == true ) {
				subscription_price = custom_data['subscription_scheme'].price;
			}
		}

		jQuery( ".wcsatt-options-product").on( "change", function(){
		 	custom_data = jQuery(".wcsatt-options-product select option:selected").data('custom_data');
			
			if ( custom_data ) {
				if( custom_data['overrides_price'] == true ) {
					subscription_price = custom_data['subscription_scheme'].price;
				} 
			}
		});

		/**
		 * for bundled products, optional checkbox values need to be passed
		 **/
		var bundle_optional = {};

		if ( jQuery( ".bundled_product_checkbox" ).length > 0 ) {
			
			jQuery( ".bundled_product_checkbox" ).each( function ( i, obj ) {
				
				var bundle_item = jQuery( obj ).attr('name').replace( 'bundle_selected_optional_', '' );

				if ( 'composite' === settings.product_type ) {
					for( c_key in composite_data ){
						bundle_item = bundle_item.replace( 'component_'+c_key+'_', '' );
					};
				}

				if ( jQuery( obj ).attr( "checked" ) ) {
					bundle_optional[bundle_item.toString()] = "on";
				} else {
					bundle_optional[bundle_item.toString()] = "off";
				}
			}); 
		}

		var item_number = '',
			bundle_qty = {};

		if ( jQuery( 'input.bundled_qty' ).length > 0 ) {
			
			jQuery( 'input.bundled_qty' ).each( function ( index, bund_qty ) {
				
				item_number = jQuery( bund_qty ).attr('name').replace( 'bundle_quantity_', '' );
				
				if ( jQuery( bund_qty ).val() ) {
					bundle_qty[item_number.toString()] = jQuery( bund_qty ).val();
				}
			});
		}

		/**
		 * Setup the GF options selected
		 **/
		var gf_options = 0;
		if ( typeof( bkap_functions.update_GF_prices ) === "function" ) {			
			var options = parseFloat( jQuery( ".ginput_container_total" ).find( ".gform_hidden" ).val() );			
			if ( options > 0 ) {
				gf_options = options;
			}  
		}

		/**
		 * Resources Calculations
		 **/
		
		var resource_id = 0;
		CalculatePrice 	= true;
		if ( jQuery( MODAL_FORM_ID + "#bkap_front_resource_selection").length > 0 ) {

			if ( settings.bkap_resource_assigned == "bkap_automatic_resource" ) {
	
				var show_rdate = false;
				for( i=0; i < settings.resource_ids.length; i++){

			    	resource_id_selected 			= settings.resource_ids[i];
					wapbk_resource_lockout 			= settings.bkap_booked_resource_data[ resource_id_selected ][ 'bkap_locked_dates' ];
					wapbk_resource_disaabled_dates 	= settings.resource_disable_dates[ resource_id_selected ];

					var lockoutdates = "";
					if ( wapbk_resource_lockout != "" && wapbk_resource_lockout != undefined ) {
						lockoutdates = JSON.parse("[" + wapbk_resource_lockout + "]");
					}
					if ( wapbk_resource_disaabled_dates != "" && wapbk_resource_disaabled_dates != undefined ) {
						lockoutdates = lockoutdates.concat( wapbk_resource_disaabled_dates );	
					}

					if ( lockoutdates.length > 0 ) {
						for ( iii = 0; iii < lockoutdates.length; iii++ ) {
							if ( jQuery.inArray( booking_date, lockoutdates ) != -1 ) {
							} else {
								show_rdate = true;
								break;
							}
						}
						if ( show_rdate == true ){
							resource_id = resource_id_selected;
							break;
						}
					} else {
						resource_id = resource_id_selected;
						break;
					}
				}

			} else {
				resource_id = jQuery( MODAL_FORM_ID + "#bkap_front_resource_selection").val();
			}
			
			wapbk_resource_lockout 			= settings.bkap_booked_resource_data[ resource_id ]['bkap_locked_dates'];
			wapbk_resource_disaabled_dates 	= settings.resource_disable_dates[ resource_id ];		
			resource_lockoutdates 			= JSON.parse( "[" + wapbk_resource_lockout + "]" );
			resource_lockoutdates   		= resource_lockoutdates.concat( wapbk_resource_disaabled_dates )
			
			if ( jQuery( MODAL_ID + "#wapbk_hidden_date" ).val() != "" ) {

				if ( jQuery.inArray( jQuery( MODAL_ID + "#wapbk_hidden_date" ).val(), resource_lockoutdates ) != -1 ) {
					CalculatePrice = false;
				}
			}				

			if ( !CalculatePrice ) {
				
				jQuery( MODAL_ID + "#wapbk_hidden_date" ).val( "" );
				jQuery( MODAL_DATE_ID + "#booking_calender" ).val( "" );
				bkap_functions.bkap_disable_qty_and_cart();

				var data_notice = {
					post_id: 		bkap_process_params.product_id,
					message: 		bkap_labels.msg_unavailable,
					notice_type: 	"error"
				};

				jQuery.post( bkap_process_params.bkap_permalink + "?wc-ajax=bkap_add_notice", data_notice, function( response ) {
					
					if ( !MODAL_FORM_ID ) {
						jQuery( '.woocommerce-error' ).remove();
						jQuery( ".woocommerce-breadcrumb" ).prepend( response );
						// Scroll to top
						jQuery( 'html, body' ).animate({
							scrollTop: ( jQuery( '.woocommerce-error' ).offset().top - 100 )
						}, 1000 );
					} else if ( MODAL_FORM_ID ) {
						jQuery( MODAL_FORM_ID ).prepend( response );
					}
				});
			}
		}
		
		var all_fields_set = true;		
		if ( bkap_settings.booking_enable_time == "duration_time" || bkap_settings.booking_enable_time == "on" ) {
			if ( "on" == global_settings.hide_booking_price ) {
				if ( time_slot_value == "" || typeof time_slot_value == "undefined" ) {
					all_fields_set = false;
					jQuery( MODAL_ID + "#bkap-price-box" ).hide();
				}
			}			
		}

		if ( all_fields_set && CalculatePrice ) {
			
			var data_call = {
				id: 			bkap_process_params.product_id,
				bkap_date: 		jQuery( MODAL_ID + "#wapbk_hidden_date" ).val(),
				quantity: 		quantity_str,
				action: 		"bkap_date_datetime_price"
			};

			if ( time_slot_value != "" ) {
				
				data_call.date_time_type 	= bkap_settings.booking_enable_time;
				data_call.timeslot_value 	= time_slot_value;

				if ( jQuery( "#wapbk_number_of_timeslots" ).length > 0 ) // When multiple timeslots are there.
					data_call.timeslots = jQuery( "#wapbk_number_of_timeslots" ).val();
			}

			if ( variation_id != 0 )
				data_call.variation_id = variation_id;

			if ( resource_id != 0 )
				data_call.resource_id = resource_id;

			if ( gf_options != 0 )
				data_call.gf_options = gf_options;

			if ( jQuery( "#wapbk_addon_data" ).length > 0 ){
				data_call.addon_data = jQuery( "#wapbk_addon_data" ).val();
			}

			if( !jQuery.isEmptyObject( bundle_optional ) ){
				jQuery.extend( data_call, { 'bundle_optional': JSON.stringify( bundle_optional ),
				 'bundle_qty': JSON.stringify( bundle_qty ) } );
			}

			var bkap_duration = 0;
			if ( jQuery( MODAL_FORM_ID + "#bkap_duration_field").length > 0 ) {
				bkap_duration = jQuery( "#bkap_duration_field" ).val();
			}

			if ( bkap_duration ){
				jQuery.extend( data_call, { 'bkap_duration': bkap_duration,
				bkap_page: settings.bkap_page } );
			}

			if ( composite_data ) {
				jQuery.extend( data_call, { 'composite_data': composite_data } );
			}

			if ( subscription_price > 0 ) {
				jQuery.extend( data_call, { 'sub_price': subscription_price } );
			}

			/*Name Your Price Plugin Compatibility */
			if ( jQuery( "#nyp" ).length > 0 ){
				jQuery.extend( data_call, { 'nyp': jQuery( "#nyp" ).val() } );
			}

			jQuery.post( bkap_process_params.ajax_url, data_call, function(amt) {
				
				jQuery( MODAL_ID + ".ajax_img" ).hide();

				if ( amt.bkap_no_of_days != undefined && time_slot_value != "" ){
					jQuery( "#bkap_no_of_days" ).html( amt.bkap_no_of_days );
				}

				if ( amt.bkap_price != undefined ) {
					jQuery( MODAL_ID + "#bkap_price" ).html( amt.bkap_price );
				}
				if ( amt.bkap_price_charged != undefined ){
					jQuery( MODAL_ID + "#bkap_price_charged" ).val( amt.bkap_price_charged );
				}	
				if ( amt.total_price_calculated != undefined ){
					jQuery( MODAL_ID + "#total_price_calculated" ).val( amt.total_price_calculated );

					/**
		             * Indicates that the price is now updated
		             * 
		             * @event bkap_price_updated
		             * @param {string} bkap_cart_item_key - Cart Item Key
		             * @param {string} options_total - Addon Options Totals
		             * @since 4.2.0
		             */
					jQuery( 'body' ).trigger( 'bkap_price_updated', bkap_process_params.bkap_cart_item_key );
				}
				
				/*if ( isNaN( parseInt( amt ) ) && amt != "" ) {
					// The price will be echoed directly by the respective functions. Hence we just need to eval the response received.
					amt = amt.replace( '"#bkap_price"' , "'" + MODAL_ID + "#bkap_price'" );
					amt = amt.replace( '"#bkap_price_charged"' , "'" + MODAL_ID + "#bkap_price_charged'" );
					amt = amt.replace( '"#total_price_calculated"' , "'" + MODAL_ID + "#total_price_calculated'" );
					eval( amt );
					

				}*/

				if ( settings.wapbk_grouped_child_ids != "" && settings.wapbk_grouped_child_ids != undefined ) {						

					jQuery( ".qty" ).prop( "disabled", false );
					jQuery( ".qty" ).show();
					jQuery( MODAL_ID + "#bkap_price" ).show();
					
					// if time is enabled, then disable the add to cart button unless a time slot has been selected
					if ( bkap_settings.booking_enable_time == "on" && bkap_time_slots !== undefined && bkap_time_slots !== {} ) {
						
						if ( jQuery( "#time_slot" ).val() != "" && typeof time_slot_value != "undefined" && qty_list == "YES" ) {
							jQuery( ".single_add_to_cart_button" ).prop( "disabled", false );
							jQuery( ".single_add_to_cart_button" ).show();
							jQuery( MODAL_ID + "#bkap_price" ).show();
						} else {
							jQuery( ".single_add_to_cart_button" ).prop( "disabled", true );
						}

					} else if ( qty_list == "YES" ) {
						
						jQuery( ".single_add_to_cart_button" ).prop( "disabled", false );
						jQuery( ".single_add_to_cart_button" ).show();
						jQuery( MODAL_ID + "#bkap_price" ).show();

					} else {
						jQuery( ".single_add_to_cart_button" ).prop( "disabled", true );
					}

					if ( amt == 0 ) {
						jQuery( MODAL_ID + "#bkap_price" ).html("Booking is not available for selected quantity");
						jQuery('#total_price_calculated').val("");
						jQuery( ".single_add_to_cart_button" ).prop( "disabled", true );
					}

				} else {
					
					if ( amt == 0 && amt != "" ) {
						jQuery( MODAL_ID + "#bkap_price" ).html("Booking is not available for selected quantity");
						jQuery('#total_price_calculated').val("");
					}
					
					// Perform the necessary actions. Like enabling/disabling the add to cart buttons etc.
					if ( ( bkap_settings.booking_enable_time == "on" || bkap_settings.booking_enable_time == "duration_time" )  && bkap_time_slots !== undefined && bkap_time_slots !== {} ) {
						
						if ( time_slot_value != "" && typeof( time_slot_value ) != "undefined" && 
							 !isNaN( parseInt( variation_id ) ) && jQuery('#total_price_calculated').val() != "" ) {

							bkap_functions.bkap_enable_qty_and_cart();
							bkap_functions.bkap_show_qty_and_cart();
							
							jQuery( MODAL_ID + "#bkap_price" ).show();

						} else {
							if ( amt == 0 ) {
								jQuery( ".single_add_to_cart_button" ).prop( "disabled", true );
								jQuery( ".qty" ).prop( "disabled", false );
							}else{
								bkap_functions.bkap_disable_qty_and_cart();
							}							
							
							jQuery( MODAL_ID + "#bkap_price" ).show();
						}

					} else {
						
						if ( ( !isNaN( parseInt( variation_id ) ) || settings.product_type === 'bundle' || settings.product_type === 'composite' ) 
							&& jQuery('#total_price_calculated').val() ){
							
							bkap_functions.bkap_enable_qty_and_cart();
							bkap_functions.bkap_show_qty_and_cart();
						}
					}
				}

				jQuery( MODAL_FORM_ID + "#bkap_front_resource_selection").val( resource_id );

				// hide the bundle price
				if ( jQuery( ".bundle_price" ).length > 0 ) {
					jQuery( ".bundle_price" ).hide();
				}

				if ( jQuery( '.composite_price' ).length > 0 ) {
					jQuery( '.composite_price' ).hide();
				}

				// WooCommerce Product Add-ons compatibility
				if ( jQuery( "#product-addons-total" ).length > 0 ) {
					

					//var price_per_qty = jQuery( "#bkap_price_charged" ).val() / quantity_str ;
					//jQuery( "#product-addons-total" ).data( "price", price_per_qty );					
					var $cart = jQuery( ".cart" );
					$cart.trigger( "woocommerce-product-addons-update" );
					//bkap_functions.update_wpa_prices();
        			bkap_functions.update_wpa_multiple_prices( bkap_settings, global_settings, settings, bkap_labels );
					
				}

				// Gravity Forms compatibility
				if ( jQuery( ".ginput_container_total" ).length > 0 ){
					if ( typeof( bkap_functions.update_GF_prices ) === "function" ) {
						bkap_functions.update_GF_prices();
					}
				}
			});

			if( bkap_settings.booking_purchase_without_date == 'on' && bkap_settings.booking_confirmation == 'on' ) {
				jQuery('.single_add_to_cart_button').text(bkap_process_params.add_to_cart_labels.bkap_check_availability);
			}
		} else {
			jQuery( MODAL_ID + ".ajax_img" ).hide();
		}
	}
}

/**
 * On Close event for Fixed Blocks
 *
 * @function on_close_fixed_blocks
 * @memberof bkap_process
 * @since 4.1.0
 */
function on_close_fixed_blocks(){

	var current_dt, minDate, split;

	current_dt = jQuery( MODAL_ID + "#wapbk_hidden_date" ).val();

	if ( current_dt !== '' ) {
		split 		= current_dt.split( "-" );
		split[1] 	= split[1] - 1;
		minDate 	= new Date( split[2], split[1], split[0] );
	}

	if ( jQuery( MODAL_ID + "#block_option_enabled" ).val() === "on" && minDate !== '' && minDate !== undefined ) {

		var nod = parseInt( jQuery( MODAL_ID + "#block_option_number_of_day" ).val(), 10 );			
		
		minDate.setDate( minDate.getDate() + nod );

		if ( typeof(checkout_class) !== 'undefined' ) {
			
			jQuery( checkout_class ).datepicker( "setDate", minDate );
			
			// Populate the hidden field for checkout
			var dd 		= minDate.getDate(),
				mm 		= minDate.getMonth()+1, //January is 0!
				yyyy 	= minDate.getFullYear(),
				checkout= dd + "-" + mm + "-"+ yyyy;

			jQuery( MODAL_ID + "#wapbk_hidden_date_checkout" ).val( checkout );
		}
	}
}

/**
 * Set Checkout calendar minDate
 *
 * @function multiple_days_function
 * @memberof bkap_process
 * @param {srting} minDate - min date that shall be considered
 * @param {object} settings - Other Settings JSON
 * @param {object} bkap_settings - Booking Settings JSON
 * @param {object} global_settings - Global Settings JSON
 * @param {string} calendar_type - Inline or normal
 * @param {string} checkout_class - Checkout Class
 * @since 4.1.0
 */
function set_checkout_mindate( minDate, settings, bkap_settings, global_settings, calendar_type, checkout_class ) {

	if ( jQuery( MODAL_ID + "#block_option_enabled" ).val() === "on" && minDate !== '' ) {

		var nod = parseInt( jQuery( MODAL_ID + "#block_option_number_of_day" ).val(), 10 );

		minDate.setDate( minDate.getDate() + nod);

		jQuery( checkout_class ).datepicker( "setDate", minDate );
		
		// Populate the hidden field for checkout
		var dd 			= minDate.getDate(),
			mm 			= minDate.getMonth()+1, //January is 0!
			yyyy 		= minDate.getFullYear(),
			checkout 	= dd + "-" + mm + "-"+ yyyy;

		jQuery( MODAL_ID + "#wapbk_hidden_date_checkout" ).val( checkout );
		
	} else if( bkap_settings.booking_same_day && bkap_settings.booking_same_day === "on" && minDate !== '' ) {
		
		minDate.setDate( minDate.getDate() );
	} else if ( minDate !== '' && minDate !== undefined ) {	

		var enable_minimum 			= '', 
			minimum_multiple_day 	= '';

		if ( bkap_settings.enable_minimum_day_booking_multiple === 'on' ) {

			enable_minimum 			= 'on';
			minimum_multiple_day 	= bkap_settings.booking_minimum_number_days_multiple;

		} else if ( global_settings.minimum_day_booking !== undefined && 
			global_settings.minimum_day_booking === 'on' ) {

			enable_minimum 			= 'on';
			minimum_multiple_day 	= global_settings.global_booking_minimum_number_days;
		}
		
		if ( enable_minimum == "on" ) {
			if( minimum_multiple_day == 0 || !minimum_multiple_day ) {
				minimum_multiple_day = 1;
			}
			minDate.setDate( minDate.getDate() + parseInt( minimum_multiple_day ) );
			minDate = bkap_functions.bkap_checkout_mindate_day_check( minDate, bkap_settings );
		} else {
			minDate.setDate( minDate.getDate() + 1 );
			//minDate = bkap_functions.bkap_checkout_mindate_day_check( minDate, bkap_settings );
		}

	} else {
		minDate = new Date();
		minDate.setDate( minDate.getDate() + 1 );
	}

	jQuery( checkout_class ).datepicker( "option", "minDate", minDate );
	
	if ( calendar_type === 'inline' ) {

		jQuery( checkout_class ).datepicker( "setDate", minDate );
		// Populate the hidden field for checkout

		if ( jQuery( MODAL_ID + "#wapbk_hidden_date_checkout" ).val() === '' ){
			var dd 			= minDate.getDate(),
				mm 			= minDate.getMonth()+1, //January is 0!
				yyyy 		= minDate.getFullYear(),
				checkout 	= dd + "-" + mm + "-"+ yyyy;

			jQuery( MODAL_ID + "#wapbk_hidden_date_checkout" ).val( checkout );
		}
	}
}

/**
 * This functions checks if the selected date range does not have product holidays or 
 * global holidays and sets the hidden date field.
 *
 * @function bkap_set_checkin_date
 * @memberof bkap_process
 * @param {string} date - Current Date Selected
 * @param {object} inst - Instance of the current selection
 * @since 4.1.0
 */
function bkap_set_checkin_date(date,inst){

	var monthValue 		= inst.selectedMonth+1,
		dayValue 		= inst.selectedDay,
		yearValue 		= inst.selectedYear,
		settings 		= bkap_functions.settings(),
		bkap_settings 	= bkap_functions.bkap_settings(),
		global_settings = bkap_functions.global_settings(),
		bkap_labels 	= bkap_functions.bkap_labels(),
		data 			= {},
		current_dt 		= '',
		split 			= [],
		minDate 		= '',
		variation_id 	= 0;


	if ( bkap_settings.enable_inline_calendar === 'on') {
		calendar_type 	= 'inline';
		checkin_class 	= MODAL_DATE_ID + '#inline_calendar';
		checkout_class 	= MODAL_END_DATE_ID + '#inline_calendar_checkout';
	}else {
		calendar_type 	= 'normal';
		checkin_class 	= MODAL_DATE_ID + '#booking_calender';
		checkout_class 	= MODAL_END_DATE_ID + '#booking_calender_checkout';
	}

	if ( jQuery( ".woocommerce-error" ).length > 0 ) {	
		setTimeout( function() {
		    jQuery( ".woocommerce-error" ).remove();
		}, 1000 );
	}

	current_dt = dayValue + "-" + monthValue + "-" + yearValue;
	
	jQuery( MODAL_ID + "#wapbk_hidden_date" ).val(current_dt).trigger('change');

	if ( current_dt !== '' ) {
		split 		= current_dt.split( "-" );
		split[1] 	= split[1] - 1;
		minDate 	= new Date( split[2], split[1], split[0] );
	}

	set_checkout_mindate( minDate, settings, bkap_settings, global_settings, calendar_type, checkout_class );

	// check if maxdate needs to be implemented
	if ( bkap_settings.booking_maximum_number_days_multiple !== undefined && jQuery( "#block_option_enabled" ).val() != "on") {

		// save the existing date that has been selected
		var date_selected 	= jQuery( checkout_class ).datepicker( "getDate" );
		var maximum 		= bkap_settings.booking_maximum_number_days_multiple;
		var maxDate 		= new Date( split[2], split[1], split[0] );

		maxDate.setDate( maxDate.getDate() + parseInt( maximum ) );

		jQuery( checkout_class ).datepicker( "option", "maxDate", maxDate );

		// now check if the date has been modified
		var new_checkout = jQuery( checkout_class ).datepicker( "getDate" );

		if ( date_selected !== null && 
			new_checkout !== null && 
			new_checkout !== date_selected ) {
			
			// if we are in here, it means the checkout date was modified
			// we have to modify the hidden date for checkout
			var dd 				= new_checkout.getDate();
			var mm 				= new_checkout.getMonth()+1; //January is 0!
			var yyyy 			= new_checkout.getFullYear();
			var new_checkout 	= dd + "-" + mm + "-"+ yyyy;

			jQuery( MODAL_ID + "#wapbk_hidden_date_checkout" ).val( new_checkout );
		}
	}

	// On some client site the hidden field for the varaition id is not populated using CLASS method. Instead of that it is populating with the NAME.
	// So this fix ensure that if class property does not find then look for the NAME property.
	
	var variation_by_name 	= document.getElementsByName( MODAL_ID + "variation_id" ).length,
		variation_id_count 	= 0,
		bookings_placed 	= "",
		variation_array 	= [],
		field_name 			= '';
	
	if ( jQuery( MODAL_ID + ".variation_id" ).length > 0 ) {
		
		if ( jQuery( MODAL_ID + ".variation_id" ).length > 1 ) {
			
			variation_id = "";
			
			jQuery( MODAL_ID + ".variation_id" ).each( function ( i, obj ) {
				if( jQuery( obj ).val() != "" ) {
					variation_id += jQuery( obj ).val() + ",";	
				}
				
				variation_id_count++;
			});

		} else {
			variation_id = jQuery( MODAL_ID + ".variation_id" ).val();;
		}

	} else if ( variation_by_name > 0 ) {
		variation_id = document.getElementsByName( MODAL_ID + "variation_id")[0].value; 
	}

	if ( variation_id == 0 && settings.default_var_id > 0 ) {
		variation_id = settings.default_var_id;
	}

	if( variation_id != "" ) {
		if ( variation_id_count > 0 ) {
		
			variation_array = variation_id.split( ',' );
			
			for ( var var_sub_id in variation_array ){
				if ( var_sub_id !== '' && var_sub_id !== undefined ) {
					field_name = "#wapbk_bookings_placed_" + var_sub_id;

					if ( jQuery( field_name ).length > 0 ) {
						bookings_placed += jQuery( field_name ).val() + ',';
					}
				}
			}
		} else {
			field_name = "#wapbk_bookings_placed_" + variation_id;

			if ( jQuery( field_name ).length > 0 ) {
				bookings_placed = jQuery( field_name ).val();
			}
		}
	}

	var attr_bookings_placed = "";

	if ( settings.wapbk_attribute_list != undefined ) {
		var attribute_list = settings.wapbk_attribute_list.split(",");

		for ( i = 0; i < attribute_list.length; i++ ) {

			if ( attribute_list[i] != "" && jQuery( "#" + attribute_list[i] ).val() > 0 ) {

				var field_name = MODAL_ID + "#wapbk_bookings_placed_" + attribute_list[i];
				if ( jQuery( field_name ).length > 0 ) {
					attr_bookings_placed = attr_bookings_placed + attribute_list[i] + "," + jQuery( field_name ).val() + ";";
				}
			}
		}
	}
	
	/*** Resource Calculations Section Start ***/

	var resource_id_selected 			= 0;
	var bkap_resource_booking_placed 	= "";
	var resource_lockoutdates           = [];

	if ( jQuery( MODAL_FORM_ID + "#bkap_front_resource_selection").length > 0 ) {
		if ( settings.bkap_resource_assigned == "bkap_automatic_resource" ) {
			
			var show_rdate = false;
			for( i=0; i < settings.resource_ids.length; i++ ){

		    	resource_id_selected 			= settings.resource_ids[i];

				wapbk_resource_lockout 			= settings.bkap_booked_resource_data[resource_id_selected]['bkap_locked_dates'];
				wapbk_resource_disaabled_dates 	= settings.resource_disable_dates[resource_id_selected];

				var lockoutdates = "";
				if ( wapbk_resource_lockout != "" && wapbk_resource_lockout != undefined ) {
					lockoutdates = JSON.parse("[" + wapbk_resource_lockout + "]");
				}
				if ( wapbk_resource_disaabled_dates != "" && wapbk_resource_disaabled_dates != undefined ) {
					lockoutdates = lockoutdates.concat( wapbk_resource_disaabled_dates );	
				}

				if ( lockoutdates.length > 0 ) {
					
					for ( iii = 0; iii < lockoutdates.length; iii++ ) {
						if ( jQuery.inArray( current_dt, lockoutdates ) != -1 ) {
						} else {
							show_rdate = true;
							break;
						}
					}
					if ( show_rdate == true ){
						resource_id_selected = resource_id_selected;
						break;
					}
				} else {
					resource_id_selected = resource_id_selected;
					break;
				}
			}

			jQuery( MODAL_FORM_ID + "#bkap_resource_label" ).html( '<b>' + settings.bkap_resource_data[resource_id_selected]['resource_title'] + '</b>' );

		} else {
			resource_id_selected = jQuery( MODAL_FORM_ID + "#bkap_front_resource_selection").val();			
		}

		bkap_resource_booking_placed 	= settings.bkap_booked_resource_data[resource_id_selected]['bkap_booking_placed'];

		wapbk_resource_lockout 			= settings.bkap_booked_resource_data[resource_id_selected]['bkap_locked_dates'];
		wapbk_resource_disaabled_dates 	= settings.resource_disable_dates[resource_id_selected];

		resource_lockoutdates 			= JSON.parse("[" + wapbk_resource_lockout + "]");
		resource_lockoutdates   		= resource_lockoutdates.concat(wapbk_resource_disaabled_dates);
	}

	/*** Resource Calculations Section End ***/

	// Availability Display for the date selected only if setting is enabled
	var data = {
		date: 			jQuery( MODAL_ID + "#wapbk_hidden_date" ).val(),
		post_id: 		bkap_process_params.product_id,
		date_fld_val: 	jQuery( MODAL_DATE_ID + "#booking_calender" ).val(), 
		action: 		"bkap_date_lockout"
	};

	if ( variation_id != 0 && variation_id != "" ){
		jQuery.extend( data, { 'variation_id': variation_id, 'bookings_placed' : bookings_placed, 'attr_bookings_placed' : attr_bookings_placed } );
	}

	if ( resource_id_selected != 0 ) {
		jQuery.extend( data, { 'resource_id': resource_id_selected, 'resource_bookings_placed' : bkap_resource_booking_placed } );
	}

	jQuery.post( bkap_process_params.ajax_url, data, function( response ) {
		
		if ( global_settings.booking_availability_display !== undefined && global_settings.booking_availability_display == "on" ) {
			jQuery( MODAL_FORM_ID + "#bkap_show_stock_status" ).html( response.message );
		}
			
		if( response.max_qty != "" && response.max_qty != 0 && response.max_qty != "Unlimited" ){
			var max 				= parseInt( response.max_qty );
		    var max_availability 	= jQuery("input[name=\"quantity\"]");

		    max_availability.attr( "max", max );
		}
	});	

	// Check if any date in the selected date range is unavailable
	if (jQuery( MODAL_ID + "#wapbk_hidden_date" ).val() != "" && jQuery( MODAL_ID + "#wapbk_hidden_date_checkout" ).val() != "" ) {
		
		var CalculatePrice 	= true;
		var split 			= jQuery( MODAL_ID + "#wapbk_hidden_date" ).val().split( "-" );
		split[1] 			= split[1] - 1;		
		var CheckinDate 	= new Date( split[2], split[1], split[0] );
		
		var split 			= jQuery( MODAL_ID + "#wapbk_hidden_date_checkout" ).val().split( "-" );
		split[1] 			= split[1] - 1;
		var CheckoutDate 	= new Date( split[2], split[1], split[0] );
		
		var date 			= new_end = new Date( CheckinDate );
		var m = date.getMonth(), d = date.getDate(), y = date.getFullYear();
		
		var bookedDates 	= JSON.parse( "[" + settings.wapbk_hidden_booked_dates + "]" );
		var holidayDates 	= JSON.parse( "[" + settings.holidays + "]" );
		var count 			= bkap_gd( CheckinDate, CheckoutDate, "days" );
		
		for ( var i = 1; i<=count; i++ ) {
			
			//Locked Dates
			if ( jQuery.inArray(d + "-" + (m+1) + "-" + y,bookedDates) != -1 ) {
				CalculatePrice = false;
				break;
			}

			//Resource Booked date
			if ( jQuery.inArray(d + "-" + (m+1) + "-" + y,resource_lockoutdates) != -1 ) {
				CalculatePrice = false;
				break;
			}

			//Product Holidays
			if ( jQuery.inArray(d + "-" + (m+1) + "-" + y,holidayDates) != -1 ) {
				if( global_settings.booking_include_global_holidays == "on" ) {
					CalculatePrice = true;				
				} else {
					CalculatePrice = false;				
					break;
				}
			}

			new_end = new Date(bkap_ad(new_end,1));
			var m 	= new_end.getMonth(), d = new_end.getDate(), y = new_end.getFullYear();													
		}

		if ( !CalculatePrice ) {
			
			jQuery( MODAL_ID + "#wapbk_hidden_date" ).val( "" );
			jQuery( MODAL_DATE_ID + "#booking_calender" ).val( "" );
			bkap_functions.bkap_disable_qty_and_cart();

			var data = {
				post_id: 		bkap_process_params.product_id,
				message: 		bkap_labels.msg_unavailable,
				notice_type: 	"error"
			};

			jQuery.post( bkap_process_params.bkap_permalink + "?wc-ajax=bkap_add_notice", data, function( response ) {
				
				if ( !MODAL_FORM_ID ) {
					jQuery( '.woocommerce-error' ).remove();
					jQuery( ".woocommerce-breadcrumb" ).prepend( response );
					// Scroll to top
					jQuery( 'html, body' ).animate({
						scrollTop: ( jQuery( '.woocommerce-error' ).offset().top - 100 )
					}, 1000 );
				}else if ( MODAL_FORM_ID ) {
					jQuery( MODAL_FORM_ID ).prepend( response );
				}

			});
		} else {
			bkap_calculate_price();
		}
	}
}

/**
 * This function sets the hidden checkout date for Multiple day booking feature.
 *
 * @function bkap_get_per_night_price
 * @memberof bkap_process
 * @param {string} date - Current Date Selected
 * @param {object} inst - Instance of the current selection
 * @since 4.1.0
 */
function bkap_get_per_night_price(date,inst){
	
	var monthValue 	= inst.selectedMonth+1;
	var dayValue 	= inst.selectedDay;
	var yearValue 	= inst.selectedYear;
	var current_dt 	= dayValue + "-" + monthValue + "-" + yearValue;

	jQuery( MODAL_ID + "#wapbk_hidden_date_checkout" ).val(current_dt);
	
	bkap_calculate_price();
}

/**
 * This function add an ajax call to calculate price and displays the price 
 * on the frontend product page for Multiple day booking feature.
 *
 * @function multiple_days_function
 * @memberof bkap_process
 * @since 4.1.0
 */
function bkap_calculate_price(){

	if ( jQuery( MODAL_ID + "#wapbk_hidden_date" ).length == undefined || jQuery( MODAL_ID + "#wapbk_hidden_date" ).length == 0 ){
		return;
	}

	jQuery( MODAL_ID + "#bkap-price-box" ).show();

	var settings 		= bkap_functions.settings();
	var global_settings = JSON.parse( bkap_process_params.global_settings );
	var bkap_settings 	= bkap_functions.bkap_settings();
	var bkap_labels 	= bkap_functions.bkap_labels();

	var wapbk_hidden_date = jQuery( MODAL_ID + "#wapbk_hidden_date" ).val();
	var wapbk_hidden_date_checkout = jQuery( MODAL_ID + "#wapbk_hidden_date_checkout" ).val();
	
	// Hide variation price is setting is enabled.
	if ( global_settings.hide_variation_price == "on" ){
		jQuery( MODAL_FORM_ID + ".woocommerce-variation-price" ).css( "display", "none" );
	}
	
	bkap_functions.bkap_disable_qty_and_cart(); // Disable the Add to Cart and quantity buttons while the processing is done
	bkap_functions.bkap_hide_wc_notice(); // Hiding error notice of the WooCommerce

	// Check if any date in the selected date range is unavailable
	var CalculatePrice 	= true;
	var CheckinDate 	= bkap_functions.bkap_create_date_obj( wapbk_hidden_date );

	if ( bkap_settings.booking_fixed_block_enable !== undefined && 
			bkap_settings.booking_fixed_block_enable === 'booking_fixed_block_enable' &&
			bkap_settings.bkap_fixed_blocks_data.length ) {
		var days 					= jQuery( "#block_option_number_of_day" ).val();
        var CheckoutDate   			= bkap_functions.bkap_add_days_to_date( CheckinDate, days );
        wapbk_hidden_date_checkout 	= bkap_functions.bkap_create_date( CheckoutDate );
	} else {
		var CheckoutDate 	= bkap_functions.bkap_create_date_obj( wapbk_hidden_date_checkout );
	}
	

	var date = new_end 	= new Date( CheckinDate );
	var m = date.getMonth(),
		d = date.getDate(),
		y = date.getFullYear();

	var bookedDates 	= JSON.parse( "[" + settings.wapbk_hidden_booked_dates + "]" );
	var holidayDates 	= JSON.parse( "[" + settings.holidays + "]" );
	var count 			= bkap_gd( CheckinDate, CheckoutDate, "days" );

	if ( settings.wapbk_same_day == "on" ) {
		count = count + 1;
	}

	/****** Resource Lockout Etart *******/
	if( jQuery( MODAL_FORM_ID + "#bkap_front_resource_selection").length > 0 ) {
		var resource_id_selected = 0;

		if ( settings.bkap_resource_assigned == "bkap_automatic_resource" ) {
			
			var show_rdate = false;
			for( i=0; i < settings.resource_ids.length; i++ ){

		    	resource_id_selected 			= settings.resource_ids[i];

				wapbk_resource_lockout 			= settings.bkap_booked_resource_data[resource_id_selected]['bkap_locked_dates'];
				wapbk_resource_disaabled_dates 	= settings.resource_disable_dates[resource_id_selected];

				var lockoutdates = "";
				if ( wapbk_resource_lockout != "" && wapbk_resource_lockout != undefined ) {
					lockoutdates = JSON.parse("[" + wapbk_resource_lockout + "]");
				}
				if ( wapbk_resource_disaabled_dates != "" && wapbk_resource_disaabled_dates != undefined ) {
					lockoutdates = lockoutdates.concat( wapbk_resource_disaabled_dates );	
				}

				if ( lockoutdates.length > 0 ) {
					for ( iii = 0; iii < lockoutdates.length; iii++ ) {
						if ( jQuery.inArray( d + "-" + (m+1) + "-" + y, lockoutdates ) != -1 ) {
						} else {
							show_rdate = true;
							break;
						}
					}
					if ( show_rdate == true ){
						resource_id_selected = resource_id_selected;
						break;
					}
				} else {
					resource_id_selected = resource_id_selected;
					break;
				}
			}
		} else {
			resource_id_selected 			= jQuery( MODAL_FORM_ID + "#bkap_front_resource_selection").val();
		}
		
		wapbk_resource_lockout 			= settings.bkap_booked_resource_data[resource_id_selected]['bkap_locked_dates'];
		wapbk_resource_disaabled_dates 	= settings.resource_disable_dates[resource_id_selected];		
		var resource_lockoutdates 		= JSON.parse("[" + wapbk_resource_lockout + "]");
		resource_lockoutdates           = resource_lockoutdates.concat(wapbk_resource_disaabled_dates);
	}

	/****** Resource Lockout End *******/

	var variation_id_selected 	= 0;	
	var variation_by_name 		= document.getElementsByName( "variation_id" ).length;
	
	if ( jQuery( ".variation_id" ).length > 0 ) {
		variation_id_selected = jQuery( ".variation_id" ).val();
	} else if ( variation_by_name > 0 ) {
		variation_id = document.getElementsByName( "variation_id" )[0].value; 
	}

	var field_name 				= "#wapbk_lockout_" + variation_id_selected;
	var variation_lockoutdates 	= jQuery( field_name ).val();

	for ( var i = 1; i<= count; i++ ) {
		
		if( jQuery.inArray(d + "-" + (m+1) + "-" + y,bookedDates) != -1 ){ // Booked Dates
			CalculatePrice = false;	
			break;
		} else if( jQuery.inArray(d + "-" + (m+1) + "-" + y,resource_lockoutdates) != -1 ){ // Resource Dates
			CalculatePrice = false;	
			break;
		} else if ( jQuery.inArray(d + "-" + (m+1) + "-" + y, holidayDates ) != -1 ) { // Product Holidays
			if ( global_settings.booking_include_global_holidays == "on" ) {
				CalculatePrice = true;				
			} else {
				CalculatePrice = false;				
				break;
			}
		}

		if ( typeof variation_lockoutdates != "undefined" ) {
			if ( variation_lockoutdates.indexOf( new_end ) > -1 ) {
				CalculatePrice = false;	
				break;
			}
		}

		new_end = new Date(bkap_ad(new_end,1));
		var m 	= new_end.getMonth(), d = new_end.getDate(), y = new_end.getFullYear();
	}

	if ( bkap_settings.booking_enable_multiple_day === 'on' ) {
		
		var bkap_rent = JSON.parse( "[" + settings.bkap_rent + "]" );

		// Variation Lockout Booked
		var variation_id_selected 	= 0;		
		var variation_by_name 		= document.getElementsByName( "variation_id" ).length;
		
		if ( jQuery( ".variation_id" ).length > 0 ) {
			variation_id_selected = jQuery( ".variation_id" ).val();
		} else if( variation_by_name > 0 ){
			variation_id = document.getElementsByName( "variation_id" )[0].value; 
		}

		var field_name 				= "#wapbk_lockout_checkout_" + variation_id_selected;
		var variation_lockoutdates  = "";
		if ( jQuery( field_name ).val() ){
			var field_name_str  	= jQuery( field_name ).val();
            field_name_str      	= field_name_str.replace( /\"/g, "" );
			variation_lockoutdates 	= field_name_str.split(",");
		}

		var date = new_end 			= new Date(CheckinDate);
		var m = date.getMonth(), d 	= date.getDate(), y = date.getFullYear();
		
		for ( var i = 1; i<= count; i++ ) {
			
			if( jQuery.inArray(d + "-" + (m+1) + "-" + y,bkap_rent) != -1 ) {
				CalculatePrice = false;
				break;
			}

			if( jQuery.inArray(d + "-" + (m+1) + "-" + y,variation_lockoutdates) != -1 ) {
				CalculatePrice = false;
				break;
			}

			new_end = new Date(bkap_ad(new_end,1));
			var m = new_end.getMonth(), d = new_end.getDate(), y = new_end.getFullYear();
		}

		if ( CalculatePrice && global_settings.booking_include_global_holidays != "on" ) {
			CalculatePrice = bkap_functions.bkap_check_disable_day_between_checkin_checkout( CalculatePrice, date, CheckoutDate, bkap_settings );
		}
	}

	if ( !CalculatePrice ) {
		
		jQuery( MODAL_ID + "#wapbk_hidden_date_checkout" ).val("");
		jQuery( MODAL_END_DATE_ID + "#booking_calender_checkout" ).val("");
		
		bkap_functions.bkap_disable_qty_and_cart();

		var data = {
			post_id: 		bkap_process_params.product_id,
			message: 		bkap_labels.msg_unavailable,
			notice_type: 	"error"
		};

		setTimeout( function(){
			jQuery.post( bkap_process_params.bkap_permalink + "?wc-ajax=bkap_add_notice", data, function( response ) {
				if ( !MODAL_FORM_ID ) {
					jQuery( '.woocommerce-error' ).remove();
					jQuery( ".woocommerce-notices-wrapper" ).prepend( response );
					// Scroll to top
					jQuery( 'html, body' ).animate({
						scrollTop: ( jQuery( '.woocommerce-notices-wrapper' ).offset().top - 100 )
					}, 1000 );
				}else if ( MODAL_FORM_ID ) {
					jQuery( MODAL_FORM_ID ).prepend( response );
				}
			});
		});
	}

	// Calculate the price	
	if ( CalculatePrice && bkap_settings.booking_enable_multiple_day === 'on' ) {
		
		var sold_individually 	= settings.sold_individually;
		var value_charge 		= 0;
		if ( bkap_settings.booking_charge_per_day && bkap_settings.booking_charge_per_day == 'on' ) {
			value_charge = 1;
		}

		var diffDays 	= bkap_functions.bkap_date_utc( CheckinDate, CheckoutDate );
		diffDays 		= diffDays + value_charge;
		
		if ( diffDays == 0 ) {
			diffDays = 1;
		}

		jQuery( MODAL_ID + "#wapbk_diff_days" ).val( diffDays );

		if ( 'composite' !== settings.product_type ) {
			var quantity_str = bkap_functions.bkap_get_qty();
			if ( typeof quantity_str == "undefined" ) {
				quantity_str = 1;
			}
		}else if ( 'composite' === settings.product_type ) {
			var quantity_str = jQuery( "input[name='quantity']" ).prop( "value" );
			if ( typeof quantity_str == "undefined" ) {
				quantity_str = 1;
			}
		}

		// for grouped products
		var qty_list = "NO";
		
		if ( settings.wapbk_grouped_child_ids.length > 0 && settings.wapbk_grouped_child_ids != "" ) {
			var quantity_str 		= "";
			var child_ids 			= settings.wapbk_grouped_child_ids;
			var child_ids_exploded 	= child_ids.split( "-" );

			var arrayLength 		= child_ids_exploded.length;
			var arrayLength 		= arrayLength - 1;

			for ( var i = 0; i < arrayLength; i++ ) {
				
				var quantity_grp1 = jQuery( "input[name=\"quantity[" + child_ids_exploded[i] +"]\"]" ).prop( "value" );
				
				if ( quantity_str != "" )
					quantity_str = quantity_str  + "," + quantity_grp1;
				else
					quantity_str = quantity_grp1;
				
				if ( qty_list != "YES" ) {
					if ( quantity_grp1 > 0 ) {
						qty_list = "YES";
					}
				}
			}
		}

		// for variable products
		var variation_id = 0;

		// On some client site the hidden field for the varaition id is not populated using CLASS method. Instead of that it is populating with the NAME.
		// So this fix ensure that if class property does not find then look for the NAME property.
		
		var variation_by_name = document.getElementsByName( "variation_id" ).length;
		if ( jQuery( MODAL_ID + ".variation_id" ).length > 0 ) {
			
			if ( jQuery( MODAL_ID + ".variation_id" ).length > 1 ) {
				var variation_id = "";
				jQuery( MODAL_ID + ".variation_id" ).each( function ( i, obj ) {
					variation_id += jQuery( obj ).val() + ",";
				});
			} else {
				variation_id = jQuery( MODAL_ID + ".variation_id" ).val();;
			}

		}else if( variation_by_name > 0 ){
			variation_id = document.getElementsByName( MODAL_ID + "variation_id" )[0].value; 
		}
		
		var composite_data = '';

		if ( 'composite' === settings.product_type ) {
			composite_data = bkap_functions.bkap_get_composite_selections();
		}

		if ( variation_id == 0 && settings.default_var_id > 0 ) {
			variation_id = settings.default_var_id;
		}

		// for bundled products, optional checkbox values need to be passed
		var bundle_optional = {};

		if ( jQuery( ".bundled_product" ).length > 0 ) {
			
			jQuery( ".bundled_product" ).each( function ( i, obj ) {

				if ( jQuery( this ).find( '.bundled_product_checkbox' ).length > 0 ){ // if product is optional
					
					jQuery( this ).find( '.bundled_product_checkbox' ).each( function( ii, objj ) {
						var bundle_item = jQuery( objj ).attr('name').replace( 'bundle_selected_optional_', '' );
						if ( 'composite' === settings.product_type ) {
							for( c_key in composite_data ){
								bundle_item = bundle_item.replace( 'component_'+c_key+'_', '' );
							};
						}

						if ( jQuery( objj ).attr( "checked" ) ) {
							bundle_optional[bundle_item.toString()] = "on";
						} else {
							bundle_optional[bundle_item.toString()] = "off";
						}
					});
				} else {
					jQuery( this ).find( '.cart' ).each( function( ii, objj ) {
						var bundle_item = jQuery( objj ).data('bundled_item_id').toString();
						if ( 'composite' === settings.product_type ) {
							for( c_key in composite_data ){
								bundle_item = bundle_item.replace( 'component_'+c_key+'_', '' );
							};
						}
						bundle_optional[bundle_item.toString()] = "on";
					});
				}
			}); 
		}

		var item_number = '',
			bundle_qty = {};
		
		if ( jQuery( 'input.bundled_qty' ).length > 0 ) {
			
			jQuery( 'input.bundled_qty' ).each( function ( index, bund_qty ) {
				
				item_number = jQuery( bund_qty ).attr('name').replace( 'bundle_quantity_', '' );
				
				if ( jQuery( bund_qty ).val() ) {
					bundle_qty[item_number.toString()] = jQuery( bund_qty ).val();
				}
			});
		}

		jQuery( MODAL_ID + ".ajax_img" ).show();

		booking_date = jQuery( MODAL_ID + "#wapbk_hidden_date" ).val();
		// removing bkap_js ajax call
		if ( jQuery( "#wapbk_addon_data" ).length > 0 ) {

			if ( bkap_settings.allow_full_payment != undefined && bkap_settings.allow_full_payment == "yes" ) {

				var allow_full_payment 		= "";
				var default_payment_radio 	= "";
				var deposit_x_days 			= 0;

				var date1 		= new Date();
				var date2 		= bkap_functions.bkap_create_date_obj(booking_date);
				var timeDiff 	= Math.abs( date2.getTime() - date1.getTime() );
				var diffDays 	= Math.ceil( timeDiff / ( 1000 * 3600 * 24 ) ); 

				allow_full_payment 		= bkap_settings.allow_full_payment;
				deposit_x_days 			= bkap_settings.booking_deposit_x_days;
				default_payment_radio 	= bkap_settings.booking_default_payment_radio;

				if ( jQuery( "#wapbk_addon_data" ).val() == "full_payment" ){
					jQuery( ".partial_message" ).hide();
					jQuery( ".payment_type.partial input:radio" ).attr( "disabled", false );
					jQuery( "#wapbk_addon_data" ).val( "full_payment" );
				}

				if ( deposit_x_days > 0 ) {
				    if ( diffDays <= deposit_x_days ) {
						jQuery(".payment_type input:radio:not(:disabled):first-child").attr("checked", true);
						jQuery(".payment_type.partial input:radio").attr("disabled", true);
						jQuery("#wapbk_addon_data").val( "full_payment" );
					 	jQuery(".partial_message").show();
					}
				}
			}
		}
		
		/**
		 * Execute bkap_js Ajax call to extend the functionality.
		 */

		if ( jQuery( "#extend_booking_calculation" ).length > 0 ) {

			var data = {
				booking_date: 	booking_date,
				post_id: 		bkap_process_params.product_id,
				addon_data:     jQuery( "#extend_booking_calculation" ).val(),
				action: 		"bkap_js"									
			};

			jQuery.post( bkap_process_params.ajax_url, data, function( response ) {		
				eval( response );
			});
		}

		// setup the GF options selected
		var gf_options = 0;
		if ( typeof( bkap_functions.update_GF_prices ) === "function" ) {
			var options = parseFloat( jQuery( ".ginput_container_total" ).find( ".gform_hidden" ).val() );
			if ( options > 0 ) {
				gf_options = options;
			}  
		}

		var attribute_data = bkap_process_params.attr_fields_str;

		if( !( Object.getOwnPropertyNames( attribute_data ).length === 0 ) ){
		
			for ( var attribute_data_key in attribute_data ) {
				//attribute_data[ attribute_data_key ] = eval( attribute_data[ attribute_data_key ] );
				attribute_data[ attribute_data_key ] = jQuery( '[name=\"'+attribute_data_key+'\"]').val();
			}
		}

		if ( jQuery( MODAL_ID + "#wapbk_hidden_date" ).val() != "" ) {

			jQuery( 'body' ).trigger( 'bkap_before_price_updated', bkap_process_params.bkap_cart_item_key );
			
			var data = {
				current_date: 		wapbk_hidden_date_checkout,
				checkin_date: 		wapbk_hidden_date,
				attribute_selected: jQuery( "#wapbk_variation_value" ).val(),
				currency_selected: 	jQuery( ".wcml_currency_switcher" ).val(),
				block_option_price: jQuery( "#block_option_price" ).val(),
				post_id: 			bkap_process_params.product_id,
				diff_days:  		jQuery( MODAL_ID + "#wapbk_diff_days" ).val(),
				quantity: 			quantity_str,  
				variation_id: 		variation_id, 
				gf_options: 		gf_options,
				resource_id: 		resource_id_selected,
				action: 			"bkap_get_per_night_price",
				product_type: 		settings.product_type,
			};

			if ( jQuery( "#wapbk_addon_data" ).length > 0 ){
				data.addon_data = jQuery( "#wapbk_addon_data" ).val();
			}

			if ( !jQuery.isEmptyObject( bundle_optional ) ||  !jQuery.isEmptyObject( bundle_qty ) ){
				jQuery.extend( data, { 'bundle_optional': JSON.stringify( bundle_optional ),
				 'bundle_qty': JSON.stringify( bundle_qty ) } );
			}
			
			if( !( Object.getOwnPropertyNames( attribute_data ).length === 0 ) ){
				jQuery.extend( data, attribute_data );
			}

			/*Name Your Price Plugin Compatibility */
			if ( jQuery( "#nyp" ).length > 0 ){
				jQuery.extend( data, { 'nyp': jQuery( "#nyp" ).val() } );
			}
			
			if ( composite_data ) {
				jQuery.extend( data, { 'composite_data': composite_data } );
			}
			
			jQuery.post( bkap_process_params.ajax_url, data, function(response) {
				
				jQuery( MODAL_ID + ".ajax_img" ).hide();	

				jQuery( MODAL_FORM_ID + "#bkap_front_resource_selection").val( resource_id_selected );

				if ( response.bkap_no_of_days != undefined ){
					jQuery( "#bkap_no_of_days" ).html( response.bkap_no_of_days );
				}
				if ( response.bkap_price != undefined ) {
					jQuery( MODAL_ID + "#bkap_price" ).html( response.bkap_price );
				}
				if ( response.bkap_price_charged != undefined ){
					jQuery( MODAL_ID + "#bkap_price_charged" ).val(response.bkap_price_charged);
				}	
				if ( response.total_price_calculated != undefined ){
					jQuery( MODAL_ID + "#total_price_calculated" ).val(response.total_price_calculated);
					jQuery( 'body' ).trigger( 'bkap_price_updated', bkap_process_params.bkap_cart_item_key );
				}

				/*if ( isNaN( parseInt( response ) ) ) {
					response = response.replace( '"#bkap_price"' , "'" + MODAL_ID + "#bkap_price'" );
					response = response.replace( '"#bkap_price_charged"' , "'" + MODAL_ID + "#bkap_price_charged'" );
					response = response.replace( '"#total_price_calculated"' , "'" + MODAL_ID + "#total_price_calculated'" );
					
					eval( response );
					
					jQuery( 'body' ).trigger( 'bkap_price_updated', bkap_process_params.bkap_cart_item_key );
				}*/

				if ( settings.wapbk_grouped_child_ids != "" ) {
					
					jQuery( ".qty" ).prop( "disabled", false );
					jQuery( ".qty" ).show();

					if ( qty_list == "YES" ) {
						jQuery( ".single_add_to_cart_button" ).prop( "disabled", false );
						jQuery( ".single_add_to_cart_button" ).show();
					} else {
						jQuery( ".single_add_to_cart_button" ).prop( "disabled", true );
					}

				} else {
					
					if ( ( !isNaN( parseInt( variation_id ) ) || settings.product_type === 'bundle' || settings.product_type === 'composite' ) 
							&& jQuery('#total_price_calculated').val() ){
						
						bkap_functions.bkap_enable_qty_and_cart();
						bkap_functions.bkap_show_qty_and_cart();
					} else if ( variation_id === undefined ){
						bkap_functions.bkap_disable_qty_and_cart();
					}
				}

				jQuery( ".payment_type" ).show();
				
				if ( sold_individually == "yes" ) {
					jQuery( '.quantity  input[name="quantity"]' ).hide();
				} else {
					jQuery( '.quantity  input[name="quantity"]' ).show();
				}

				// hide the bundle price
				if ( jQuery( ".bundle_price" ).length > 0 ) {
					jQuery( ".bundle_price" ).hide();
				}

				if ( jQuery( '.composite_price' ).length > 0 ) {
					jQuery( '.composite_price' ).hide();
				}

				// WooCommerce Product Add-ons compatibility
				if ( jQuery( "#product-addons-total" ).length > 0 ) {
					var $cart = jQuery( ".cart" );
					$cart.trigger( "woocommerce-product-addons-update" );
        			bkap_functions.update_wpa_multiple_prices( bkap_settings, global_settings, settings, bkap_labels );
				}

				// Gravity Form Compatibility
				if ( jQuery( ".ginput_container_total" ).length > 0 ) {

					// Update the GF product addons total
					if ( typeof( bkap_functions.update_GF_prices ) === "function" ) {
						// Reason of adding the setTimeout function is WC GF Addons plugin has added Timeout with 1000
						// So when calculating price from our plugin, price is being overwritten by WC GF Addons
						setTimeout( function() {
						    bkap_functions.update_GF_prices();
						}, 500 );
					}
				}
			});

			if( bkap_settings.booking_purchase_without_date == 'on' && bkap_settings.booking_confirmation == 'on' ) {
				jQuery('.single_add_to_cart_button').text(bkap_process_params.add_to_cart_labels.bkap_check_availability);
			}
		} else {
			jQuery( MODAL_ID + ".ajax_img" ).hide();
		}
	}
}

/**
 * Process Check-in date selected
 *
 * @function checkin_date_process
 * @memberof bkap_process
 * @param {string} current_dt - Current Date Selected
 * @param {string} calendar_id - Calendar ID
 * @since 4.1.0
 */
function checkin_date_process( current_dt, calendar_id ) {
	
	var settings 		= bkap_functions.settings();
	var bkap_settings 	= bkap_functions.bkap_settings();
	var global_settings = bkap_functions.global_settings();
	
	var calendar_id;
	
	if ( calendar_id ) {
		calendar_id = '#inline_calendar_checkout';
	} else {
		calendar_id = '#booking_calender_checkout';
	}

	if ( calendar_id && jQuery( calendar_id ).val() != "" ) {
		var checkout;
		
		if ( jQuery( "#wapbk_hidden_date_checkout" ).val() != "" ) {
			checkout = jQuery( "#wapbk_hidden_date_checkout" ).val();
		} else { // this is used to set first time when we click the checkin date.
			var dd 		= minDate.getDate();
		   	var mm 		= minDate.getMonth()+1; //January is 0!
		   	var yyyy 	= minDate.getFullYear();
		   	checkout 	= dd + "-" + mm + "-"+ yyyy;
		}

		jQuery( "#wapbk_hidden_date_checkout" ).val( checkout );
	}
	
	// This is to ensure that the hidden fields are populated and prices recalculated when users switch between date ranges
	if( jQuery( "#wapbk_hidden_date_checkout" ).val() != "" && jQuery( "#wapbk_hidden_date" ).val() != "" ) {
 		
 		var dd 					= minDate.getDate();
		var mm 					= minDate.getMonth()+1; //January is 0!
		var yyyy 				= minDate.getFullYear();
		var checkout 			= dd + "-" + mm + "-"+ yyyy;
		var new_checkout_date 	= new Date(yyyy,mm,dd);
		
		var split_hidden 		= jQuery( "#wapbk_hidden_date_checkout" ).val().split( "-" );
		var existing_hidden_checkout = new Date( split_hidden[2], split_hidden[1], split_hidden[0] );
		
		if ( new_checkout_date > existing_hidden_checkout ) {
			jQuery( "#wapbk_hidden_date_checkout" ).val( checkout );
		}

		bkap_calculate_price();
	}
}

jQuery(document).on( "change", "#bkap_front_resource_selection", function() {
	
	var bkap_settings 	= JSON.parse( bkap_process_params.bkap_settings );

	if ( jQuery( "#inline_calendar" ).length > 0 ) {
		jQuery( "#inline_calendar" ).datepicker( "refresh" );
	}

	if ( jQuery( "#inline_calendar_checkout" ).length > 0 ) {
		jQuery( "#inline_calendar_checkout" ).datepicker( "refresh" );
	}
	
	if ( bkap_settings.booking_recurring_booking == "on" && bkap_settings.booking_enable_multiple_day != "on" ) {

		if ( jQuery( MODAL_ID + "#wapbk_hidden_date" ).val() != "" )
			bkap_process_date(jQuery( "#wapbk_hidden_date" ).val());

		
	} else if ( bkap_settings.booking_enable_multiple_day == "on" ) {
		
		if ( jQuery( MODAL_ID + "#wapbk_hidden_date" ).val() != "" && jQuery( MODAL_ID + "#wapbk_hidden_date_checkout" ).val() != "" ){
			
			bkap_process_date(jQuery( "#wapbk_hidden_date" ).val());
			bkap_calculate_price();
		}
	}	
});

jQuery( document ).ready(function($) {

	$('.ui-datepicker').addClass( 'notranslate' ); // Do not translate the calendar when translated using google translator

	var max_width  = 0;
	var max_height = 0;

	$('.bkap_block a').each(function() {
		var width  = $(this).width();
		var height = $(this).height();
		if ( width > max_width ) {
			max_width = width;
		}
		if ( height > max_height ) {
			max_height = height;
		}
	});

	$('.bkap_block a').width( max_width );
	$('.bkap_block a').height( max_height );

	if ( typeof( bkap_process_params ) !== 'undefined' ) {

		bkap_process_init( jQuery, bkap_process_params );
		
		if ( jQuery( "#wapbk_hidden_date" ).val() != "" ) {
			
			var global_settings = bkap_functions.global_settings(),
				bkap_settings 	= bkap_functions.bkap_settings(),
				settings 		= bkap_functions.settings();

			if ( bkap_settings.booking_enable_multiple_day != "on" ) {
				if ( settings.bkap_page == "product" && settings.product_type == "variable" ) {				
					if ( bkap_settings.enable_inline_calendar == "on" ) {
						if ( bkap_settings.booking_enable_time == "on" ) {					
						    bkap_process_date( jQuery( "#wapbk_hidden_date" ).val() );				    
						} else {               
					        bkap_single_day_price();
						}
					}
				}
			}	
		}
		bkap_functions.doc_ready_other_plugin_actions(); // Performing action for other plugins when document is completely loaded.
	}

	if ( typeof( bkap_process_params ) !== 'undefined' && bkap_process_params.on_change_attr_list !== '' ) {

		jQuery( document ).on( "change", "select" + bkap_process_params.on_change_attr_list, function() {

				var settings 		= bkap_functions.settings();
				var bkap_settings 	= bkap_functions.bkap_settings();
				var global_settings = bkap_functions.global_settings();

				if ( bkap_settings.booking_purchase_without_date != "on" && global_settings.hide_variation_price == "on" ){
					jQuery( MODAL_FORM_ID + ".woocommerce-variation-price" ).css( "display", "none" );
				}
			
				// Refresh the datepicker to ensure the correct dates are displayed as available when an attribute is changed
				if ( jQuery( "#inline_calendar" ).length > 0 ) {
					jQuery( "#inline_calendar" ).datepicker( "refresh" );
				}

				var variation_id_selected = 0;

				// On some client site the hidden field for the varaition id is not populated using CLASS method. Instead of that it is populating with the NAME.
				// So this fix ensure that if class property does not find then look for the NAME property.
				
				var variation_by_name = document.getElementsByName( "variation_id" ).length;

				if ( jQuery( ".variation_id" ).length > 0 ) {
					variation_id_selected = jQuery( ".variation_id" ).val();
				}else if( variation_by_name > 0 ){
					variation_id = document.getElementsByName( "variation_id" )[0].value; 
				}

				if ( jQuery( "#wapbk_hidden_date" ).val() != "" )  {
					// if variation lockout is set the date fields should be reset if the date selected is blocked for thew new variation selected
					var recalculate 			= "YES";
					var field_name 				= "#wapbk_lockout_" + variation_id_selected;
					var variation_lockoutdates 	= jQuery( field_name ).val();
					var date_booked 			= jQuery( "#wapbk_hidden_date" ).val();

					if ( typeof variation_lockoutdates != "undefined" ) {

						if ( variation_lockoutdates.indexOf( date_booked ) > -1 ) {

							recalculate = "NO";	 																	   																		  
							jQuery( "#wapbk_hidden_date" ).val( "" );
							jQuery( "#booking_calender" ).val( "" );
							bkap_functions.bkap_disable_qty_and_cart();
						}
					}

					if ( "YES" == recalculate ) {	
						bkap_process_date( jQuery( "#wapbk_hidden_date" ).val() );

				} else {
					jQuery( "#bkap_show_stock_status" ).html("");
				}

				} else if ( variation_id_selected > 0 ) {
					
					var variation_list = settings.wapbk_var_price_list.split( "," );
					
					for ( i=0; i < variation_list.length; i++ ) {
						
						var price_list = variation_list[i].split( "=>" );
						if ( price_list[0] == variation_id_selected ) {
							jQuery( "#total_price_calculated" ).val( price_list[1] );
							jQuery( "#bkap_price_charged" ).val( price_list[1] );
						}
					}
					if ( "on" == bkap_settings.booking_purchase_without_date ) {
						bkap_purchase_without_date( settings );
					}
				}
			}
		);
	}
  
  /**
   * Calculate Prices when Specific Date drop down is changes
   * @fires event:change
   * @since 4.18.0
   */

	jQuery( "#booking_calender" ).change( function() {
		if ( jQuery("#booking_calender").val() != "" ) {
			var passed_id 		= this.value;
			var exploded_id 	= passed_id.split('&');
			var date_exploded 	= exploded_id[0].split('-');
		    var checkin_date 	= exploded_id[0] ;
	        var month 			= date_exploded[1];
	        var date 			= date_exploded[0];
	        var year 			= date_exploded[2];
	        var default_date_inst = { selectedMonth: parseInt( month ) - 1 , selectedDay: parseInt( date ), selectedYear: parseInt( year ) };
	        bkap_show_times( checkin_date, default_date_inst ); 
		}
	});
});


jQuery( document ).on( "change", "#bkap_duration_field", function() {
	
	jQuery( MODAL_ID + "#duration_time_slot" ).val("");
	
	var bkap_settings = JSON.parse( bkap_process_params.bkap_settings );

	if ( jQuery( "#inline_calendar" ).length > 0 ) {
		jQuery( "#inline_calendar" ).datepicker( "refresh" );
	}

	if ( jQuery( "#inline_calendar_checkout" ).length > 0 ) {
		jQuery( "#inline_calendar_checkout" ).datepicker( "refresh" );
	}
	
	if ( ( bkap_settings.booking_recurring_booking == "on" || bkap_settings.booking_specific_booking == "on" ) && bkap_settings.booking_enable_multiple_day != "on" ) {

		if ( jQuery( MODAL_ID + "#wapbk_hidden_date" ).val() != "" )
			bkap_process_date(jQuery( "#wapbk_hidden_date" ).val());

		
	} else if ( bkap_settings.booking_enable_multiple_day == "on" ) {
		
		if ( jQuery( MODAL_ID + "#wapbk_hidden_date" ).val() != "" && jQuery( MODAL_ID + "#wapbk_hidden_date_checkout" ).val() != "" ){
			
			bkap_process_date(jQuery( "#wapbk_hidden_date" ).val());
			bkap_calculate_price();
		}
	}	
});

/**
 * Calculate Prices when quantity is changed on create booking form.
 * @fires event:click
 * @since 4.15.0
 */
jQuery( '#manual-booking-qty' ).on( 'change', function() {

	var bkap_settings 	= bkap_functions.bkap_settings()
	
	if ( 'on' == bkap_settings.booking_enable_multiple_day ) {
		if ( jQuery( "#wapbk_hidden_date" ).val() != "" && jQuery( "#wapbk_hidden_date_checkout" ).val() != "" ) {
			bkap_calculate_price();
		}
	} else {
		if ( jQuery( "#wapbk_hidden_date" ).val() != "" ) {
			bkap_single_day_price();
		} else if ( "on" == bkap_settings.booking_purchase_without_date ) {
			bkap_purchase_without_date( settings );
		}
	}
});

/**
 * When price is changed in the field by Name Your Price when call price calc function
 * @since 4.15.2
 */
jQuery( '#nyp' ).on( 'change', function() {
	var bkap_settings 	= bkap_functions.bkap_settings()
	
	if ( 'on' == bkap_settings.booking_enable_multiple_day ) {
		if ( jQuery( "#wapbk_hidden_date" ).val() != "" && jQuery( "#wapbk_hidden_date_checkout" ).val() != "" ) {
			bkap_calculate_price();
		}
	} else {
		if ( jQuery( "#wapbk_hidden_date" ).val() != "" ) {
			bkap_single_day_price();
		} else if ( "on" == bkap_settings.booking_purchase_without_date ) {
			bkap_purchase_without_date( settings );
		}
	}
});

/**
 * Converting the price based on the currency : WooCommerce Currency Converter
 * @since 4.15.0
 */
jQuery(document).ready( function(){
	jQuery('body').on( 'bkap_price_updated', function() {
		jQuery('body').trigger( 'wc_currency_converter_calculate' );
	});
});

/**
 * Removing focus from the date fields when clicked on scrolled bar after clicking on date field
 *
 * @since 4.19.2
 */
jQuery( document ).mousedown( function( event ) {
	if ( event.target === jQuery('html')[0] && event.clientX >= document.documentElement.offsetWidth ) {

		if ( jQuery('#booking_calender').length > 0 ) {
			jQuery('#booking_calender').blur();
		}
		if ( jQuery('#booking_calender_checkout').length > 0 ) {
			jQuery('#booking_calender_checkout').blur();
		}
	}
});