/**
 * Created by Dudu on 19/03/2016.
 */

homadeApp.controller('addMealCtrl', ['$scope', '$rootScope', '$uibModalInstance', 'mealFactory', 'userFactory', 'Upload', 'meal', function ($scope, $rootScope, $uibModalInstance, mealFactory, userFactory, Upload, meal) {

    $rootScope.loading = 0;

    var isUpdate = meal ? true : false;

    $scope.meal = meal ? meal : {};
    $scope.title = isUpdate ? $scope.meal.name : "New Meal";
    $scope.tags = [];
    $scope.currencies = ['₪','$','€'];
    $scope.currency = $scope.currencies[0];
    $scope.dropdown = false;

    //$scope.meal.file = {};

    $scope.init = function (){
        $scope.types = [
            {
                name: 'Meat',
                img: '../public/images/meat.png'
            },
            {
                name: 'Milk',
                img: '../public/images/milk.png'
            },
            {
                name: 'Vegetarian',
                img: '../public/images/leaf.png'
            },
            {
                name: 'Vegan',
                img: '../public/images/leaf.png'
            }
        ]
    };
    $scope.chngCurr = function(curren) {
        $scope.currency = curren;
    };
    $scope.$flow = {};

    $scope.setType = function(type) {
        $scope.meal.type = type;
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.submit = function() {
        if (isUpdate) {
            $rootScope.loading++;
            mealFactory.update($scope.meal).success(function(data) {
                alert (data);
                $uibModalInstance.close({ 'meal': $scope.meal, 'isUpdate': isUpdate});
            }).error(function(data) {
                alert(data);
            });
            return;
        }
        if (!$scope.meal.type) {
            alert('No type selected. Select one.');
            //$('.btn-group').focus();
            //$('html, body').animate({ scrollTop: $('#type').offset().top }, 'slow');
            $("#type").attr("tabindex",-1).focus();
            return;
        }
        if (!$scope.form.$valid){
            alert('Form is invalid. Fix it');
            return;
        }
        if (!$scope.meal.file) {
            alert('Please add an image. No Image, No Meal!');
            return;
        }

        $rootScope.loading++;

        var meal = $scope.meal;
        meal.chefFBId = userFactory.fbId;

        mealFactory.create(meal).success(function(data) {
            console.log("meal saved!" + "  " + data);
            meal._id = data;
            //$uibModalInstance.close({ 'meal': meal, 'isUpdate': isUpdate});
            upload($scope.meal.file, meal); //call upload function
        }).error(function(data) {
            alert(data);
        });
        
    };

    function upload(file, meal) {
        Upload.upload({
            url: '/upload', //webAPI exposed to upload the file
            data:{file:file} //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
            if(resp.data.error_code === 0){ //validate success
                //alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
            } else {
                //alert('an error occured');
                console.log('an error occured');
            }
            $uibModalInstance.close({ 'meal': meal, 'isUpdate': isUpdate});
        }, function (resp) { //catch error
            console.log('Error status: ' + resp.status);
            //alert('Error status: ' + resp.status);
        }, function (evt) {
            //console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            $scope.meal.file.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });
    }
}]);