function postSlackMessage() {
  var token = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');
  var bot_name = "Mikubot";
  var bot_icon = "https://i.imgur.com/3yzyQ9T.jpg"; //icon_URL

  var app = SlackApp.create(token); //SlackApp �C���X�^���X�̎擾

  // Weather Hacks

   var response = UrlFetchApp.fetch("http://weather.livedoor.com/forecast/webservice/json/v1?city=471020"); //URL + cityID

    if (response.getResponseCode() != 200) {
        return false;
    }
    var json = JSON.parse(response.getContentText());

    var public = json["publicTime"]; //�V�C�擾����
    var forecast = json["forecasts"][0]["telop"]; //�����̓V�C �z��Ŏw�� [0]������ [1]������...
    var text = json["description"]["text"]; //�V�C�T����
    var image = json["forecasts"]["image"];

  var message = "�����̓V�C�́A[" + forecast + "]�͂���ł��B\n  ������ [" + text + "]\n [" + image + "]";

  return app.postMessage("#bot", message, {
    username: bot_name,
    icon_url: bot_icon
  });
}
