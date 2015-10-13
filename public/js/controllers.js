angular.module('AppControllers', [])
  .controller('MainCtrl', ['$scope', function ($scope) {
    $scope.title = 'XXIX Semana del Médico D. en C. Luz Margarita Baltazar Rodríguez';
  }])
  .controller('HomeCtrl', ['$scope', '$mdDialog', 'Talleres', 'Registro', function ($scope, $mdDialog, Talleres, Registro) {
    $scope.workshops = null;
    $scope.selectedWorkshop = null;
    Talleres.get().then(function (res) {
      $scope.workshops = res;
      $scope.workshops.forEach(function (workshop, index) {
        Talleres.getStudentsByWorkshopId({ id: workshop._id }).then(function (res) {
          workshop.available = true;
          workshop.current = res.length;
          if (workshop.current >= workshop.total) {
            workshop.available = false;
          }
        });
      });
    });
    $scope.showStudentsList = function (workshopIndex, event) {
      var id = $scope.workshops[workshopIndex]._id;
      $mdDialog.show({
        controller: StudentsListCtrl,
        templateUrl: 'views/studentsListTemplate.html',
        parent: angular.element(document.body),
        targetEvent: event,
        locals: { workshopId: id },
        bindToController: true,
        clickOutsideToClose: true
      });
      function StudentsListCtrl($scope, workshopId) {
        $scope.studentsList = null;
        Talleres.getStudentsByWorkshopId({ id: workshopId }).then(function (res) {
          $scope.studentsList = res;
        });
        $scope.dismissDialog = function () {
          $mdDialog.cancel();
        };
      }
    };
    $scope.showRegistration = function (workshopIndex, event) {
      var id = $scope.workshops[workshopIndex]._id;
      $mdDialog.show({
        controller: RegistrationCtrl,
        templateUrl: 'views/registrationFormTemplate.html',
        parent: angular.element(document.body),
        targetEvent: event,
        locals: { workshopId: id },
        bindToController: true,
        clickOutsideToClose: true
      }).then(function () {
        Talleres.get().then(function (res) {
          $scope.workshops = res;
          $scope.workshops.forEach(function (workshop, index) {
            Talleres.getStudentsByWorkshopId({ id: workshop._id }).then(function (res) {
              workshop.available = true;
              workshop.current = res.length;
              if (workshop.current === workshop.total) {
                workshop.available = false;
              }
            });
          });
        });
      });
      function RegistrationCtrl($scope, $mdDialog, $mdToast, Registro, workshopId) {
        $scope.student = {
          accountNumber: "",
          name: "",
          idTaller: workshopId
        };
        $scope.dismissDialog = function () {
          $mdDialog.cancel();
        };
        $scope.registerStudent = function () {
          if (/^\d{1,8}$/.test($scope.student.accountNumber) && $scope.student.accountNumber.length === 8
            && /^[A-Za-záéíóúñ\s]+$/.test($scope.student.name) && $scope.student.name.length > 0) {
            var yes = confirm("¿Estás seguro de querer registrarte en este taller?");
            if (yes) {
              Registro.post($scope.student).then(function (res) {
                if (res.success) {
                  $mdToast.show($mdToast.simple()
                    .content(res.data)
                    .position('bottom right')
                    .hideDelay(5000));
                  alert(res.data);
                  $mdDialog.hide();
                }
                else {
                  $mdToast.show($mdToast.simple()
                    .content("Error: " + res.data)
                    .position('bottom right')
                    .hideDelay(5000));
                  alert("Error: " + res.data);
                  $mdDialog.hide();
                }
              });
            }
            else {
              $mdDialog.hide();
            }
          }
          else {
            $mdToast.show($mdToast.simple()
              .content("Error: Revisa que tus datos sean correctos")
              .position('bottom right')
              .hideDelay(5000));
          }
        };
      }
    };
    $scope.showMaterial = function (workshopIndex, event) {
      var material = $scope.workshops[workshopIndex].material || [];
      $mdDialog.show({
        controller: ShowMaterialCtrl,
        templateUrl: 'views/materialTemplate.html',
        parent: angular.element(document.body),
        targetEvent: event,
        locals: { material: material },
        bindToController: true,
        clickOutsideToClose: true
      });
      function ShowMaterialCtrl($scope, material) {
        $scope.material = material;
        $scope.dismissDialog = function () {
          $mdDialog.cancel();
        };
      }
    };
  }]);