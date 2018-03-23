MagnifyingGlass = function(Map1){
  this.Map1 = Map1 ;
};

MagnifyingGlass.prototype.affiche = function(){

  // The map
  var map=new ol.Map
    ({
      target: 'map',
      view: new ol.View
      ({	zoom: 15,
        center: [270148, 6247782]
      }),
      layers: [ new ol.layer.Tile({ source: new ol.source.Stamen({ layer: 'watercolor' }) }) ]
    });

  // Layers for the overview
  var layers2 =
  //from the top to the bottom
  [	new ol.layer.Tile({	source: new ol.source.OSM(),opacity:1}),
    new ol.layer.Tile({	source: new ol.source.Stamen({layer: 'watercolor'})	, opacity:1 }),
    new ol.layer.Tile({
      source: new ol.source.XYZ({
      url: 'https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicGpvYW5ibGFucSIsImEiOiJjamYxMDE0NTQwOWo4MzJscmg2endoN3o4In0._c_XcFWgATxKjCuSrCFRwA'
      })
  })
  ];
  setOVLayer($(".options input"));

  //magnifying glass on the map
  var ov = new ol.Overlay.Magnify(
    {	layers: layers2,
      zoomOffset: $("#zoom").val()
    });
  map.addOverlay(ov);

  //external magnify frame
  var ov2 = new ol.Overlay.Magnify(
    {	layers: layers2,
      target: $(".overview").get(0),
      zoomOffset: $("#zoom").val()
    });
  map.addOverlay(ov2);


  // Options changes
  //function to set which layers are visible
  function setOVLayer ()
  {
    for (i=0; i < layers2.length; i++)
    {
      if (document.getElementById(i).checked == true){
        layers2[i].setVisible(true);
      }
      else {
        layers2[i].setVisible(false);
      }
    }
  }

  //initializing for opacity
  var croissant = false; // decreasing opacity at the beginning
  var opacite = layers2[1].get("opacity");
  var step=0.1 ; // step

  //on change le pas lorsque la valeur choisie est différente
  var OpacityInput = document.getElementById('chgOpacity');
  function useValue() {
    step = 0.1*OpacityInput.value/60; //0.1 as the setInterval is 100, 60 to change from sec to minute
  }
  OpacityInput.oninput = useValue ;




//list with the number of checked layers
list_layers = [] ;
var nb = 0 ;//to count nb of layers checked
for (var j=0 ; j<layers2.length;j++){
  if (document.getElementById(j).checked) {
    list_layers[nb]=j;
    nb = nb + 1 ;}
}
var c = 0 ; // to identify the layer whom opacity is changing

  //change the order of the list
  t=[];
  for (var i=0;i<list_layers.length;i++){
  t[i] =list_layers[list_layers.length-1-i];
  };
  list_layers=t;

	

  //function for shifting opacity

  function changeOpacity() {
  opacite = layers2[list_layers[c]].get("opacity"); //on recupere l'opacite de la couche en cours
  changeLayer = false;
  couche = c;
   //decreasing
   if (opacite < 1 && croissant == false && opacite > 0) {
     if (opacite>0+step){
    opacite = opacite - step;}
    else {opacite = 0; }
  //increasing
 } else if (opacite < 1 && croissant == true && opacite > 0 ){
   if (opacite<1-step){
   opacite = opacite + step;}
   else {opacite=1;}
  //full opacity
 } else if (opacite >= 1 ){
   //if increasing and not at the end of the layer, changing layer
  if (c!=0 && croissant == true){
    couche = c-1 }
  //if it is the first layer of it we are decreasing
  else {
    croissant = false;
    opacite = opacite - step;}
  }
else if (opacite <= 0){
  //if decreasing and not the last layer we can switch layer
  if (c!=list_layers.length-2 && croissant==false){
    couche=c+1;
  }
    //if it is the last layer or if increasing
    else {
    croissant = true;
    opacite = opacite + step;
    };
  };
   layers2[list_layers[c]].setOpacity(opacite);
   c=couche ; //giving value to global variable


 };
 //end of the ChangeOpacity function


//calling the function 10 times by second
var Interval = setInterval(changeOpacity,100);

//click allows to hide the magnifying glass
//hiding also the magnifying frame allows the matching with the magnifying glass
$("#map").on("click", function()
{
map.removeOverlay(ov);
isVisible=false;
});

//click again to make the magnifying glass appears
$("#map").on("click", function()
{
map.addOverlay(ov2);
map.addOverlay(ov);
isVisible = true;
});
  //change the value of the zoom when changes
  $("#zoom").on("change", function ()
  {	ov.set("zoomOffset", Number($("#zoom").val()));
    ov2.set("zoomOffset", Number($("#zoom").val()));
  });



$('input[id="0"]').on("click", function(e) {
		setOVLayer(this);
        console.log("keyboard");
    }) ;
    
$('input[id="1"]').on("click", function(e) {
		setOVLayer(this);
        console.log("keyboard");
    }) ;
    
$('input[id="2"]').on("click", function(e) {
		setOVLayer(this);
        console.log("keyboard");
    }) ;        
    
    
    
 
}










//////////////////////////////////
