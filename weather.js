function postSlackMessage() {
  var token = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');
  var bot_name = "Mikubot";
  var bot_icon = "https://i.imgur.com/3yzyQ9T.jpg"; //icon_URL

  var app = SlackApp.create(token); //SlackApp インスタンスの取得

  // Weather Hacks

   var response = UrlFetchApp.fetch("http://weather.livedoor.com/forecast/webservice/json/v1?city=471020"); //URL + cityID

    if (response.getResponseCode() != 200) {
        return false;
    }
    var json = JSON.parse(response.getContentText());

    var public = json["publicTime"]; //天気取得時間
    var forecast = json["forecasts"][0]["telop"]; //今日の天気 配列で指定 [0]が今日 [1]が明日...
    var text = json["description"]["text"]; //天気概況文
    var image = json["forecasts"]["image"];

  var message = "今日の天気は、[" + forecast + "]はこれです。\n  実況文 [" + text + "]\n [" + image + "]";

  return app.postMessage("#bot", message, {
    username: bot_name,
    icon_url: bot_icon
  });
}
