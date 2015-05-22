'use strict';

/**
 * @ngdoc function
 * @name uichallengeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the uichallengeApp
 */
angular.module('uichallengeApp')
  .controller('MainCtrl', ['$scope', '$rootScope', '$http', 'uiGmapGoogleMapApi', '$modal', function ($scope, $rootScope, $http, uiGmapGoogleMapApi, $modal) {
    
    $scope.noLocationObj = {
      query: "0.0.0.0",
      country: "",
      regionName: "",
      city: "",
      timezone: "",
      lat: "",
      lon: "",
      isp: ""
    };

  	$scope.location = $scope.noLocationObj;
    $scope.gotLocationOnce = false;
  	$scope.meKey = "me";
  	$scope.websiteKey = "website";
    $scope.website = {};
    $scope.googleMaps = {};
    $scope.myLocationNotPresent = true;

    $scope.map = { 
      center: { latitude: 45, longitude: -73 }, 
      zoom: 4, 
      bounds: {}
    };

    uiGmapGoogleMapApi.then(function(maps) {
      $scope.googleMaps = maps;
      var div = document.getElementById("gmap");
   
      $scope.mapOptions = {
        center: $scope.googleMaps.LatLng($scope.location.lat, $scope.location.lon),
        zoom: 15,
        mapTypeId: $scope.googleMaps.MapTypeId.ROADMAP
      };
  
    });
    
    $scope.markers = [];

  	$scope.isNullOrUndefined = function(elem){
      
  		if (typeof(elem) === "undefined") return true;
  		if (elem === "") return true;
  		if (elem === null) return true;
  		if (angular.equals(elem, {})) return true;
  		if ((Array.isArray(elem)) && (elem.length === 0)) return true;
  		return false;
  	};

  	$scope.onHelpClick = function(field){
  		if ($scope.isNullOrUndefined(field)) return;
  		if ($scope.isNullOrUndefined($scope.location.isp)) return;
  		var now = new Date();
  		window.alert("This is your " + field + " from ISP " + $scope.location.isp + " at " + now.toDateString());
  	};

  	$scope.updateLocationDetails = function(data, who){
      if (who == $scope.meKey){
  		  $scope.location = data;
        $scope.myLocationNotPresent = false;
      }
      else{
        $scope.location = {
          query: data.ip,
          country: data.country_name,
          regionName: data.region_name,
          city: data.city,
          timezone: data.time_zone,
          lat: data.latitude,
          lon: data.longitude,
          isp: data.region_name
        };
      }
  	};

  	$scope.resetLocationDetails = function(){
      $scope.markers[0] = {"id":"nomarker"};
      $scope.myLocationNotPresent = true;
      if ($scope.markers.length === 2){
        $scope.updateLocationDetails($scope.markers[1].data, $scope.websiteKey);
      }else{
        $scope.location = $scope.noLocationObj;
      }
  	};

  	$scope.getMyLocation = function(){
  		var url = "http://ip-api.com/json/";
  		$scope.getLocationInfo(url, $scope.meKey);
  	};

  	$scope.getWebsiteLocation = function(host){
  		if ($scope.isNullOrUndefined(host)) return;
  		var url = "http://freegeoip.net/json/" + host;
  		$scope.getLocationInfo(url, $scope.websiteKey);
  	};
  	
    $scope.mapLocation = function(data, who){
      
  		var newMarker = {
        "id": who,
        "latitude": $scope.location.lat,
        "longitude": $scope.location.lon,
        "title": who,
        "data": data      
      };

      if (who === $scope.meKey){
        $scope.markers[0] = newMarker;
      }else{
        $scope.markers[1] = newMarker;
      }
  	};


  	$scope.getLocationInfo = function(url,who){
      $scope.gotLocationOnce = true;
      
      $http.get(url).success(function(data){        
          $scope.updateLocationDetails(data,who);
          $scope.mapLocation(data, who);        
      }); 
  	};

    $scope.launchWebsiteInput=function(){
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'views/websiteHost.html',
        controller: 'ModalInstanceCtrl',
        resolve: {
          host: function(){
            return $scope.website.host;
          }
        }
      });
      
      modalInstance.result.then(function (host) {
        $scope.getWebsiteLocation(host);
        $scope.website.host = host;
      }, function () {
        return;
      });
      return modalInstance;
    };

  	$scope.markerClicked = function(marker) {
      if($scope.isNullOrUndefined(marker)) {
        return;
      }
      var data = marker.model.data;
      $scope.updateLocationDetails(data,marker.key);
  	};
  }]);

angular.module('uichallengeApp').controller('ModalInstanceCtrl', function ($scope, $modalInstance, host) {

  $scope.website = {};
  $scope.website.host = host;
  $scope.ok = function () {
    $modalInstance.close($scope.website.host);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.hostNameRegex = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/;

  $scope.onEnter = function(evt){
    if(angular.equals(evt.keyCode,13) && !(angular.equals($scope.website.host,null) || angular.equals($scope.website.host,''))){
      $scope.ok();
    }
  };
});
