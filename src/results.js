function getParams() {
    var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    var result = {};
    url.forEach(function(item) {
        var param = item.split("=");
        result[param[0]] = param[1];
    });
    return result;
}
  
function SurveyManager(baseUrl, accessKey) {
    var self = this;
    self.surveyId = getParams()["id"];
    self.results = ko.observableArray();

    self.loadResults = function () {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', baseUrl + '/results?postId=' + self.surveyId);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = function () {
            var result = xhr.response ? JSON.parse(xhr.response) : {};
            //for each in result. parse to a JSON and then to a JSON array.
            var JsonArray = [];
            for (i=0; i< result.length; i++){
                var resultJson = JSON.parse(result[i]);
                JsonArray.push(resultJson)
            };
            console.log(JsonArray);
            console.log(JsonArray.filter(function(signUp){
                return signUp.UserID == "hogg"
            }));
            self.results(result);
        };
        xhr.send();
    }

    self.loadResults();
}

ko.applyBindings(new SurveyManager("http://localhost:8000"), document.getElementById("results"));