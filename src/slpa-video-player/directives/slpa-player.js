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
    template: ' <md-card><div layout="row"><div flex ="66"><md-card><div class=" card-media">'+
    '<video id="player" src="{{videosource}}" pause-video loaded-data muted autoplay autobuffer controls></video>'+
    '</div><md-card-content ng-show="true"><div layout-gt-sm="row"><md-input-container class="md-block" flex-gt-sm>'+
    '<label>Clip name</label><input  ng-model="clip.name"></md-input-container>'+
    '<md-input-container class="md-block" flex-gt-sm>'+
    '<label>Start time</label><input type="number" ng-model="clip.startTime"></md-input-container></div>'+
    '<div layout-gt-sm="row"><md-input-container class="md-block" flex-gt-sm></md-input-container>'+
    '<md-input-container class="md-block" flex-gt-sm>'+
    '<label>End Time</label><input type="number" ng-model="clip.endTime"></md-input-container></div>'+
    '</md-card-content><md-card-actions layout="row" layout-align="end center">'+
    //'<md-button class="md-accent md-raised">Eliminar</md-button>'+
    '<md-button class="md-raised md-accient" ng-click="saveClip()">Guardar</md-button>'+
    '<md-button class="md-raised md-primary" ng-click="resetClip()">Nuevo</md-button>'+
    '</md-card-actions></md-card></div><div flex="33"><md-content flex  layout-padding><md-list>'+
    '<md-list-item class="md-3-line secondary-button-padding" ng-repeat="item in clips track by item.name"'+
    'ng-click="setSource(item,$index)"><img src="images/poster.jpg" class="md-avatar"/>'+
    '<div class="md-list-item-text" layout="column">'+
    '<h3>{{ item.name }}</h3><p>Start ({{ item.startTime|secondsToHHmmss }}) -  End ({{item.endTime|secondsToHHmmss}})'+
    '</p><md-button class="md-secondary md-accent md-raised" ng-show="$index!=0" ng-click="deleteClip($index)">'+
    'Delete</md-button></div></md-list-item><md-divider ></md-divider></md-list></md-content></div></div></md-card>',
    controller: function($scope, $element){
      $scope.videosourceOrigin=$scope.videosource;

      $scope.resetClip=function(){
        $scope.clip={
          name:null,
          startTime:null,
          endTime:null,
          source:null,
          playFragment:null
        };
        $scope.new=true;
      };
      $scope.new=true;
      $scope.clip={
        name:null,
        startTime:null,
        endTime:null,
        source:null,
        playFragment:null
      };
      $scope.clips=[];
      angular.element('#player').bind('loadeddata', function () {
        $scope.videoDuration=angular.element('#player')[0].duration;
        $scope.clips[0].endTime=$scope.videoDuration;
      });
      angular.element('#player').on('pause', function(){
      $scope.a=0;
      });
      $scope.clips.push({
        name:'Full Video',
        startTime:0,
        endTime:$scope.videoDuration,
        source:$scope.videosourceOrigin,
        playFragment:$scope.videosourceOrigin
      });
      $scope.saveClip=function(item){
          $scope.clip.source=$scope.videosource;
          $scope.clip.playFragment=$scope.videosourceOrigin+'#t='+$scope.clip.startTime+','+$scope.clip.endTime;
        if($scope.new===true) {
          $scope.clips.push($scope.clip);
        }
      };
      $scope.deleteClip=function(index){
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
