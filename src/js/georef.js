app.controller('georef', [ '$scope','$http', function($scope, $http) {

  function onEachFeature(feature, layer) {
    var popupContent = ""
    if (feature.properties.City) {
      popupContent +='<h5><b>'+feature.properties.City+'</b></h5>'
      popupContent +='<h6><b>Total de habilitados: </b>'+ feature.properties.Total+'</h6>'
      popupContent +='<table class="table"><thead><tr><th>RII</th><th>RIE</th><th>Vul</th></tr></thead><tbody><tr>'
      popupContent +='<td>'+feature.properties.RII+'</td>'
      popupContent +='<td>'+feature.properties.RIE+'</td>'
      popupContent +='<td>'+feature.properties.Vul+'</td>'
      popupContent +='</tr></tbody></table><table class="table"><thead><tr>'
      popupContent +='<th>Homens</th><th>Mulheres</th><th>Idosos</th><th>Deficientes</th></tr></thead><tbody><tr>'
      popupContent +='<td>'+feature.properties.Male+'</td>'
      popupContent +='<td>'+feature.properties.Female+'</td>'
      popupContent +='<td>'+feature.properties.Elderly+'</td>'
      popupContent +='<td>'+feature.properties.Special+'</td>'
      popupContent +='</tr></tbody></table><table class="table"><thead><tr>'
      popupContent +='<th>Faixa 1</th><th>Faixa 2</th><th>Faixa 3</th><th>Faixa 4</th></tr></thead><tbody><tr>'
      popupContent +='<td>'+feature.properties.Zone1+'</td>'
      popupContent +='<td>'+feature.properties.Zone2+'</td>'
      popupContent +='<td>'+feature.properties.Zone3+'</td>'
      popupContent +='<td>'+feature.properties.Zone4+'</td>'
      popupContent +='</tr></tbody></table><h6><a href="#">detalhar habilitados</a></h6>'

    }
    layer.bindPopup(popupContent);
  }
  angular.extend($scope, {
    defaults: {
      zoomControlPosition: 'topright',
      minZoom: 10,
      maxZoom: 18
    },
    brasilia: {
      lat: -15.7799,
      lng: -47.7965,
      zoom: 10      
    },
    controls: {
      scale: true
    },
    legend: {
      colors: [ '#fff','#00CC00', '#006699', '#FF4500', '#FF0000' ],
      labels: [ '<strong> Predominancia por:</strong>','Faixa 1 (0-1.600)', 'Faixa 2 (1.601-3.275)', 'Faixa 3 (3.276-5.000)', 'Faixa 4 (5.001-x)' ]
    },
    //geojson : {}
  })
      
  $scope.addgeojson = function(dado) {
    $http.get('http://www.morarbem.df.gov.br/consultas/geo',{params:dado}).success(function(data){
    //window.setTimeout(function() {
      angular.extend($scope,{
        geojson : {
          data: data,
          onEachFeature: onEachFeature,
          pointToLayer:
            function (feature, latlng) {
              radius = feature.properties.Total > 1000 ?  ((feature.properties.Total/ 1000)  + 10) : ((feature.properties.Total/ 100) + 10)
              faixa = [feature.properties.Zone1,feature.properties.Zone2,feature.properties.Zone3,feature.properties.Zone4]

              var maior = Math.max.apply(null, faixa )
              if(feature.properties.Zone1 == maior )
                color = "#00CC00"
              else if(feature.properties.Zone2 == maior )
                color = "#006699"
              else if(feature.properties.Zone3 == maior )
                color = "#FF4500"
              else if(feature.properties.Zone4 == maior )
                color = "#FF0000"
              return L.circleMarker(latlng, {
                radius: radius,
                fillColor: color,
                color: color,
                weight: 1,
                opacity: 1,
                fillOpacity: 0.6
              })
            }
        }
      })
    waitingDialog.hide()
    })
   // }, 3000)
    // $http.get('http://www.morarbem.df.gov.br/consultas/geo',{params:dado}).success(function(data){
    //   $scope.GJson = data
    //   console.log($scope.GJson)
    //   waitingDialog.hide()
    // })    
  }

  $scope.geojsonSelect = function(dado) {
    window.setTimeout(function() {
      $scope.addgeojson(dado)      
    }, 800)
    $scope.geojson = {}

    waitingDialog.show('Carregando')
    // window.setTimeout(function() {
    //   waitingDialog.hide()
    // }, 1000)
  }  

  // window.setTimeout(function() {
  //   $scope.addgeojson()            
  // }, 3)
    
}])