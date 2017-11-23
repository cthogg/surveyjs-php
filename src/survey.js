function getParams() {
    var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    var result = {};
    url.forEach(function(item) {
        var param = item.split("=");
        result[param[0]] = param[1];
    });
    return result;
}
  
function init() {

    Survey.dxSurveyService.serviceUrl = "http://localhost:8000";
    Survey.defaultBootstrapCss.navigationButton = "btn btn-primary";
    Survey.Survey.cssType = "bootstrap";

    var surveyId = getParams()["id"];
    var model = new Survey.Model({ surveyId: surveyId, surveyPostId: surveyId });

    //Get Model
    var xhrT = new XMLHttpRequest();
    xhrT.open('GET', "http://localhost:8000" + '/oneresult?surveyId=' + surveyId);
    xhrT.setRequestHeader('Content-Type', 'application/json');
    xhrT.onload = function () {
        console.log("loaded");
        console.log(xhrT.response);
        //TODO: Find out what the object.keys mean.
        var result = JSON.parse(xhrT.response);
        var key = Object.keys(result)[result.length -1];
        var values = result[key];
        console.log(values);
        //TODO: Set values from the variable "values" above .
        for(i=0; i< Object.keys(values).length; i++){
            keyName= String(Object.keys(values)[i]);
            model.setValue(keyName, values[keyName]);
        }
        model.render("surveyElement");
    };
    xhrT.send();


    window.survey = model;
    model.render("surveyElement");
    
    //Load survey by id from url

    //To get one result.

/*
     /!*var xhr = new XMLHttpRequest();
     xhr.open('GET', "http://localhost:8000" + '/survey?surveyId=' + surveyId);
     xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
     xhr.onload = function () {



         var result = JSON.parse(xhr.response);
         if(!!result) {
             var surveyModel = new Survey.Model(result);
             window.survey = surveyModel;
             ko.cleanNode(document.getElementById("surveyElement"));
             document.getElementById("surveyElement").innerText = "";





             var xhrT = new XMLHttpRequest();
             xhrT.open('GET', "http://localhost:8000/oneresult?postId=NewSurvey1");
             xhrT.setRequestHeader('Content-Type', 'application/json');
             xhrT.onload = function () {
                 console.log("loaded");
                 console.log(xhrT.response);
                 var result = JSON.parse(xhrT.response);
                 console.log(result);
                 surveyModel.setData(result);
                 surveyModel.render("surveyElement");
             };
             xhrT.send();

         }
     };
     xhr.send();*/
}

init();
