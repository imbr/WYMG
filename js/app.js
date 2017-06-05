/* 

	TABLE OF CONTENTS:

	1.0 VARIABLES
---------------------------------------------- 
	2.0 FUNCTIONS
---------------------------------------------- 
	3.0 APP INIT
---------------------------------------------- 
	4.0 DOCUMENT
---------------------------------------------- 
	5.0 WINDOW
	
*/


(function () {
"use strict";



/* ------- 1.0 VARIABLES ------- */
var apiURL = 'http://test-api.kuria.tshdev.io';
var popup = $('.popup').remodal({ hashTracking: false });


/* ------- 2.0 FUNCTIONS ------- */
function isJSON(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}



/* ------- 3.0 APP INIT ------- */
Vue.config.productionTip = false;
Vue.config.devtools = false;

var app = new Vue({

    el: '#app',

    data: {
        payments: "",
        
        // Search
        searchValue: "",
        searchStatus: true,
        searchStatusFailMsg: "No search results...",
        
        // Rating
        selectedRating: 0,
        
        // Pagination
        pagination: {},
        currentPagination: 0,
    },

    created: function () {
        this.fetchData();
    },

    watch: {
        searchValue: "resetCurrentPagination",
        selectedRating: "resetCurrentPagination",
    },

    methods: {
        
        increaseCurrentPagination: function() {
            if( this.currentPagination < this.pagination.total - 1 ){
                this.currentPagination++;
                this.fetchData();
            }
        },
        
        decreaseCurrentPagination: function() {
            if( this.currentPagination > 0 ){
                this.currentPagination--;
                this.fetchData();
            }
        },
        
        setCurrentPagination: function( v ) {
            v = parseInt(v);
            if( v >= 0 && v < this.pagination.total ){
                this.currentPagination = v;
                this.fetchData();
            }
        },
        
        resetCurrentPagination: function() {
            this.currentPagination = 0;
        },

        fetchData: function() {
            var self = this;
            $.ajax({
                type : 'GET',
                url  : apiURL,
                data : {"query": self.searchValue, "rating": self.selectedRating, "page": self.currentPagination},
                beforeSend: function() {},
                complete: function() {},
                success: function(json) {
                    if(isJSON(json)===true) {
                        self.searchStatus = true;
                        self.payments = JSON.parse(json);
                        self.pagination = self.payments.pagination;
                    } else {
                        self.searchStatus = false;
                        self.pagination = {};
                    }
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    console.log("Can not connect to API server...");
                }
            });
        },

        resetMethods: function() {
            this.searchValue = "";
            this.selectedRating = 0;
            this.currentPagination = 0;
            this.fetchData();
        },
        
        getPopup: function(event) {
            
            $('.supplier-target').html( $(event.currentTarget).find('td:eq(0)').text() );
            $('.rating-target').html( $(event.currentTarget).find('td:eq(1)').html() );
            $('.reference-target').html( $(event.currentTarget).find('td:eq(2)').html() );
            $('.value-target').html( $(event.currentTarget).find('td:eq(3)').html() );
            
            popup.open();

        }

    }

});
	
	
	
/* ------- 4.0 DOCUMENT ------- */
$( document ).ready(function() {
    
    $( ".box-search .form-element .button" ).on( "click", function(e) {
        e.preventDefault();
    });

});

    

/* ------- 5.0 WINDOW ------- */
$(window).on('load', function () {
    
    $('.preloader-holder').animate({ opacity: 0 }, 300, function(){
        $( this ).css({"display": "none"});
    });
    
});



}());