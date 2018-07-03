/*カレンダーのIDを取得*/
function get_Calendar() {
  var value_1 = PropertiesService.getScriptProperties().getProperty('CALENDAR_ID_Lecture'); //Google calendar ID
  var arrCals = [];
  arrCals.push(CalendarApp.getCalendarById(value_1));

  return arrCals;
}

/*今日の予定を取得するメインの関数*/
function get_Today_Schedule(){
  var arrCals = get_Calendar(); //カレンダーID取得
  var date = new Date();
  var strIntro = "おはようございます、マスター 初音ミクです。\n\n 【本日の予定】\n";
  var strBody = strIntro;

  /*カレンダーの本日のイベント取得*/
  for (var i = 0 ; i< arrCals.length ; i++){
    strBody = strBody + getEvents(arrCals[i],date);
  }

  if (strBody == strIntro){ //何も予定が入っていない場合
    strBody = "おはようございます。マスター！\nな、なんと！？今日は何も予定ありません\nゆっくり休んでくださいね。\n";
  }
  postSlackMessage(strBody);
}

/*カレンダーのイベント取得*/
function getEvents(Cals,getDate){
  var arrEvents = Cals.getEventsForDay(getDate);
  var strEvents ="";

  for (var i=0; i<arrEvents.length; i++){
    var strTitle = arrEvents[i].getTitle(); //タイトル名
    var strStart = _HHmm(arrEvents[i].getStartTime()); //開始時刻
    var strEnd = _HHmm(arrEvents[i].getEndTime()); //終了時刻
    if (strStart == strEnd){
      strEvents = strEvents + '終日イベント：' + strTitle + '\n'; //終日の場合
    }else{
      strEvents = strEvents + strStart + '～' + strEnd+ '：'  + strTitle + '\n'; //普通の予定
    }
  }
  return strEvents;
}

/*時間の表示変更*/
function _HHmm(str){
  return Utilities.formatDate(str,'JST','HH:mm');
}

function postSlackMessage(body) {
  var token = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');
  var bot_name = "Mikubot"; //botの名前
  var bot_icon = "https://i.imgur.com/3yzyQ9T.jpg";  //botのicon

  var app = SlackApp.create(token); //SlackApp インスタンスの取得

  //Weather
  var response = UrlFetchApp.fetch("http://weather.livedoor.com/forecast/webservice/json/v1?city=471020"); //URL + cityID

  if (response.getResponseCode() != 200) {
        return false;
  }
  var json = JSON.parse(response.getContentText());

  var public = json["publicTime"]; //天気取得時間
  var forecast = json["forecasts"][0]["telop"]; //今日の天気 配列で指定 [0]が今日 [1]が明日...
  var text = json["description"]["text"]; //天気概況文
  var image = json["forecasts"]["image"];

  var message = ""+ body +"\n 【本日の天気】\n 名護市は [" + forecast + "]\n \n 今日も一日頑張ってください！";

  return app.postMessage("#bot", message, {
    username: bot_name,
    icon_url: bot_icon
  });
}
