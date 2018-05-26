/* Enter Device Status Endpoit URL here */

var devices_endpoint_url = 'https://jmuvv5pidj.execute-api.us-east-1.amazonaws.com/prod';


// This file covers 3 devices, a real program should be designed to handle any number of devices

/****************************************

/**
* Angular Part of the code
*/

var appVar = angular.module('ShowMap', ['ngTable']);
var icon = "M21.25,8.375V28h6.5V8.375H21.25zM12.25,28h6.5V4.125h-6.5V28zM3.25,28h6.5V12.625h-6.5V28z";
var icon2 = "M3.5,13.277C3.5,6.22,9.22,0.5,16.276,0.5C23.333,0.5,29.053,6.22,29.053,13.277C29.053,14.54,28.867,15.759,28.526,16.914C26.707,24.271,16.219,32.5,16.219,32.5C16.219,32.5,4.37,23.209,3.673,15.542C3.673,15.542,3.704,15.536,3.704,15.536C3.572,14.804,3.5,14.049,3.5,13.277C3.5,13.277,3.5,13.277,3.5,13.277M16.102,16.123C18.989,16.123,21.329,13.782,21.329,10.895C21.329,8.008,18.989,5.668,16.102,5.668C13.216,5.668,10.876,8.008,10.876,10.895C10.876,13.782,13.216,16.123,16.102,16.123C16.102,16.123,16.102,16.123,16.102,16.123";


var chart_count = 0; // counts number of chart items
var chart_count_max = 80; // This is the threshold when charts start removing items from the left (movig x axis)



appVar.controller('mapController', function ($scope, $http, $timeout, NgTableParams) {

    //anammr func was here
    $scope.func = function () {

        $scope.dataVar = [];

        $http({
            method: "GET",
            url: devices_endpoint_url + '/Temperature',
        }).success(function (data) {
            var maxlat;
            var maxlon;
            var maxDeviceId;
            var maxtimeStamp = 0;

            var hum = JSON.stringify(data);
            for (i = 0; i < data.Items.length; i++) {
                var lat = JSON.stringify(data.Items[i].payload.location.lat);
                var lon = JSON.stringify(data.Items[i].payload.location.lon);
                var timeStamp = JSON.stringify(data.Items[i].payload.timeStampEpoch);
                var deviceId = JSON.stringify(data.Items[i].payload.deviceId);
                if (timeStamp > maxtimeStamp) {
                    maxlat = lat;
                    maxlon = lon;
                    maxDeviceId = deviceId
                    maxtimeStamp = timeStamp
                }
            }
            console.log("maxlat " + maxlat + " maxtimeStamp " + maxtimeStamp);
            $scope.dataVar.push({
                "latitude": maxlat,
                "longitude": maxlon,
                "svgPath": icon,
                "color": "#CC0000",
                "scale": 0.5,
                "label": maxDeviceId,
                "labelShiftY": 2,
                //"zoomLevel": 5,
                "title": "Latitude: " + maxlat + " Longitude: " + maxlon,
                "description": maxDeviceId
            });
            // Code for Get call start
            $http({
                method: "GET",
                url: devices_endpoint_url + '/Pressure',
            }).success(function (data) {


                var hum = JSON.stringify(data);
                maxtimeStamp = 0;
                for (i = 0; i < data.Items.length; i++) {
                    var lat = JSON.stringify(data.Items[i].payload.location.lat);
                    var lon = JSON.stringify(data.Items[i].payload.location.lon);
                    var timeStamp = JSON.stringify(data.Items[i].payload.timeStampEpoch);
                    var deviceId = JSON.stringify(data.Items[i].payload.deviceId);
                    if (timeStamp > maxtimeStamp) {
                        maxlat = lat;
                        maxlon = lon;
                        maxDeviceId = deviceId
                        maxtimeStamp = timeStamp
                    }
                }
                console.log("maxlat " + maxlat + " maxtimeStamp " + maxtimeStamp);
                $scope.dataVar.push({
                    "latitude": maxlat,
                    "longitude": maxlon,
                    "svgPath": icon,
                    "color": "#CC0000",
                    "scale": 0.5,
                    "label": maxDeviceId,
                    "labelShiftY": 2,
                    //"zoomLevel": 5,
                    "title": "Latitude: " + maxlat + " Longitude: " + maxlon,
                    "description": maxDeviceId
                });

                // Code for Get call start
                $http({
                    method: "GET",
                    url: devices_endpoint_url + '/Humidity',
                }).success(function (data) {

                    //console.log("data"+JSON.stringify(data));
                    var hum = JSON.stringify(data);
                    maxtimeStamp = 0;
                    for (i = 0; i < data.Items.length; i++) {
                        var lat = JSON.stringify(data.Items[i].payload.location.lat);
                        var lon = JSON.stringify(data.Items[i].payload.location.lon);
                        var deviceId = JSON.stringify(data.Items[i].payload.deviceId);
                        if (timeStamp > maxtimeStamp) {
                            maxlat = lat;
                            maxlon = lon;
                            maxDeviceId = deviceId
                            maxtimeStamp = timeStamp
                        }
                    }
                    console.log("maxlat " + maxlat + " maxtimeStamp " + maxtimeStamp);
                    $scope.dataVar.push({
                        "latitude": maxlat,
                        "longitude": maxlon,
                        "svgPath": icon2,
                        "color": "#0000ff",
                        "scale": 0.5,
                        "label": maxDeviceId,
                        "labelShiftY": 2,
                        //"zoomLevel": 5,
                        "title": "Latitude: " + maxlat + " Longitude: " + maxlon,
                        "description": maxDeviceId
                    });
                    //getMap($scope.dataVar);
                }).error(function (error) {

                });

                //code for get call end
            }).error(function (error) {

            });

            //code for get call end

        }).error(function (error) {

        });

    }




    $scope.all_devices = [];

    $scope.Pressure_data = [];

    $scope.Humidity_data = [];

    $scope.Temperature_data = [];

    setInterval(function () {
        $http.get(devices_endpoint_url)
            .success(function (data, status, headers, config) {


                $scope.table_data = build_table_data(data);
                console.log('normalize data')
                console.log($scope.table_data);


                var dataset = {};
                $scope.tableParams = new NgTableParams({
                    page: 1,
                    count: 3
                }, {
                    counts: [],
                    total: 1,
                    dataset: $scope.table_data
                });
            });
    }, 5000);

    // Get data ready for chart and map display
    function build_table_data(response) {
        print_obj = [];
        response["Items"].forEach(function (value) {
            print_obj.push(parsePilotLightItem(value));

            // add new devices' data to 'all devices' array
            var normalize_data = parsePilotLightItem(value);

            // Build array for each device

            if (normalize_data.deviceId == 'Pressure') {
                $scope.Pressure_data.unshift(normalize_data);
                console.log('--------------> Pressure')
                console.log($scope.Pressure_data);
                if ($scope.Pressure_data.length > 20) {
                    $scope.Pressure_data.pop();
                }

            } else if (normalize_data.deviceId == 'Humidity') {
                $scope.Humidity_data.unshift(normalize_data);
                console.log('--------------> Humidity')
                console.log($scope.Humidity_data);
                if ($scope.Humidity_data.length > 20) {
                    $scope.Humidity_data.pop();
                }
            } else if (normalize_data.deviceId == 'Temperature') {
                $scope.Temperature_data.unshift(normalize_data);
                console.log('--------------> Temperature')
                console.log($scope.Temperature_data);
                if ($scope.Temperature_data.length > 20) {
                    $scope.Temperature_data.pop();
                }
            } else {
                console.log('Error no such device' + normalize_data.deviceId)
            };


            $scope.all_devices.unshift(normalize_data);


            if (($scope.all_devices.length) >= 20) {
                $scope.all_devices.pop();
                $scope.all_devices.pop();
                $scope.all_devices.pop(); //was shift
            }
        });
        return print_obj;
    };



    // parse data - if json format changes this function should change.
    function parsePilotLightItem(json_obj) {


        // get the payload json
        var payload = json_obj.payload;
        var json_for_table = {};
        json_for_table.deviceId = payload.deviceId;
        json_for_table.batteryCharge = payload.batteryCharge.toFixed(2);
        //json_for_table.batteryDischargeRate = payload.batteryDischargeRate.toFixed(2);
        json_for_table.batteryDischargeRate = Math.round(payload.batteryDischargeRate * 100) / 100;
        json_for_table.lon = payload.location.lon;
        json_for_table.lat = payload.location.lat;

        json_for_table.timeStampEpoch = payload.timeStampEpoch;

        json_for_table.sensorReading = payload.sensorReading;

        var iso_time = payload.timeStampIso;


        // This is for time display
        iso_time = iso_time.slice(11, 19);

        json_for_table.timeStamp = iso_time;



        return json_for_table;

    };


    // Chart section starts here

    google.charts.load('current', {
        packages: ['corechart', 'line']
    },'upcoming', {'packages': ['geochart']});
    google.charts.setOnLoadCallback(drawMapAndCharts);

    // google chart addition

    function drawMapAndCharts() {
        var data_chart_Temperature_battery_charge = new google.visualization.DataTable();
        var data_chart_Temperature_battery_Discharge = new google.visualization.DataTable();
        var data_chart_Temperature_sensor_data = new google.visualization.DataTable();

        var data_chart_Pressure_battery_charge = new google.visualization.DataTable();
        var data_chart_Pressure_battery_Discharge = new google.visualization.DataTable();
        var data_chart_Pressure_sensor_data = new google.visualization.DataTable();



        var data_chart_Humidity_battery_charge = new google.visualization.DataTable();
        var data_chart_Humidity_battery_Discharge = new google.visualization.DataTable();
        var data_chart_Humidity_sensor_data = new google.visualization.DataTable();

        // set up GeoChart
        var geo_chart_data = new google.visualization.DataTable();
        geo_chart_data.addColumn('number', 'Latitude');
        geo_chart_data.addColumn('number', 'Longitude');
        geo_chart_data.addColumn('string', 'Device ID');
        geo_chart_data.addColumn('number', 'Sensor Reading');

        // create dummy points in the "center" of country
        geo_chart_data.addRows([
            [39.14, -98.1, 'Pressure', data_chart_Pressure_sensor_data],
            [39.14, -98.1, 'Humidity', data_chart_Humidity_sensor_data],
            [39.14, -98.1, 'Temperature', data_chart_Temperature_sensor_data]
        ]);

        // geo_chart_data.removeRows(0,3);

        var geo_chart_options = {
          region: 'US',
          displayMode: 'markers',
          colorAxis: {colors: ['blue', 'red']}
        };

        // anamer - changed number to date
        data_chart_Temperature_battery_charge.addColumn('date', 'X');
        data_chart_Temperature_battery_charge.addColumn('number', 'battery_charge');

        data_chart_Temperature_battery_Discharge.addColumn('date', 'X');
        data_chart_Temperature_battery_Discharge.addColumn('number', 'battery_Discharge');

        data_chart_Temperature_sensor_data.addColumn('date', 'X');
        data_chart_Temperature_sensor_data.addColumn('number', 'sensor_data');

        // Pressure

        data_chart_Pressure_battery_charge.addColumn('date', 'X');
        data_chart_Pressure_battery_charge.addColumn('number', 'battery_charge');

        data_chart_Pressure_battery_Discharge.addColumn('date', 'X');
        data_chart_Pressure_battery_Discharge.addColumn('number', 'battery_Discharge');

        data_chart_Pressure_sensor_data.addColumn('date', 'X');
        data_chart_Pressure_sensor_data.addColumn('number', 'sensor_data');


        //Humidity

        data_chart_Humidity_battery_charge.addColumn('date', 'X');
        data_chart_Humidity_battery_charge.addColumn('number', 'battery_charge');

        data_chart_Humidity_battery_Discharge.addColumn('date', 'X');
        data_chart_Humidity_battery_Discharge.addColumn('number', 'battery_Discharge');

        data_chart_Humidity_sensor_data.addColumn('date', 'X');
        data_chart_Humidity_sensor_data.addColumn('number', 'sensor_data');


        var options_charge = {
            hAxis: {
                title: 'Time'
            },
            vAxis: {},
            legend: {
                position: 'none'
            },
            backgroundColor: '#f1f8e9'
        };

        var options_Discharge = {
            hAxis: {
                title: 'Time'
            },
            vAxis: {},
            legend: {
                position: 'none'
            },
            backgroundColor: '#f1f8e9'
        };

        var options_SensorData = {
            hAxis: {
                title: 'Time'
            },
            vAxis: {},
            legend: {
                position: 'none'
            },
            backgroundColor: '#f1f8e9'
        };

        var chart_Temperature_battery_charge = new google.visualization.LineChart(document.getElementById('chart_div_battery_charge_Temperature'));
        chart_Temperature_battery_charge.draw(data_chart_Temperature_battery_charge, options_charge);

        var chart_div_battery_discharge_Temperature =
            new google.visualization.LineChart(document.getElementById('chart_div_battery_discharge_Temperature'));
        chart_div_battery_discharge_Temperature.draw(data_chart_Temperature_battery_Discharge, options_Discharge);

        var chart_div_sensor_data_Temperature =
            new google.visualization.LineChart(document.getElementById('chart_div_sensor_data_Temperature'));
        chart_div_sensor_data_Temperature.draw(data_chart_Temperature_sensor_data, options_SensorData);


        // Pressure

        var chart_Pressure_battery_charge = new google.visualization.LineChart(document.getElementById('chart_div_battery_charge_Pressure'));
        chart_Pressure_battery_charge.draw(data_chart_Pressure_battery_charge, options_charge);

        var chart_div_battery_discharge_Pressure =
            new google.visualization.LineChart(document.getElementById('chart_div_battery_discharge_Pressure'));
        chart_div_battery_discharge_Pressure.draw(data_chart_Pressure_battery_Discharge, options_Discharge);

        var chart_div_sensor_data_Pressure =
            new google.visualization.LineChart(document.getElementById('chart_div_sensor_data_Pressure'));
        chart_div_sensor_data_Pressure.draw(data_chart_Pressure_sensor_data, options_SensorData);


        //Humidity
        var chart_Humidity_battery_charge = new google.visualization.LineChart(document.getElementById('chart_div_battery_charge_Humidity'));
        chart_Humidity_battery_charge.draw(data_chart_Humidity_battery_charge, options_charge);


        var chart_div_battery_discharge_Humidity =
            new google.visualization.LineChart(document.getElementById('chart_div_battery_discharge_Humidity'));
        chart_div_battery_discharge_Humidity.draw(data_chart_Humidity_battery_Discharge, options_Discharge);


        var chart_div_sensor_data_Humidity =
            new google.visualization.LineChart(document.getElementById('chart_div_sensor_data_Humidity'));
        chart_div_sensor_data_Humidity.draw(data_chart_Humidity_sensor_data, options_SensorData);

        // write GeoChart
        var geo_chart = new google.visualization.GeoChart(document.getElementById('mapdiv'));
        geo_chart.draw(geo_chart_data, geo_chart_options);

        // Update dashboard data with new values.
        setInterval(function () {

                console.log(geo_chart_data.getNumberOfRows());

                // #### Temperature #####
                var y = Math.round($scope.Temperature_data[0].batteryCharge);

                var x = new Date($scope.Temperature_data[0].timeStampEpoch);



                data_chart_Temperature_battery_charge.addRows([[x, y]]);

                chart_Temperature_battery_charge.draw(data_chart_Temperature_battery_charge, options_charge);

                if (chart_count > chart_count_max) {
                    data_chart_Temperature_battery_charge.removeRow(0); //slide

                }




                //  -- Sensor data
                var y = Math.round($scope.Temperature_data[0].sensorReading);

                var x = new Date($scope.Temperature_data[0].timeStampEpoch);


                data_chart_Temperature_sensor_data.addRows([[x, y]]);

                chart_div_sensor_data_Temperature.draw(data_chart_Temperature_sensor_data, options_SensorData);

                if (chart_count > chart_count_max) {
                    data_chart_Temperature_sensor_data.removeRow(0); //slide

                }


                var y = $scope.Temperature_data[0].batteryDischargeRate;

                var x1 = $scope.Temperature_data[0].timeStamp;
                data_chart_Temperature_battery_Discharge.addRows([[x, y]]);

                chart_div_battery_discharge_Temperature.draw(data_chart_Temperature_battery_Discharge, options_Discharge);
                // super hack to update values in place
                geo_chart_data.setValue(2, 0, $scope.Temperature_data[0].lat);
                geo_chart_data.setValue(2, 1, $scope.Temperature_data[0].lon);
                geo_chart_data.setValue(2, 3, $scope.Temperature_data[0].sensorReading);
                // geo_chart_data.removeRow(0);

                if (chart_count > chart_count_max) {
                    data_chart_Temperature_battery_Discharge.removeRow(0); //slide
                }

                //////////  Pressure  ///////////////////

                var y = Math.round($scope.Pressure_data[0].batteryCharge);

                var x1 = $scope.Pressure_data[0].timeStamp;


                data_chart_Pressure_battery_charge.addRows([[x, y]]);

                chart_Pressure_battery_charge.draw(data_chart_Pressure_battery_charge, options_charge);

                chart_count = chart_count + 1;
                if (chart_count > chart_count_max) {
                    data_chart_Pressure_battery_charge.removeRow(0); //slide
                }


                //  -- Sensor data
                var y = Math.round($scope.Pressure_data[0].sensorReading);

                var x = new Date($scope.Pressure_data[0].timeStampEpoch);


                data_chart_Pressure_sensor_data.addRows([[x, y]]);

                chart_div_sensor_data_Pressure.draw(data_chart_Pressure_sensor_data, options_SensorData);

                if (chart_count > chart_count_max) {
                    data_chart_Pressure_sensor_data.removeRow(0);

                }



                var y = $scope.Pressure_data[0].batteryDischargeRate;

                var x1 = $scope.Pressure_data[0].timeStamp;
                data_chart_Pressure_battery_Discharge.addRows([[x, y]]);

                // super hack to update values in place
                geo_chart_data.setValue(0, 0, $scope.Pressure_data[0].lat);
                geo_chart_data.setValue(0, 1, $scope.Pressure_data[0].lon);
                geo_chart_data.setValue(0, 3, $scope.Pressure_data[0].sensorReading);

                chart_div_battery_discharge_Pressure.draw(data_chart_Pressure_battery_Discharge, options_Discharge);

                if (chart_count > chart_count_max) {
                    data_chart_Pressure_battery_Discharge.removeRow(0); //slide

                }

                //

                ///////////// Humidity ////////////////

                var y = Math.round($scope.Humidity_data[0].batteryCharge);

                var x1 = $scope.Humidity_data[0].timeStamp;


                data_chart_Humidity_battery_charge.addRows([[x, y]]);

                chart_Humidity_battery_charge.draw(data_chart_Humidity_battery_charge, options_charge);

                if (chart_count > chart_count_max) {
                    data_chart_Humidity_battery_charge.removeRow(0); //slide

                }

                //  -- Sensor data
                var y = Math.round($scope.Humidity_data[0].sensorReading);

                var x = new Date($scope.Humidity_data[0].timeStampEpoch);


                data_chart_Humidity_sensor_data.addRows([[x, y]]);

                chart_div_sensor_data_Humidity.draw(data_chart_Humidity_sensor_data, options_SensorData);

                if (chart_count > chart_count_max) {
                    data_chart_Humidity_sensor_data.removeRow(0); //slide

                }

                var y = $scope.Humidity_data[0].batteryDischargeRate;

                var x1 = $scope.Humidity_data[0].timeStamp;
                data_chart_Humidity_battery_Discharge.addRows([[x, y]]);

                chart_div_battery_discharge_Humidity.draw(data_chart_Humidity_battery_Discharge, options_Discharge);
                // super hack to update values in place
                geo_chart_data.setValue(1, 0, $scope.Humidity_data[0].lat);
                geo_chart_data.setValue(1, 1, $scope.Humidity_data[0].lon);
                geo_chart_data.setValue(1, 3, $scope.Humidity_data[0].sensorReading);

                if (chart_count > chart_count_max) {
                    data_chart_Humidity_battery_Discharge.removeRow(0); //slide

                }

                // redraw map
                geo_chart.draw(geo_chart_data, geo_chart_options);


            },
            3000);

    }



    // Allow time for map to read Geolocation
    $scope.showSpinkit = true;

    $timeout(function () {

        $scope.showSpinkit = false;

    }, 2000);

    // Allow charts to collect data before printing
    $scope.showSpinkit_tables = true;

    $timeout(function () {

        $scope.showSpinkit_tables = false;

    }, 5000);

    // End of controller
});

// geocharts




// Animation directives


angular
    .module('ShowMap')
    .directive('rdWidgetHeader', rdWidgetTitle);

function rdWidgetTitle() {
    var directive = {
        requires: '^rdWidget',
        scope: {
            title: '@',
            icon: '@'
        },
        transclude: true,
        template: '<div class="widget-header"><div class="row"><div class="pull-left"><i class="fa" ng-class="icon"></i> {{title}} </div><div class="pull-right col-xs-6 col-sm-4" ng-transclude></div></div></div>',
        restrict: 'E'
    };
    return directive;
};



angular
    .module('ShowMap')
    .directive('rdWidgetFooter', rdWidgetFooter);

function rdWidgetFooter() {
    var directive = {
        requires: '^rdWidget',
        transclude: true,
        template: '<div class="widget-footer" ng-transclude></div>',
        restrict: 'E'
    };
    return directive;
};


/**
 * Widget Body Directive
 */

angular
    .module('ShowMap')
    .directive('rdWidgetBody', rdWidgetBody);

function rdWidgetBody() {
    var directive = {
        requires: '^rdWidget',
        scope: {
            loading: '@?',
            classes: '@?'
        },
        transclude: true,
        template: '<div class="widget-body" ng-class="classes"><rd-loading ng-show="loading"></rd-loading><div ng-hide="loading" class="widget-content" ng-transclude></div></div>',
        restrict: 'E'
    };
    return directive;
};


/**
 * Widget Directive
 */

angular
    .module('ShowMap')
    .directive('rdWidget', rdWidget);

function rdWidget() {
    var directive = {
        transclude: true,
        template: '<div class="widget" ng-transclude></div>',
        restrict: 'EA'
    };
    return directive;

    function link(scope, element, attrs) {
        /* */
    }
};

/**
 * Loading Directive
 * @see http://tobiasahlin.com/spinkit/
 */

angular
    .module('ShowMap')
    .directive('rdLoading', rdLoading);

function rdLoading() {
    var directive = {
        restrict: 'AE',
        template: '<div class="loading"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>'
    };
    return directive;
};
