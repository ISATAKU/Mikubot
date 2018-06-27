/*カレンダーのIDを取得*/
function get_Calendar() {
  var arrCals = [];
  arrCals.push(CalendarApp.getCalendarById('59073gjopqp3d44f6vq6plkjro@group.calendar.google.com'));

  return arrCals;
}

/*今日の予定を取得するメインの関数*/
function get_Today_Schedule(){
  var arrCals = get_Calendar();//カレンダーID取得
  var date = new Date();
  var strIntro = "おはようございます。\n今日のうえはら家の予定です。\n" ;
  var strBody = strIntro;
  /*カレンダーの本日のイベント取得*/
  for (var i = 0 ; i< arrCals.length ; i++){
    strBody = strBody + getEvents(arrCals[i],date);
  }

  if (strBody == strIntro){
    strBody = "おはようございます。\n今日のうえはら家の予定はありません。\n" ;
  }
  postSlackMessage(strBody);
}

/*カレンダーのイベント取得*/
function getEvents(Cals,getDate){
  var arrEvents = Cals.getEventsForDay(getDate);
  var strName = Cals.getName();//カレンダーの名前取得
  var strEvents ="";

  for (var i=0; i<arrEvents.length; i++){
    var strTitle = arrEvents[i].getTitle();
    var strStart = _HHmm(arrEvents[i].getStartTime());//開始時刻
    var strEnd = _HHmm(arrEvents[i].getEndTime());//開始時刻
    if (strStart == strEnd){
      strEvents = strEvents + '終日イベント：' + strTitle + ' (' + strName + ')' + '\n';
    }else{
      strEvents = strEvents + strStart + '～' + strEnd+ '：'  + strTitle + ' (' + strName + ')' + '\n';
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
  var bot_name = "Mikubot";
  var bot_icon = "https://i.imgur.com/3yzyQ9T.jpg";

  var app = SlackApp.create(token); //SlackApp インスタンスの取得

  var message = ""+ body +"";

  return app.postMessage("#bot", message, {
    username: bot_name,
    icon_url: bot_icon
  });
}
