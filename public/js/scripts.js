$(document).ready(function () {
    $(document).on('click', '#ajax-button', function (event) {
        event.preventDefault();
        var keyword = $("input[type='search']").val();
        $.ajax({
            url: '/search_products/result',
            type: 'GET',
            data: { keyword: keyword },
            success: function (response) {
                window.location.href = response.redirectUrl;
            },
            error: function (error) {
                console.error('Requête Ajax a échoué:', error);
            }
        });
    });


    
});
