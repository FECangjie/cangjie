/**
 * Created by chao.qin.CJ on 16/7/29.
 */
+function(){
    /**
     * 数字键盘组件
     */
    'use strict';
    var doc = document || window.document;
    var kb = {
        init: function(){
            //初始化
        },
        load: function(input, options){
            //加载数字键盘
            console.log('加载数字键盘');
            var self = this;
            var mobile = typeof orientation !== 'undefined';
            var body = doc.getElementsByTagName('body')[0];
            var DIV_ID = options && options.div_id || 'keyboard';
            if(doc.getElementById(DIV_ID)){
                body.removeChild(doc.getElementById(DIV_ID));
            }
            var TABLE_ID = 'keyboard-table';
            var btn = false;
            var maxLength = 6;
            this.el = doc.createElement('div');
            this.input = input;
            this.el.id = DIV_ID;
            this.el.className = DIV_ID;

            //数字键盘内容
            var btnStr = '';
            if(btn) {
                btnStr = '<div id="keyboard-btn" class="keyboard-btn"><i class="iconfont icon-xla"  id="kbtn-icon"></i>';
            }else{
                this.el.style.height = 217 + 'px';
            }
            var tableStr = '<table id="' + TABLE_ID + '" class="'+TABLE_ID+'" border="0" cellspacing="0" cellpadding="0">';
            tableStr += '<tr><td>1</td><td>2</td><td>3</td></tr>';
            tableStr += '<tr><td>4</td><td>5</td><td>6</td></tr>';
            tableStr += '<tr><td>7</td><td>8</td><td>9</td></tr>';
            tableStr += '<tr><td class="td-disabled"></td>';
            tableStr += '<td>0</td>';
            tableStr += '<td><i class="iconfont icon-jianpanshanchu"></i></td></tr>';
            tableStr += '</table>';
            this.el.innerHTML = btnStr + tableStr;

            //输入框赋值
            function addEvent(e){
                var clickEl = e.target;
                var num,newNum;
                var inputPwd;
                var value = clickEl.innerText;
                if(!clickEl.classList.contains('td-disabled')){
                    if(clickEl.classList.contains('iconfont')) clickEl = clickEl.parentElement;
                    clickEl.style.backgroundColor = '#e6e6e6';
                    clickEl.style.color = '#ffffff';
                }
                //获取第一字字符
                value = value.substr(0,1);
                //六位密码图标定位
                var six_payPassword = doc.querySelector('#password-ul');
                //密码框显示与输入框赋值
                var sixLi = six_payPassword.querySelectorAll('li');
                if(clickEl.classList.contains('td-disabled')) return;
                if(value != ""){
                    if(self.input){
                        num = self.input.value;
                        //赋值密码框函数
                        inputPwd = function(){
                            self.input.value += value;
                            num = self.input.value;
                            sixLi[num.length-1].innerHTML = '<span class="active"></span>';
                            if(num.length == maxLength){
                                //输出接口
                                console.log("提交密码：" + num);
                                setTimeout(function(){
                                    sp(num)
                                },300);//提交密码执行函数
                            }
                        };
                        if(num.length < maxLength) inputPwd();
                    }
                }else{
                    num = self.input.value;
                    if(num){
                        newNum = num.substr(0, num.length - 1);
                        self.input.value = newNum;
                        sixLi[newNum.length].innerHTML = "";
                    }
                }
            }
            //控制样式
            function delEvent(e){
                var clickEl = e.target;
                if(!clickEl.classList.contains('td-disabled')){
                    if(clickEl.classList.contains('iconfont')) clickEl = clickEl.parentElement;
                    clickEl.style.backgroundColor = '#ffffff';
                    clickEl.style.color = '#323232';
                }
            }
            //创建点击事件
            if(mobile){
                this.el.ontouchstart = addEvent;
                this.el.ontouchend = delEvent;
                this.el.ontouchmove = delEvent;
            }else{
                this.el.onmousedown = addEvent;
                this.el.onmouseup = delEvent;
            }
            body.appendChild(this.el);
        }
    };
    window.kb = kb;
    kb.init();
}();

+function () {
    'use strict';
    //触发键盘事件
    var doc = document || window.document;
    var pu = doc.querySelector('#password-ul');
    if (!pu) return;
    pu.addEventListener('click', function () {
        kb.load(doc.querySelector('#password-value'));
    }, false);
    kb.load(doc.querySelector('#password-value'));
}();