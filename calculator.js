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
angular.module('TCOApp', ['pascalprecht.translate'])
.controller('CostCalculatorController', ['$scope', '$translate', function($scope, $translate) {
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

  $scope.currencySYMB = "TH฿ ";


  $scope.data = {
    "financing": true,
    "timevalue": true,
    
    "price": 0,
    "tax": 0,
    "registration": 0,
    "downpayment": 0,
    "apr": 0,
    "monthsfinanced": 0,
    "annualincome": 0,
    "hoursperweek": 0,
    "insurance": 0,
    "distance": 0,
    "annualtrips": 0,
    "fueleconomy": 0,
    "fuelcost": 0,
    "caryears": 0,
    "maintenance": 0,

  };

  $scope.$watchCollection('data', function() {
    $scope.progressbar      = { "max": getProgressbarMax()};
    $scope.carCost          = calculateCarCosts();
    $scope.taxiCost     = calculateTaxiCost();
    $scope.uberxCost        = calculateUberXCost();
    $scope.uberblkCost      = calculateUberBlkCost();
  });

  function getProgressbarMax()
  {
    return 1000000;
  }

  function calculateTaxiCost()
  {
    return $scope.data.annualtrips  + calculateTaxi() || 0;
  }

  function calculateUberXCost()
  {
    return ($scope.data.annualtrips * UBERX_FLAG) + $scope.data.distance * UBERX_PERKM + ($scope.data.distance / AVG_SPEED) * UBERX_PERMIN || 0;
  }

  function calculateUberBlkCost()
  {
    return ($scope.data.annualtrips * UBERBLK_FLAG) + $scope.data.distance * UBERBLK_PERKM + ($scope.data.distance / AVG_SPEED) * UBERBLK_PERMIN || 0;
  }

  function calculateCarCosts()
  {

    // Price per year is price of car averaged over several years.
    var carTCO = $scope.data.price / $scope.data.caryears;

    // If finance, calculate interest
    if ($scope.data.financing) {

      
      carTCO += ($scope.data.monthsfinanced / 12) * ($scope.data.apr / 100) * ( $scope.data.price - $scope.data.downpayment ) / $scope.data.caryears;


    }
    
    if ($scope.data.timevalue) {
      
      var hourlyIncome = $scope.data.annualincome / ( $scope.data.hoursperweek * 52 );
      var hoursTravelled = $scope.data.distance / (AVG_SPEED * 60);
      
      carTCO += hourlyIncome * hoursTravelled;
      
    }
    
    // Add cost of petrol
    carTCO += ($scope.data.distance / $scope.data.fueleconomy) * $scope.data.fuelcost;

    // Add annual registration costs
    carTCO += $scope.data.registration;

    // Add annual repair costs
    carTCO += $scope.data.maintenance;
    

    //default to zero if some field are undefined
    return carTCO || 0;

  };

  function calculateTaxi ()
  {
    var fare = 35;
    var increase = 5;

    var distance_per_trip = $scope.data.distance / $scope.data.annualtrips;

    for (running_distance = 2; running_distance < $scope.data.distance ; running_distance++){
      if(running_distance <= 10){
        increase =  5.5;
      } else if(running_distance > 10 && running_distance <= 20){
        increase = 6.5;
      } else if(running_distance > 20 && running_distance <= 40){
        increase = 7.5;
      } else if(running_distance > 40 && running_distance <= 60){
        increase = 8;
      } else if(running_distance > 60 && running_distance <= 80){
        increase = 9;
      } else if(running_distance > 80){
        increase = 10.5;
      }

      fare = fare + increase;
    }
    return fare
  };

  $scope.reset = function(){
    $scope.data = {
      "financing": true,
      "timevalue": true,
    
      "price": 0,
      "tax": 0,
      "registration": 0,
      "downpayment": 0,
      "apr": 0,
      "monthsfinanced": 0,
      "annualincome": 0,
      "hoursperweek": 0,
      "insurance": 0,
      "distance": 0,
      "annualtrips": 0,
      "fueleconomy": 0,
      "fuelcost": 0,
      "caryears": 0,
      "maintenance": 0,
    
    };
    
  }

  $scope.sample = function(){
    $scope.data = {
      "financing": true,
      "price": 1200000,
      "tax": 17,
      "registration": 2000,
      "downpayment": 200000,
      "apr": 2,
      "monthsfinanced": 60,
      "insurance": 12000,
      "distance": 30000,
      "annualtrips": 520,
      "fueleconomy": 15,
      "fuelcost": 25,
      "caryears": 10,
      "maintenance": 8000,
      "timevalue": true,
      "annualincome": 600000,
      "hoursperweek": 40,
      
    };
  }

  $scope.changeLanguage = function (key) {
    $translate.use(key);
  };

}])

.config(function($translateProvider) {
 $translateProvider.translations('en', {
    PRICEOFCAR: 'Price of car',
    SALESTAX: 'Sales Tax (eg. 7% vat)',
    ANNULAREGISTRATION: 'Annual Registration',
    FINANCING: 'Financing',
    USESFINANCING: 'Uses Financing',
    DOWNPAYMENT: 'Down Payment',
    APR: 'APR',
    MONTHFINANCED: 'Months Financed',
    MONTH: 'Month',
    YEARS: 'Years',
    ANNUALINSURANCE: 'Annual Insurance',
    KILOMETERDRIVENPERYEAR: 'Kilometers Driven Per Year (ex. daily kms x 5 days a week x 52 weeks a year)',
    KM: 'km',
    TRIPSMADEPERYEAR: 'Times car used in a Year (Round trip to work = 2 times per day x 5 days per week x 52 weeks per year = 520)',
    FUELECONOMY: 'Fuel economy',
    FUELCOSTPERLITRE: 'Fuel Cost Per Litre',
    YEARSYOUEXPECTTOOWNTHISCAR: 'Years You Expect To Own This Car',
    ANNUALMAINTENANCEREPAIRCOST: 'Annual Maintenance & Repair Cost (eg. annual checkup, engine oil, tyres, parts etc)',
    OWNCAR: 'Private Car',
    YEARLYEXPENSE: 'Annual expense',
    RESET: 'Reset',
    SHOWSAMPLEDATA: 'Show Sample Data',
    CSSEN: 'btn-primary',
    CSSTH: 'btn-default',

    TIMEVALUE: 'Time Value',
    CALCULATETIMEVALUE: 'Include The Value of your Travelling Time',
    ANNUALINCOME: 'Annual Income',
    HOURSPERWEEK: 'Hours worked per week',
    HOURS: 'Hours',
   
  });
 $translateProvider.translations('th', {
    PRICEOFCAR: 'ราคารถ',
    SALESTAX: 'อัตราภาษีตอนซื้อรถเป็น % (เช่น VAT 7%)',
    ANNULAREGISTRATION: 'ค่าทะเบียนรายปี',
    FINANCING: 'ไฟแนนซ์',
    USESFINANCING: 'ทำไฟแนนซ์',
    DOWNPAYMENT: 'ดาวน์',
    APR: 'ดอกเบี้ยรายปี',
    MONTHFINANCED: 'ผ่อนกี่เดือน',
    MONTH: 'เดือน',
    YEARS: 'ปี',
    ANNUALINSURANCE: 'ประกันรายปี',
    KILOMETERDRIVENPERYEAR: 'กิโลเมตรที่เดินทางต่อปี (ตัวอย่าง: กม.ต่อวัน x 5วันต่ออาทิตย์ x 52 อาทิตย์ต่อปี)',
    KM: 'กม.',
    TRIPSMADEPERYEAR: 'จำนวนครั้งที่ใช้รถต่อปี (ตัวอย่าง: ไปกลับที่ทำงาน = 2 ครั้งต่อวัน x 5วันต่ออาทิตย์ x 52อาทิตย์ต่อปี = 520)',
    FUELECONOMY: ' อัตราการเผาผลาญน้ำมัน (กิโลเมตรต่อลิตร)',
    FUELCOSTPERLITRE: 'ราคาน้ำมันต่อลิตร',
    YEARSYOUEXPECTTOOWNTHISCAR: 'คาดว่าจะใช้รถกี่ปี',
    ANNUALMAINTENANCEREPAIRCOST: 'ค่าบำรุงรายปี (ค่าเช็คระยะ น้ำมันเครื่อง ไส้กรอง ยางรถยนต์ อะไหล่ ฯลฯ)',
    OWNCAR: 'รถยนต์ส่วนตัว',
    RESET: 'เริ่มใหม่',
    SHOWSAMPLEDATA: 'แสดงข้อมูลสมมุติ',
    YEARLYEXPENSE: 'ค่าใช้จ่ายรายปี',
    CSSEN: 'btn-default',
    CSSTH: 'btn-primary',
   
    TIMEVALUE: 'มูลค่าของเวลา',
    CALCULATETIMEVALUE: 'คำนวนค่าของเวลาที่ใช้ในการขับรถ',
    ANNUALINCOME: 'รายได้ต่อปี',
    HOURSPERWEEK: 'จำนวนชั่วโมงที่ทำงานต่อสัปดาห์',
    HOURS: 'ชั่วโมง',
   
   
  });
 $translateProvider.preferredLanguage('th');
})