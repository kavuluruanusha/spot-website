"use strict";angular.module("uichallengeApp",["ngAnimate","ngAria","ngCookies","ngMessages","ngResource","ngRoute","ngSanitize","ngTouch","uiGmapgoogle-maps","ui.bootstrap"]).config(function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).otherwise({redirectTo:"/"})}).config(function(a){a.configure({v:"3.17",libraries:"weather,geometry,visualization"})}),angular.module("uichallengeApp").controller("MainCtrl",["$scope","$rootScope","$http","uiGmapGoogleMapApi","$modal",function(a,b,c,d,e){a.noLocationObj={query:"0.0.0.0",country:"",regionName:"",city:"",timezone:"",lat:"",lon:"",isp:""},a.location=a.noLocationObj,a.gotLocationOnce=!1,a.meKey="me",a.websiteKey="website",a.website={},a.googleMaps={},a.myLocationNotPresent=!0,a.map={center:{latitude:45,longitude:-73},zoom:4,bounds:{}},d.then(function(b){a.googleMaps=b;document.getElementById("gmap");a.mapOptions={center:a.googleMaps.LatLng(a.location.lat,a.location.lon),zoom:15,mapTypeId:a.googleMaps.MapTypeId.ROADMAP}}),a.markers=[],a.isNullOrUndefined=function(a){return"undefined"==typeof a?!0:""===a?!0:null===a?!0:angular.equals(a,{})?!0:Array.isArray(a)&&0===a.length?!0:!1},a.onHelpClick=function(b){if(!a.isNullOrUndefined(b)&&!a.isNullOrUndefined(a.location.isp)){var c=new Date;window.alert("This is your "+b+" from ISP "+a.location.isp+" at "+c.toDateString())}},a.updateLocationDetails=function(b,c){c==a.meKey?(a.location=b,a.myLocationNotPresent=!1):a.location={query:b.ip,country:b.country_name,regionName:b.region_name,city:b.city,timezone:b.time_zone,lat:b.latitude,lon:b.longitude,isp:b.region_name}},a.resetLocationDetails=function(){a.markers[0]={id:"nomarker"},a.myLocationNotPresent=!0,2===a.markers.length?a.updateLocationDetails(a.markers[1].data,a.websiteKey):a.location=a.noLocationObj},a.getMyLocation=function(){var b="http://ip-api.com/json/";a.getLocationInfo(b,a.meKey)},a.getWebsiteLocation=function(b){if(!a.isNullOrUndefined(b)){var c="http://freegeoip.net/json/"+b;a.getLocationInfo(c,a.websiteKey)}},a.mapLocation=function(b,c){var d={id:c,latitude:a.location.lat,longitude:a.location.lon,title:c,data:b};c===a.meKey?a.markers[0]=d:a.markers[1]=d},a.getLocationInfo=function(b,d){a.gotLocationOnce=!0,c.get(b).success(function(b){a.updateLocationDetails(b,d),a.mapLocation(b,d)})},a.launchWebsiteInput=function(){var b=e.open({animation:!0,templateUrl:"views/websiteHost.html",controller:"ModalInstanceCtrl",resolve:{host:function(){return a.website.host}}});return b.result.then(function(b){a.getWebsiteLocation(b),a.website.host=b},function(){}),b},a.markerClicked=function(b){if(!a.isNullOrUndefined(b)){var c=b.model.data;a.updateLocationDetails(c,b.key)}}}]),angular.module("uichallengeApp").controller("ModalInstanceCtrl",function(a,b,c){a.website={},a.website.host=c,a.ok=function(){b.close(a.website.host)},a.cancel=function(){b.dismiss("cancel")},a.hostNameRegex=/^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/,a.onEnter=function(b){!angular.equals(b.keyCode,13)||angular.equals(a.website.host,null)||angular.equals(a.website.host,"")||a.ok()}});