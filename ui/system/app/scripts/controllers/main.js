'use strict';

/**
 * @ngdoc function
 * @name systemAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the systemAngularApp
 */
angular.module('systemAngularApp')
  .controller('MainCtrl', function ($scope, $route, $location, $filter) {
    // view object
    $scope.view = {
      isLoaded: false
    };

    // controller objects
    $scope.objects = {
      allRoutes: [],
      blacklistRoutes: ['/disk-usage', '/logs', '/storage'],
      systimeTypes: {
        'manual': $filter('translate')('Manual'),
        'ntp': $filter('translate')('Using NTP server'),
      }
    };

    $scope.localSystem.summary = {};

    // retrieve base system info
    // -- Hardware --
    nethserver.system.summary.getHardware().then(function (info) {
      $scope.localSystem.summary.hardware = info;

      $scope.$apply();
    }, function (err) {
      console.error("couldn't read dmi info: " + err);
    });

    // -- kernel release --
    nethserver.system.summary.getKernelRelease().then(function (kernel) {
      $scope.localSystem.summary.kernelRelease = kernel;

      $scope.$apply();
    }, function (err) {
      console.error("Error reading kernel release", err);
    });

    // -- Operating system --
    nethserver.system.summary.getOS().then(function (info) {
      $scope.localSystem.summary.osRelease = info;

      $scope.$apply();
    }, function (err) {
      console.error("Error reading os release", err);
    });

    // -- Hostname --
    nethserver.system.summary.getHostname().then(function (hostname) {
      $scope.localSystem.summary.hostname = hostname;

      $scope.$apply();
    }, function (err) {
      console.error(err);
    });

    // -- DNS --
    /* nethserver.system.summary.getDNS().then(function (dns) {
      $scope.localSystem.summary.dns = dns;

      $scope.$apply();
    }, function (err) {
      console.error(err);
    }); */

    // -- Datetime --
    nethserver.system.summary.getSystemTime().then(function (info) {
      var datetime = info.trim().split(' ');
      $scope.localSystem.summary.date = datetime[0];
      $scope.localSystem.summary.time = datetime[1];

      $scope.$apply();
    }, function (err) {
      console.error("couldn't read datetime: " + err);
    });

    // -- System timezone --
    nethserver.system.summary.getSystemTimeZone().then(function (timezone) {
      $scope.localSystem.summary.timezone = timezone;
      $scope.localSystem.summary.newTimezone = timezone;

      // -- Time zones --
      return nethserver.system.summary.getTimeZones().then(function (timezones) {
        $scope.localSystem.summary.timezones = timezones;

        $scope.$apply();
        $('.combobox').combobox();
      });

    });

    // -- Time mode --
    nethserver.system.summary.getSystemTimeMode().then(function (timeMode) {
      $scope.localSystem.summary.timeMode = timeMode;

      $scope.$apply();
    }, function (err) {
      console.error("couldn't read time mode: " + err);
    });

    // -- NTP server --
    nethserver.system.summary.getNTPServer().then(function (ntpServer) {
      $scope.localSystem.summary.ntpServer = ntpServer;

      $scope.$apply();
    }, function (err) {
      console.error("couldn't read ntp server: " + err);
    });

    // -- Aliases --
    $scope.getAllAliases = function () {
      nethserver.system.dns.getAllAliases().then(function (aliases) {
        $scope.localSystem.summary.aliases = aliases;
        $scope.$apply();
      }, function (err) {
        console.error("couldn't read aliases info: " + err);
      });
    };
    $scope.getAllAliases();

    // -- Company info --
    nethserver.system.organization.getInfo().then(function (organization) {
      $scope.localSystem.organization = organization;
      $scope.$apply();
    }, function (err) {
      console.error("couldn't read organization info: " + err);
    });

    // modal actions
    $scope.openChangeHostname = function () {
      $scope.localSystem.summary.newHostname = $scope.localSystem.summary.hostname;
      $('#hostnameChangeModal').modal('show');
    };
    $scope.changeHostname = function (hostname) {
      $('#hostnameChangeModal').modal('hide');

      nethserver.system.summary.setHostname(hostname).then(function () {
        $scope.localSystem.summary.hostname = hostname;
        $scope.notifications.add({
          type: 'info',
          title: $filter('translate')('Hostname changed'),
          message: $filter('translate')('Hostname changed with success'),
          status: 'success',
        });
        $scope.$apply();
      }, function (err) {
        $scope.notifications.add({
          type: 'info',
          title: $filter('translate')('Error'),
          message: $filter('translate')('Event failed'),
          status: 'danger',
        });
        $scope.$apply();
      });
    };

    $scope.addAlias = function (alias) {
      $scope.localSystem.summary.aliases.push({
        isNew: true
      });
    };
    $scope.saveAlias = function (alias) {
      nethserver.system.dns.addAlias({
        key: alias
      }).then(function () {
        $scope.notifications.add({
          type: 'info',
          title: $filter('translate')('Saved'),
          message: $filter('translate')('Alias saved with success'),
          status: 'success',
        });
        $scope.getAllAliases();
      }, function (err) {
        console.error(err);
        $scope.notifications.add({
          type: 'info',
          title: $filter('translate')('Error'),
          message: $filter('translate')('Alias not saved'),
          status: 'danger',
        });
        $scope.$apply();
      });
    };
    $scope.removeAlias = function (alias, index) {
      if (alias.isNew) {
        $scope.localSystem.summary.aliases.splice(index, 1);
      } else {
        nethserver.system.dns.deleteAlias(alias.key).then(function () {
          $scope.notifications.add({
            type: 'info',
            title: $filter('translate')('Removed'),
            message: $filter('translate')('Alias removed with success'),
            status: 'success',
          });
          $scope.getAllAliases();
        }, function (err) {
          console.error(err);
          $scope.notifications.add({
            type: 'info',
            title: $filter('translate')('Error'),
            message: $filter('translate')('Alias not saved'),
            status: 'danger',
          });
          $scope.$apply();
        });
      }
    };

    $scope.openChangeSystime = function () {
      $scope.localSystem.summary.newTimezone = $scope.localSystem.summary.timezone;
      $scope.localSystem.summary.newTimeMode = $scope.localSystem.summary.timeMode;
      $scope.localSystem.summary.newDate = $scope.localSystem.summary.date;
      $scope.localSystem.summary.newTime = $scope.localSystem.summary.time;
      $scope.localSystem.summary.newNtpServer = $scope.localSystem.summary.ntpServer;
      $('#systimeChangeModal').modal('show');
    };
    $scope.changeSystime = function (value) {
      $scope.localSystem.summary.newTimeMode = value;
    };
    $scope.saveSystime = function () {
      console.log($scope.localSystem.summary);
      $('#systimeChangeModal').modal('hide');

      /* nethserver.system.summary.setSystemTimeZone($scope.localSystem.summary.newTimezone).then(function () {
        $scope.notifications.add({
          type: 'info',
          title: 'Saved',
          message: 'System timezone saved with success',
          status: 'success',
        });
        $scope.$apply();
      }, function (err) {
        console.error("couldn't save system time: " + err);
        $scope.notifications.add({
          type: 'info',
          title: 'Error',
          message: 'System timezone not saved',
          status: 'danger',
        });
        $scope.$apply();
      }); */

      if ($scope.localSystem.summary.newTimeMode == 'manual') {
        var timestamp = new Date($scope.localSystem.summary.newDate + ' ' + $scope.localSystem.summary.newTime).getTime();
        nethserver.system.summary.setSystemTime(timestamp).then(function () {
          $scope.notifications.add({
            type: 'info',
            title: $filter('translate')('Saved'),
            message: $filter('translate')('System time saved with success'),
            status: 'success',
          });
          $scope.$apply();
        }, function (err) {
          console.error("couldn't save system time: " + err);
          $scope.notifications.add({
            type: 'info',
            title: $filter('translate')('Error'),
            message: $filter('translate')('System time not saved'),
            status: 'danger',
          });
          $scope.$apply();
        });
      } else {
        nethserver.system.summary.setNTPServer($scope.localSystem.summary.ntpServer).then(function () {
          $scope.notifications.add({
            type: 'info',
            title: $filter('translate')('Saved'),
            message: $filter('translate')('System time saved with success'),
            status: 'success',
          });
          $scope.$apply();
        }, function (err) {
          console.error("couldn't save system time: " + err);
          $scope.notifications.add({
            type: 'info',
            title: $filter('translate')('Error'),
            message: $filter('translate')('System time not saved'),
            status: 'danger',
          });
          $scope.$apply();
        });
      }

    };
    $scope.resetDateTime = function () {
      $scope.localSystem.summary.timezone = $scope.localSystem.summary.oldTimezone;
    };

    $scope.openChangeCompany = function () {
      $('#companyChangeModal').modal('show');
      $scope.localSystem.newOrganization = angular.copy($scope.localSystem.organization);
    };
    $scope.changeCompany = function (organization) {
      $('#companyChangeModal').modal('hide');

      nethserver.system.organization.saveInfo(organization).then(function () {
        $scope.localSystem.organization = organization;
        $scope.notifications.add({
          type: 'info',
          title: $filter('translate')('Saved'),
          message: $filter('translate')('Company info saved with success'),
          status: 'success',
        });
        $scope.$apply();
      }, function (err) {
        console.error(err);
        $scope.notifications.add({
          type: 'info',
          title: $filter('translate')('Error'),
          message: $filter('translate')('Company info not saved'),
          status: 'danger',
        });
        $scope.$apply();
      });
    };

    $scope.powerActions = function (action) {
      switch (action) {
        case 'restart':
          break;

        case 'shutdown':
          break;
      }
    };

    // init graphics method
    $scope.initGraphics = function () {
      $('#date-picker').datepicker({
        autoclose: true,
        todayBtn: "linked",
        todayHighlight: true,
        format: 'yyyy-mm-dd'
      });
      $('#time-picker').datetimepicker({
        format: 'LT',
        keyBinds: {
          enter: function () {
            $('#time-picker').find('input').trigger('change');
            this.hide();
          }
        }
      }).on('dp.change', function (e) {
        var time = $('#time-picker').data().date.split(' ')[0];
        $scope.localSystem.summary.newTime = time;
      });
    };

    $scope.initRoutes = function () {
      for (var i in $route.routes) {
        if (i !== 'null' && $scope.objects.blacklistRoutes.indexOf(i) == -1 && i.match(/.+[^/]$/)) {
          $scope.objects.allRoutes.push({
            id: i,
            value: $route.routes[i]
          });
        }
      }
      $scope.view.isLoaded = true;
    };

    $scope.initGraphics();
    $scope.initRoutes();
  });