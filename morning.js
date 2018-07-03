/*�J�����_�[��ID���擾*/
function get_Calendar() {
  var value_1 = PropertiesService.getScriptProperties().getProperty('CALENDAR_ID_Lecture'); //Google calendar ID
  var arrCals = [];
  arrCals.push(CalendarApp.getCalendarById(value_1));

  return arrCals;
}

/*�����̗\����擾���郁�C���̊֐�*/
function get_Today_Schedule(){
  var arrCals = get_Calendar(); //�J�����_�[ID�擾
  var date = new Date();
  var strIntro = "���͂悤�������܂��A�}�X�^�[ �����~�N�ł��B\n\n �y�{���̗\��z\n";
  var strBody = strIntro;

  /*�J�����_�[�̖{���̃C�x���g�擾*/
  for (var i = 0 ; i< arrCals.length ; i++){
    strBody = strBody + getEvents(arrCals[i],date);
  }

  if (strBody == strIntro){ //�����\�肪�����Ă��Ȃ��ꍇ
    strBody = "���͂悤�������܂��B�}�X�^�[�I\n�ȁA�Ȃ�ƁI�H�����͉����\�肠��܂���\n�������x��ł��������ˁB\n";
  }
  postSlackMessage(strBody);
}

/*�J�����_�[�̃C�x���g�擾*/
function getEvents(Cals,getDate){
  var arrEvents = Cals.getEventsForDay(getDate);
  var strEvents ="";

  for (var i=0; i<arrEvents.length; i++){
    var strTitle = arrEvents[i].getTitle(); //�^�C�g����
    var strStart = _HHmm(arrEvents[i].getStartTime()); //�J�n����
    var strEnd = _HHmm(arrEvents[i].getEndTime()); //�I������
    if (strStart == strEnd){
      strEvents = strEvents + '�I���C�x���g�F' + strTitle + '\n'; //�I���̏ꍇ
    }else{
      strEvents = strEvents + strStart + '�`' + strEnd+ '�F'  + strTitle + '\n'; //���ʂ̗\��
    }
  }
  return strEvents;
}

/*���Ԃ̕\���ύX*/
function _HHmm(str){
  return Utilities.formatDate(str,'JST','HH:mm');
}

function postSlackMessage(body) {
  var token = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');
  var bot_name = "Mikubot"; //bot�̖��O
  var bot_icon = "https://i.imgur.com/3yzyQ9T.jpg";  //bot��icon

  var app = SlackApp.create(token); //SlackApp �C���X�^���X�̎擾

  //Weather
  var response = UrlFetchApp.fetch("http://weather.livedoor.com/forecast/webservice/json/v1?city=471020"); //URL + cityID

  if (response.getResponseCode() != 200) {
        return false;
  }
  var json = JSON.parse(response.getContentText());

  var public = json["publicTime"]; //�V�C�擾����
  var forecast = json["forecasts"][0]["telop"]; //�����̓V�C �z��Ŏw�� [0]������ [1]������...
  var text = json["description"]["text"]; //�V�C�T����
  var image = json["forecasts"]["image"];

  var message = ""+ body +"\n �y�{���̓V�C�z\n ����s�� [" + forecast + "]\n \n ����������撣���Ă��������I";

  return app.postMessage("#bot", message, {
    username: bot_name,
    icon_url: bot_icon
  });
}
