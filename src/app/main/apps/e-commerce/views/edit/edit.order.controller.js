(function() {
    'use strict';

    angular
        .module('app.e-commerce')
        .controller('EditOrderController', EditOrderController);

    EditOrderController.$inject = ['$http', '$q', 'toastr', 'apiUrl', 'orderFactory', 'dispensaryFactory', 'dispensaryProductFactory'];

    /* @ngInject */
    function EditOrderController($http, $q, toastr, apiUrl, orderFactory, dispensaryFactory, dispensaryProductFactory) {
        var vm = this;
        var wProductsUrl = null;

        // Methods
        vm.addProduct = addProduct;
        // vm.onCategorySelected = onCategorySelected;
        // vm.getProductMatches = getProductMatches;
        // vm.onProductSelected = onProductSelected;
        // vm.calculateTotal = calculateTotal;
        vm.addOrder = addOrder;

        // Initialize
        activate();
		addProduct();

        ////////////////

        function activate() {
	        // Initialize data immediately
	        var dispensaryId = 266;
	        vm.order = { 
	        	dispensaryId : dispensaryId
	        };
	        vm.price = [];
	        vm.products = [];
	        vm.categories = [];

	        dispensaryFactory.getByDispensary(dispensaryId).then(
	             function (response) {
	                  wProductsUrl = response.weedMapMenu;

	                  dispensaryProductFactory.getDispensaryProducts(wProductsUrl).then(
	                       function (data) {
	                            vm.categories = data.categories;
	                       }
	                  );
	             }
	        ); 

            dispensaryFactory.getByDispensaryDrivers(dispensaryId).then(
	            function(data) {
	                vm.driverData = 
	                	_.filter(data.drivers, 								//jshint ignore:line
	                		function(d) {return d.driverCheckIn});			//jshint ignore:line
	            }
	        );

	        dispensaryFactory.getByDispensaryCustomers(dispensaryId).then(
                function(data) {
                    vm.customerData = data.customers;
	            }
            );
        }

	    function addProduct() {
	    	vm.products.push({ category : undefined, product : undefined, qty : 0 });
	    }

	    function addOrder() {
            var defer = $q.defer();	   
            // If ...
            if (vm.driver) vm.order.driverId = vm.driver.driverId;			//jshint ignore:line
            // If ...
            if (vm.patient) vm.order.customerId = vm.patient.customerId;	//jshint ignore:line

			const products = vm.order.productOrders = [];					//jshint ignore:line
			for (var product in vm.products)								//jshint ignore:line
				products.push({												//jshint ignore:line
					productId: product.productId,	
					orderQty: product.quantity,	
					unitPrice: product.unit.price,	
					total: product.quantity * product.unit.price  
				});	

	    	orderFactory.addOrder(vm.order).then(
	    		function(data) {
	    			$state.go('app.e-commerce.orders');						//jshint ignore:line
				}	
	    	);		
    	};																	//jshint ignore:line

	    vm.onCategorySelected = function(product) {
			product.products = product.category.items;
	    };

	    vm.getProductMatches = function(productRow) {
			var searchTextLower = productRow.searchText.toLowerCase();
			
			return _.filter(productRow.products,											//jshint ignore:line
				function (p) {return p.name.toLowerCase().indexOf(searchTextLower) >= 0}) 	//jshint ignore:line	
		};

		vm.getPatientMatches = function(patient) {
			var searchTextLower = patient.searchText.toLowerCase();
			
			return _.filter(vm.customerData,													//jshint ignore:line
				function (p) {
					return (p.firstName + p.lastName).toLowerCase().indexOf(searchTextLower) >= 0 //jshint ignore:line
				}) 																				//jshint ignore:line
		};

		vm.onPatientSelected = function(patient) {
			const order = vm.order;						//jshint ignore:line

			order.address = patient.street;
			order.unitNo = patient.unitNo;
			order.city = patient.city;
			order.state = patient.state;
			order.zipCode = patient.zipCode;	
			order.deliveryNotes = patient.deliveryNotes;
 	    };

		vm.onProductSelected = function(productRow) {
			productRow.prices = [];
			
			const product = productRow.product;	//jshint ignore:line
			const prices = product.prices;	//jshint ignore:line
			
			for (var unit in prices)	//jshint ignore:line
				productRow.prices.push({unit: unit, price: prices[unit]})	//jshint ignore:line
	    };

	    vm.calculateTotal = function() {
	    	// Taking the first perameter in the vm.order and in each iteration calling function(p) to 
			// return the total cost for the product...iterating through the products array and 
			// keeping a running total of all the calls in the products array.
			// Check to see if quanity or unit has not been filled if so return zero to that product row
			// otherwise return the quantity multiplied by the price of that unit.
	    	 	return _.sumBy(vm.products,	//jshint ignore:line
							function(p) {
								if (!p.quantity || !p.price) return 0;	//jshint ignore:line
									return p.quantity * p.price.price 	//jshint ignore:line
							})	//jshint ignore:line
	    };
    }
})();