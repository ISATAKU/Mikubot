/*�J�����_�[��ID���擾*/
function get_Calendar() {
  var arrCals = [];
  arrCals.push(CalendarApp.getCalendarById('59073gjopqp3d44f6vq6plkjro@group.calendar.google.com'));

  return arrCals;
}

/*�����̗\����擾���郁�C���̊֐�*/
function get_Today_Schedule(){
  var arrCals = get_Calendar();//�J�����_�[ID�擾
  var date = new Date();
  var strIntro = "���͂悤�������܂��B\n�����̂����͂�Ƃ̗\��ł��B\n" ;
  var strBody = strIntro;
  /*�J�����_�[�̖{���̃C�x���g�擾*/
  for (var i = 0 ; i< arrCals.length ; i++){
    strBody = strBody + getEvents(arrCals[i],date);
  }

  if (strBody == strIntro){
    strBody = "���͂悤�������܂��B\n�����̂����͂�Ƃ̗\��͂���܂���B\n" ;
  }
  postSlackMessage(strBody);
}

/*�J�����_�[�̃C�x���g�擾*/
function getEvents(Cals,getDate){
  var arrEvents = Cals.getEventsForDay(getDate);
  var strName = Cals.getName();//�J�����_�[�̖��O�擾
  var strEvents ="";

  for (var i=0; i<arrEvents.length; i++){
    var strTitle = arrEvents[i].getTitle();
    var strStart = _HHmm(arrEvents[i].getStartTime());//�J�n����
    var strEnd = _HHmm(arrEvents[i].getEndTime());//�J�n����
    if (strStart == strEnd){
      strEvents = strEvents + '�I���C�x���g�F' + strTitle + ' (' + strName + ')' + '\n';
    }else{
      strEvents = strEvents + strStart + '�`' + strEnd+ '�F'  + strTitle + ' (' + strName + ')' + '\n';
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
  var bot_name = "Mikubot";
  var bot_icon = "https://i.imgur.com/3yzyQ9T.jpg";

  var app = SlackApp.create(token); //SlackApp �C���X�^���X�̎擾

  var message = ""+ body +"";

  return app.postMessage("#bot", message, {
    username: bot_name,
    icon_url: bot_icon
  });
}
