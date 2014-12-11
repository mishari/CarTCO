/*
    CarTCO calculates the Total Cost of Ownership of buying a car vs other
    transportation options.
    Copyright (C) 2014  Mishari Muqbil

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
angular.module('todoApp', [])
.controller('CostCalculatorController', ['$scope', function($scope) {
  /* Average speed in BKK from
   http://www.otp.go.th/th/pdf/statistic/speed/speed_avg_53.pdf
  converted to KMs per minute*/
  var AVG_SPEED = 0.333; 
  var UBERX_FLAG = 25;
  var UBERX_PERKM = 4.5;
  var UBERX_PERMIN = 1;
  
  var UBERBLK_FLAG = 45;
  var UBERBLK_PERKM = 9.2;
  var UBERBLK_PERMIN = 2.5;
  
  var GRABTAXI_FEE = 25;

  $scope.data = {annualtrips : 730};
  
  $scope.data.financing = true;
  
  $scope.calculateCosts = function() {
    $scope.uberxCost = ($scope.data.annualtrips * UBERX_FLAG) + $scope.data.distance * UBERX_PERKM + ($scope.data.distance / AVG_SPEED) * UBERX_PERMIN;
    $scope.uberblkCost = ($scope.data.annualtrips * UBERBLK_FLAG) + $scope.data.distance * UBERBLK_PERKM + ($scope.data.distance / AVG_SPEED) * UBERBLK_PERMIN;
    $scope.grabTaxiCost = ($scope.data.annualtrips * GRABTAXI_FEE) + calculateTaxi();
    $scope.carCost = calculateCarCosts();
  };
  
  calculateTaxi = function() {
    var fare = 35;
    var increase = 5;
	  
    var distance_per_trip = $scope.data.distance / $scope.data.annualtrips;
  
  	for (running_distance = 2; running_distance < $scope.data.distance ; running_distance++){
  		if(running_distance <= 12){
  			increase =  5;
  		} else if(running_distance > 12 && running_distance <= 20){
  			increase = 5.5;
  		} else if(running_distance > 20 && running_distance <= 40){
  			increase = 6;
  		} else if(running_distance > 40 && running_distance <= 60){
  			increase = 6.5;
  		} else if(running_distance > 60 && running_distance <= 80){
  			increase = 7.5;
  		} else if(running_distance > 80){
  			increase = 8.5;
			}
      
  		fare = fare + increase;
		}
  	return fare
  };
  
  calculateCarCosts = function() {
    var carTCO = 0;
    // Price per year is price of car averaged over several years.
    var price_per_year = $scope.data.price / $scope.data.caryears;
    carTCO += price_per_year;
      
    // Add cost of petrol
    carTCO += ($scope.data.distance / $scope.data.fueleconomy) * $scope.data.fuelcost;
    
    // Add annual registration costs
    carTCO += $scope.data.registration;
    
    // Add annual repair costs
    carTCO += $scope.data.maintenance;
            
    return carTCO;
  };
  
}]);

