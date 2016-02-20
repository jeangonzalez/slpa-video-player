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
  angular.module('slpaVideoPlayer.directives', []);
  angular.module('slpaVideoPlayer.filters', []);
  angular.module('slpaVideoPlayer.services', []);
  angular.module('slpaVideoPlayer',
      [
          'slpaVideoPlayer.config',
          'slpaVideoPlayer.directives',
          'slpaVideoPlayer.filters',
          'slpaVideoPlayer.services',
          'ngResource',
          'ngCookies',
          'ngSanitize'
      ]);

})(angular);
