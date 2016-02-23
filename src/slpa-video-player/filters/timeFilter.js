/**
 * Created by JG on 2/22/2016.
 */
angular.module('slpaVideoPlayer.filters',[])
  .filter('secondsToHHmmss', function($filter) {
    return function(seconds) {
      return $filter('date')(new Date(0, 0, 0).setSeconds(seconds), 'HH:mm:ss');
    };
  })
  .filter('trustUrl', ['$sce', function ($sce) {
    return function (recordingUrl) {
      return $sce.trustAsResourceUrl(recordingUrl);
    };
  }]);


