jQuery( document ).ready( function( $ ) {
	// Get query params.
	const bkapUrlParams = new URLSearchParams( window.location.search );

	// Set booking date.
	if ( bkapUrlParams.has( 'bkap_date' ) ) {
		$("#booking_calender").datepicker( 'setDate', new Date( bkapUrlParams.get( 'bkap_date' ) ) );
		// Stimulate click event to setup form data.
		$( '#checkin_cal' ).trigger( 'click' );
		$( '.ui-datepicker-current-day' ).trigger( 'click' );
	}
} );
