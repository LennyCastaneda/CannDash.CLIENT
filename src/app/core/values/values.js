(function() {
    'use strict';

    angular
        .module('cannDash')
        .value('wpUrl', 'https://weedmaps.com/api/web/v1/listings?bounds=%7B%22top_right%22:%7B%22latitude%22:32.8472886646638,%22longitude%22:-116.66313171386719%7D,%22bottom_left%22:%7B%22latitude%22:32.57748482522484,%22longitude%22:-117.81600952148438%7D%7D&only_published=true&size=150&types%5B%5D=delivery')
        .value('apiUrl', 'http://canndashdeveloperapi.azurewebsites.net/api')
        .value('mapUrl', 'AIzaSyB3vfh3bRErYos0ftOCj7LMenzwnoseUag')
        .value( 'weatherApi', 'http://api.openweathermap.org/data/2.5/weather?q=' )
        .value( 'keys', {
        	 weather: '984b19c46e69cfb8e601c2f3cd737950' 
        });
})();
