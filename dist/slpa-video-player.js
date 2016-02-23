(function (angular) {

  // Create all modules and define dependencies to make sure they exist
  // and are loaded in the correct order to satisfy dependency injection
  // before all nested files are concatenated by Gulp

  // Config
  angular.module('slpaVideoPlayer.config', [])
      .value('slpaVideoPlayer.config', {
          debug: true
      });

  // Modules
  angular.module('slpaVideoPlayer',
      [
          'ngMaterial',
          'blockUI',
          'ngStorage',
          'slpaVideoPlayer.config',
          'slpaVideoPlayer.directives',
          'slpaVideoPlayer.filters',
          'slpaVideoPlayer.services'
      ]);

})(angular);

/**
 * Created by JG on 2/20/2016.
 */
angular.module('slpaVideoPlayer.directives', [])

.directive('clip', function() {
  return{
    scope:{
      videosource:'='
    },
    restrict: 'AE',
    replace: true,
    template: ' <md-card><div layout="row"><div flex ="66"><md-card><div block-ui="myBlock">'+
    '<div class=" card-media">'+
    '<video id="player" src="{{videosource}}" pause-video loaded-data muted autoplay autobuffer controls>' +
    '</video></div></div>'+
    '<md-card-content ng-show="true"><div layout-gt-sm="row"><md-input-container class="md-block" flex-gt-sm>'+
    '<label>Clip name</label><input  ng-model="clip.name"></md-input-container>'+
    '<md-input-container class="md-block" flex-gt-sm>'+
    '<label>Start time</label><input type="number" ng-model="clip.startTime"></md-input-container></div>'+
    '<div layout-gt-sm="row"><md-input-container class="md-block" flex-gt-sm>'+
    '<md-switch ng-model="clip.persist">Persist</md-switch>'+
    '</md-input-container>'+
    '<md-input-container class="md-block" flex-gt-sm>'+
    '<label>End Time</label><input type="number" ng-model="clip.endTime"></md-input-container></div>'+
    '</md-card-content><md-card-actions layout="row" layout-align="end center">'+
    //'<md-button class="md-accent md-raised">Eliminar</md-button>'+
    '<md-button class="md-raised md-accient" ng-click="saveClip()">Guardar</md-button>'+
    '<md-button class="md-raised md-primary" ng-click="resetClip()">Nuevo</md-button>'+
    '</md-card-actions></md-card></div><div flex="33"><md-content flex  layout-padding><md-list>'+
    '<md-list-item class="md-3-line secondary-button-padding" ng-repeat="item in clips track by $index"'+
    'ng-click="setSource(item,$index)"><img src="images/poster.jpg" class="md-avatar"/>'+
    '<div class="md-list-item-text" layout="column">'+
    '<h3>{{ item.name }}</h3><p>Start ({{ item.startTime|secondsToHHmmss }}) -  End ({{item.endTime|secondsToHHmmss}})'+
    '</p><md-button class="md-secondary md-accent md-raised" ng-show="$index!=0" ng-click="deleteClip($index)">'+
    'Delete</md-button></div></md-list-item><md-divider ></md-divider></md-list></md-content></div></div></md-card>',
    controller: function($scope, $element,$timeout,blockUI,$localStorage){
      $scope.videosourceOrigin=$scope.videosource;
      function guid() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4();
      }


      function updateLocalData(item){
        if($scope.$storage.clips.map(function(x) {return x.id; }).indexOf(item.id)!==-1){
          var index=$scope.$storage.clips.indexOf(item);
          if(item.persist===false){
            $scope.$storage.clips.splice(index, 1);
          }else{
            $scope.$storage.clips[index]=item;
          }
        }else{
          if(item.persist!==false){
            $scope.$storage.clips.push(item);

          }
        }

      }
      var myBlock = blockUI.instances.get('myBlock');
      $scope.$storage=$localStorage.$default({clips:[] });
      $scope.resetClip=function(){
        $scope.clip={
          id:null,
          name:null,
          startTime:null,
          endTime:null,
          source:null,
          playFragment:null,
          persist:false
        };
        $scope.new=true;
      };
      $scope.new=true;
      $scope.clip={
        id:null,
        name:null,
        startTime:null,
        endTime:null,
        source:null,
        playFragment:null,
        persist:false
      };
      $scope.clips=[];
      angular.element('#player').bind('loadeddata', function () {
        $scope.videoDuration=angular.element('#player')[0].duration;
        $scope.clips[0].endTime=$scope.videoDuration;
      });
      angular.element('#player').on('pause', function(){
        var current = $scope.clips.indexOf($scope.clip);

        if(current<$scope.clips.length-1) {

          if (angular.element('#player')[0].currentTime - $scope.clip.endTime > 0.1) {
            myBlock.start('Loading next clip..');

            $timeout(function () {
              myBlock.stop();

              $scope.videosource = $scope.clips[current + 1].playFragment;
            }, 3000);
          }
        }


      });
      $scope.clips.push({
        name:'Full Video',
        startTime:0,
        endTime:$scope.videoDuration,
        source:$scope.videosourceOrigin,
        playFragment:$scope.videosourceOrigin
      });
      angular.forEach($scope.$storage.clips, function(item){

        $scope.clips.push(item);
      });

      $scope.saveClip=function(item){
          $scope.clip.source=$scope.videosource;
          $scope.clip.playFragment=$scope.videosourceOrigin+'#t='+$scope.clip.startTime+','+$scope.clip.endTime;
        if($scope.new===true) {
          $scope.clip.id=guid();
          $scope.clips.push($scope.clip);
          updateLocalData($scope.clip);
          $scope.resetClip();
        }else{
          updateLocalData($scope.clip);
        }
      };
      $scope.deleteClip=function(index){
        $scope.clips[index].persist=false;
        updateLocalData($scope.clips[index]);
        $scope.clips.splice(index, 1);
        $scope.resetClip();

      };
      $scope.setSource = function(item,index){
        $scope.videosource=item.playFragment;
        if(index!==0){
          $scope.clip=item;
          $scope.new=false;

        }else {
          $scope.resetClip();
        }
      };
      //
      //$scope.$watch('clip.endTime',function(){
      //  if($scope.clip.endTime < $scope.clip.startTime){
      //    $scope.clip.endTime=$scope.clip.startTime+1;
      //  }
      //});
      //
      //$scope.$watch('clip.startTime',function(){
      //  if(($scope.clip.endTime < $scope.clip.startTime)&&$scope.clip.endTime!==null){
      //    $scope.clip.endTime=$scope.clip.startTime+=1;
      //  }
      //});
    },

  link: function(scope,elem,attrs){


      scope.$watch('color',function(changedVal){
        console.log('changed detected');
      });
    }
  };
});

/**
 * Created by JG on 2/22/2016.
 */
angular.module('slpaVideoPlayer.services', [])
  .factory('localData', function($localStorage) {
    //
    //$scope.$storage=$localStorage;
    //$scope.$storage=[];
    //return{
    //
    //  getAll:function(){
    //    return  $scope.$storage;
    //  },
    //  add:function(item){
    //     $scope.$storage.push(item);
    //  },
    //  delete:function(item){
    //     $scope.$storage.splice( $scope.$storage.indexOf(item), 1);
    //  },
    //  update:function(item){
    //     $scope.$storage[ $scope.$storage.indexOf(item)]=item;
    //  }
    //};
  });

/**
 * Created by JG on 2/22/2016.
 */
angular.module('slpaVideoPlayer.filters',[])
  .filter('secondsToHHmmss', function($filter) {
    return function(seconds) {
      return $filter('date')(new Date(0, 0, 0).setSeconds(seconds), 'HH:mm:ss');
    };
  });

