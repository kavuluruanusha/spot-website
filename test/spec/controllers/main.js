
describe('Controller: ModalInstanceCtrl', function () {

  // load the controller's module
  beforeEach(module('uichallengeApp'));
  var scope, modalInstance, modalCtrl;
  var host = 'yahoo.com';
  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    modalInstance = modalInstanceMock;
    modalCtrl = $controller('ModalInstanceCtrl', {
      $scope: scope,
      $modalInstance: modalInstance,
      host: host
    });
  }));

  it('should verify ok()', function(){
    scope.ok();
    expect(modalInstance.result.closeItem).toEqual(host);
  });

  it('should verify cancel', function(){
    scope.cancel();
    expect(modalInstance.result.dismissItem).toEqual('cancel');
  });

  it('should verify onEnter()', function(){
    var evt = {
      "keyCode": 13
    };
    spyOn(scope, 'ok');
    scope.onEnter(evt);
    expect(scope.ok.calls.count()).toBe(1);
  });

});

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('uichallengeApp'));

  var MainCtrl, scope, httpBackend, uiGmapGoogleMapApiSvc, modal;
  var successCb;

  var noLocationObj = {
    query: "0.0.0.0",
    country: "",
    regionName: "",
    city: "",
    timezone: "",
    lat: "",
    lon: "",
    isp: ""
  };

  var data={
    ip: "1.0.0.0"
  };

  var maps = {
    "LatLng": function(lat,lon){},
    "MapTypeId": {
      "ROADMAP": 1
    }
  };
  
  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    scope = $rootScope.$new();
    httpBackend = $httpBackend;
    uiGmapGoogleMapApiSvc = uiGoogleMapMock;
    modal = modalMock;

 
    MainCtrl = $controller('MainCtrl', {
      $scope: scope,
      $rootScope: $rootScope,
      $httpBackend: httpBackend,
      uiGmapGoogleMapApi: uiGmapGoogleMapApiSvc,
      $modal: modalMock
    });
  }));
  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should set the default scope', function () {
    expect(scope.meKey).toBe('me');
    expect(scope.websiteKey).toBe('website');
    expect(scope.location).toEqual(noLocationObj);
    expect(scope.googleMaps).toEqual({});
    expect(scope.myLocationNotPresent).toBeTruthy();
    uiGmapGoogleMapApiSvc.uiMapCallback(maps);
    expect(scope.googleMaps).toEqual(maps);
    expect(scope.mapOptions.zoom).toBe(15);
  });

  it('should verify isNullOrUndefined', function (){
    expect(scope.isNullOrUndefined()).toBeTruthy();
    expect(scope.isNullOrUndefined("")).toBeTruthy();
    expect(scope.isNullOrUndefined(null)).toBeTruthy();
    expect(scope.isNullOrUndefined({})).toBeTruthy();
    expect(scope.isNullOrUndefined([])).toBeTruthy();
    expect(scope.isNullOrUndefined("hello")).toBeFalsy();
  });

  it('should verify onClick', function(){
    spyOn(window,'alert');
    scope.onHelpClick();
    expect(window.alert.calls.count()).toEqual(0);
    scope.location.isp="";
    scope.onHelpClick('location');
    expect(window.alert.calls.count()).toEqual(0);
    scope.location.isp=1;
    scope.onHelpClick('location');
    expect(window.alert.calls.count()).toEqual(1);
  })

  it('should verify updateLocationDetails', function(){
    
    scope.updateLocationDetails(data, 'me');
    expect(scope.location).toEqual(data);
    expect(scope.myLocationNotPresent).toBeFalsy();
    scope.location = noLocationObj;

    scope.updateLocationDetails(data, 'website');
    expect(scope.location.query).toEqual(data.ip);
    expect(scope.myLocationNotPresent).toBeFalsy();

  })

  it('should verify resetLocationDetails',function(){
    scope.markers = [];
    
    spyOn(scope, 'updateLocationDetails');
    scope.resetLocationDetails();
    expect(scope.markers[0]).toEqual({"id":"nomarker"});
    expect(scope.myLocationNotPresent).toBeTruthy();
    expect(scope.location).toEqual(noLocationObj);

    scope.markers = [{}, {data: data}];
    scope.resetLocationDetails();
    expect(scope.markers[0]).toEqual({"id":"nomarker"});
    expect(scope.myLocationNotPresent).toBeTruthy();
    expect(scope.updateLocationDetails).toHaveBeenCalled();

  })

  it('should verify getMyLocation',function(){
    var url = 'http://ip-api.com/json/';
    spyOn(scope,'getLocationInfo');
    scope.getMyLocation();
    expect(scope.getLocationInfo).toHaveBeenCalledWith(url, 'me');
  });

  it('should verify getWebsiteLocation',function(){
    var host = "";
    var url = "http://freegeoip.net/json/" + host;
    spyOn(scope,'getLocationInfo');
    scope.getWebsiteLocation();
    expect(scope.getLocationInfo.calls.count()).toBe(0);

    host = "www.yahoo.com";
    url = "http://freegeoip.net/json/" + host;
    scope.getWebsiteLocation(host);
    expect(scope.getLocationInfo).toHaveBeenCalledWith(url, 'website');
  });

  it('should verify mapLocation',function(){

    var newMarker = {
        "id": who,
        "latitude": "",
        "longitude": "",
        "title": who,
        "data": data      
    };
    scope.markers = [];
    var who = 'me';
    newMarker.id = who;
    newMarker.title = who;
    scope.mapLocation(data, who);
    expect(scope.markers[0]).toEqual(newMarker);

    var who = 'website';
    newMarker.id = who;
    newMarker.title = who;
    scope.mapLocation(data, who);
    expect(scope.markers[1]).toEqual(newMarker);
  });

  it('should verify getLocationInfo',function(){
    var url = 'http://ip-api.com/json/';
    spyOn(scope, 'updateLocationDetails');
    spyOn(scope, 'mapLocation');

    httpBackend.whenGET(url).respond(201, '');
    scope.getLocationInfo(url, 'me');
    httpBackend.flush();
    expect(scope.updateLocationDetails).toHaveBeenCalled();
    expect(scope.mapLocation).toHaveBeenCalled();
  });

  it('should verify launchWebsiteInput',function(){
    var host = 'yahoo.com';
    spyOn(scope,'getWebsiteLocation');
    var modalInstance = scope.launchWebsiteInput();
    modalInstance.result.confirmCallBack(host);
    expect(scope.website.host).toEqual(host);
    expect(scope.getWebsiteLocation).toHaveBeenCalled();
  });

  it('should verify markerClicked', function(){
    spyOn(scope, 'updateLocationDetails');
    var marker = {
      "model": {
        "data": data
      }
    }
    scope.markerClicked();
    expect(scope.updateLocationDetails.calls.count()).toBe(0);
    scope.markerClicked(marker);
    expect(scope.updateLocationDetails.calls.count()).toBe(1);
  });
});
