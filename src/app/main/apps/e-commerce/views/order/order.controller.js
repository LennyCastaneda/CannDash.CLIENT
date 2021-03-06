(function() {
    'use strict';

    angular
        .module('app.e-commerce')
        .controller('OrderController', OrderController);

    /** @ngInject */
    function OrderController(
        $state, 
        $stateParams, 
        Statuses, 
        uiGmapGoogleMapApi, 
        orderFactory) {
        var vm = this;

        // Data
        vm.order = [];
        vm.statuses = Statuses.data;
        vm.dtInstance = {};
        vm.dtOptions = {
            dom: 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            columnDefs: [{
                // Target the id column
                targets: 0,
                width: '72px'
            }, {
                // Target the image column
                targets: 1,
                filterable: false,
                sortable: false,
                width: '80px'
            }, {
                // Target the actions column
                targets: 5,
                responsivePriority: 1,
                filterable: false,
                sortable: false
            }],
            pagingType: 'simple',
            lengthMenu: [10, 20, 30, 50, 100],
            pageLength: 20,
            responsive: true
        };

        vm.newStatus = '';


        // Methods
        vm.gotoOrders = gotoOrders;
        vm.gotoProductDetail = gotoProductDetail;
        vm.updateStatus = updateStatus;
        vm.getAddressFromOrder = getAddressFromOrder;
        vm.getStatusText = getStatusText;
        vm.getDriverFromOrder = getDriverFromOrder;


        // Initialize
        activate();
        init();


        //////////

        function activate() {
            orderFactory.getByOrderId($stateParams.id).then(
                function(data) {
                    vm.order = data.order;
                    vm.order.customer = data.customer;
                    vm.order.driver = data.driver;
                    fetchGoogleMap();
                }
            );
        }

        function init() {
            // Select the correct order from the data.
            // This is an unnecessary step for a real world app
            // because normally, you would request the product
            // with its id and you would get only one product.
            var id = $state.params.id;

            for (var i = 0; i < vm.order.length; i++) {
                if (vm.order[i].id === parseInt(id)) {
                    vm.order = vm.order[i];
                    break;
                }
            }   // END - Select the correct product from the data           
        }

        // Google maps API on Order Detail
        function fetchGoogleMap() {          
            uiGmapGoogleMapApi.then(function (maps) {
                var geocoder = new google.maps.Geocoder();  //jshint ignore:line
                
                geocoder.geocode({'address': getAddressFromOrder(vm.order)}, 
                    function (results, status) { //jshint ignore:line
                        if (status === google.maps.GeocoderStatus.OK) { //jshint ignore:line
                            // console.log(results[0].geometry);
                            vm.deliveryAddressMap = {
                                center: {
                                    latitude: results[0].geometry.location.lat(),
                                    longitude: results[0].geometry.location.lng()
                                },
                                marker: {
                                    id: 'deliveryAddress'
                                },
                                zoom: 13
                            };
                        } else {
                            console.log('Geocode was not successful for the following reason: ' + status);
                        }
                    });
            });
        }

        /**
         * Go to orders grid
         */
        function gotoOrders() {
            $state.go('app.e-commerce.orders');
        }

        /**
         * Go to product grid
         */
        function gotoProductDetail(id) {
            $state.go('app.e-commerce.products.detail', { id: id });
        }

        /**
         * Update order status
         */
        function updateStatus(order) {
            var currentOrder = vm.order;
            
            // Using constant over variable to reduce potential bugs, references stay the same.
            const temp = currentOrder.productOrders;
            
            delete currentOrder.productOrders;

            orderFactory.updateOrder(currentOrder); 
            currentOrder.productOrders = temp;
        }   

        function getAddressFromOrder(order) {
            return order.street + ' ' + order.city + ' ' + order.state + ' ' + order.zipCode;
        }

        function getDriverFromOrder(order) {
            return order.driverId;
        }

        function getStatusText(orderStatus) {
            var status = parseInt(orderStatus);

            switch(status) {
                case 1:
                    return '<span class="status {{status.color}} md-yellow-500-bg">Pending</span>';
                case 2:
                    return '<span class="status {{status.color}} md-pink-500-bg">Cancelled</span>'; 
                case 3:
                    return '<span class="status {{status.color}} md-green-800-bg">Delivered</span>'; 
                default:
                    break;
            }
        }

    }               
})();