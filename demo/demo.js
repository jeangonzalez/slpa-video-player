/**
 * Created by JG on 2/20/2016.
 */


angular.module("demo", ['ngMaterial','slpaVideoPlayer'])

  .filter("trustUrl", ['$sce', function ($sce) {
    return function (recordingUrl) {
      return $sce.trustAsResourceUrl(recordingUrl);
    };
  }])

.controller('StudentController', function($scope) {
  $scope.videoSource2 = "videos/trailer2.mp4"

  $scope.changeSource=function(){
    $scope.videoSource2 = "videos/trailer2.mp4"
  }


  $scope.colors=['red','orange','green'];

  $scope.change=function(){
    return $scope.colors[Math.floor((Math.random()*3))];
  }
});
