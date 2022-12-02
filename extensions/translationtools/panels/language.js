'use strict';
let E2C=Editor.I18n.t('translationtools.E2C');
let C2E=Editor.I18n.t('translationtools.C2E');
let translation=Editor.I18n.t('translationtools.translation');
exports.template = 
`
<div >
<ui-label class="ui-label1" value='i18n:translationtools.original'></ui-label>
<ui-textarea class="input1"  value=""></ui-textarea>
</div>

<div>
<ui-label class="ui-label1" value='i18n:translationtools.translation'></ui-label>
<ui-textarea class="input2" value=""></ui-textarea>
</div>

<div>
<ui-button class='button1' > ${translation} </ui-button>

<ui-select readonly>
    <option value="1">${E2C}</option>
    <option value="2">${C2E}</option>
</ui-select>
</div>

<div >
<ui-label class='tips' value=''></ui-label>
</div>

<div>
<ui-label  value='i18n:translationtools.original'></ui-label>
<video class='video1'  controls="" src=""  name="media">
</video>
</div>
<div>
<ui-label  value='i18n:translationtools.translation'></ui-label>
<video class='video2' controls="" src=""  name="media">
</video>
</div>
`;

exports.style =
`
.ui-label1 {margin:15px 5% ;line-height:100%}
ui-label {margin:15px 5%}
ui-textarea {margin:15px 5% 5px;width:70%;}
ui-button {margin:5px 5% }
ui-select {margin:5px 5% }
video {margin:0px 20% 5px;width:70%;}
`
exports.$={
    btn:".button1",
    input1:".input1",
    input2:".input2",
    btn2:".button2",
    select:'ui-select',
    tips:'.tips',
    video:".video1",
    video2:".video2"
}

exports.methods={


    httpget(str){
        let self=this;
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function (data) {
            let readyState = xhr.readyState, status = xhr.status, statusText = xhr.statusText;
            if (readyState == 4 && status == 200) {
                let response = xhr.responseText;
                let data = JSON.parse(response);
                if(data.type=='EN2ZH_CN'){
                    self.$.input2.value=data['translateResult'][0][0]['tgt'];
                    // self.$.video.src="https://fanyi.baidu.com/gettts?lan=zh&text="+data['translateResult'][0][0]['tgt'] +"&spd=5&source=web";
                    self.$.select.value=1;
                }else if(data.type=='ZH_CN2EN'){
                    self.$.input2.value=data['translateResult'][0][0]['tgt'];
                    self.$.select.value=2;
                    // self.$.video.src='https://dict.youdao.com/dictvoice?type=0&audio='+data['translateResult'][0][0]['tgt'];
                }
                if(self.$.select.value==1){
                    self.$.video.src='https://dict.youdao.com/dictvoice?type=0&audio='+self.$.input1.value;
                    self.$.video2.src="https://fanyi.baidu.com/gettts?lan=zh&text="+ self.$.input2.value+"&spd=5&source=web";
                }else{
                    self.$.video.src='https://fanyi.baidu.com/gettts?lan=zh&text='+self.$.input1.value+"&spd=5&source=web";
                    self.$.video2.src="https://dict.youdao.com/dictvoice?type=0&audio="+ self.$.input2.value;
                }
                
            } else if (status >= 400 && status < 600) {
                
            } else {
                
            }
        }
        let url='https://fanyi.youdao.com/translate?&doctype=json&type=AUTO&i='
        xhr.withCredentials = true;
        xhr.open("GET", url+str, true);
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST');
        xhr.setRequestHeader('Access-Control-Allow-Headers', 'x-requested-with,content-type,authorization');
      
        xhr.send();
    }
}

// 面板启动后触发的钩子函数
exports.ready = function() {
    this.$.btn.addEventListener('confirm',function(){
        let EnglishInput=this.$.input1.value;
        // let chineseInput=this.$.input2.value;
              if(EnglishInput){
                this.$.tips.value=''
                this.httpget(EnglishInput)
              }else{
                  this.$.tips.value='没有正确的原文内容'
              }
         
         
    }.bind(this))

    // this.$.btn2.addEventListener('confirm',function(){
    //    this.$.input1.value='';
    //    this.$.input2.value='';
    // }.bind(this))
};

// 面板关闭后的钩子函数
exports.close = function() {};