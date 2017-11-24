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
    //TODO: Bug is caused because the oneresult query returns everything as true (see postgresadapter.php).
    xhrT.open('GET', "http://localhost:8000" + '/oneresult?surveyId=' + surveyId);
    xhrT.setRequestHeader('Content-Type', 'application/json');
    xhrT.onload = function () {
        var result = JSON.parse(xhrT.response);
        var key = Object.keys(result)[result.length -1];
        var values = result[key];
        for(i=0; i< Object.keys(values).length; i++){
            keyName= String(Object.keys(values)[i]);
            model.setValue(keyName, values[keyName]);
        };
        model.render("surveyElement");
    };
    xhrT.send();
    window.survey = model;
    model.render("surveyElement");
    //TODO: I do not think the onComplete method is needed. Only a save event. But how to save it?
    survey.onComplete.add(function(result) {


        //TODO: The result.data needs to only have the current data. Not the things beforehand.
        console.log(result.data);
        myObj = result.data;
        var txt = "";
        txt += "<table border='1'>"
        for (x in myObj) {
            txt += "<tr><td>" + x + "</td> <td>" + myObj[x] + "</td></tr>";
        }
        txt += "</table>"
        document.getElementById("surveyResult").innerHTML = txt;

        function saveState(survey) {
            var res = { currentPageNo: survey.currentPageNo, data: survey.data};
            //Here should be the code to save the data into your database
            window.localStorage.setItem(storageName, JSON.stringify(res));
        }

    });





    //CSS Classes are changed here.
    survey.onUpdateQuestionCssClasses.add(function(survey, options) {
        var classes = options.cssClasses;

        classes.root = "sq-root";
        classes.title = "sq-title";
        classes.item = "sq-item";
        classes.label = "sq-label";
        classes.mainRoot="sq-mainRoot";

        if (options.question.isRequired) {
            classes.title = "sq-title sq-title-required";
            classes.root = "sq-root sq-root-required";
        }

        if (options.question.getType() === "checkbox") {
            classes.root = "sq-root sq-root-cb";
        }

        if (options.question.getType() === "checkbox") {
            classes.root = "sq-root sq-root-cb";
        }
    });

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
