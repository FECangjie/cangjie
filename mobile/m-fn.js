/**
 * Created by chao.qin.CJ on 16/7/29.
 */
window.dom = document;

+function () {
    //静态参数
    var static_data = {
        //js常量
        event: 'click', //事件
        true: 'true',

        //链接地址（图片等）
        svg_bindvalidthru: '../../resource/font/bindvalidthru.svg',
        svg_cvv2: '../../resource/font/cvv2.svg',
        img_loading: './../resource/images/loading.gif',
        //接口
        IF_validatePasswordExist: '../app/validatePasswordExist',//验证密码是否存在
        IF_getCardBinInfo: '/app/getCardBinInfo/',//获取卡信息
        IF_verify: '/app/verify/',//实名
        IF_bindCard: '/app/bindCard/',//绑卡
        IF_verifyConfirm: '/app/verifyConfirm/',//实名认证确认
        IF_bindCardConfirm: '/app/bindCardConfirm/',//绑卡确认
        IF_sendSmsAgain: '/app/sendSmsAgain/', //短信重发
        IF_sendSmsAgainPassword: '../sendSmsAgain', //短信重发
        IF_validateMemberStatus: '../app/validateMemberStatus', //短信会员状态
        IF_addAuthRrecord: '../app/addAuthRrecord',
        IF_confirmUserInfo: '../confirmUserInfo/',
        IF_bindConfirm: '../bindConfirm/',
        IF_verifyTradePassword: '../app/verifyTradePassword',
        IF_generateSecurityOperationRecord: '../app/generateSecurityOperationRecord',
        IF_setTradePassword: '../app/setTradePassword',
        IF_forgetPasswordPageData: '../app/forgetPasswordPageData', //卡列表
        //地址
        url_verify: 'view/verify',
        url_debit: 'view/bindDebitCard',
        url_credit: 'view/bindCreditCard',
        url_forgetPwdDebit: 'view/forgetPwdDebit',
        url_forgetPwdCredit: 'view/forgetPwdCredit',
        //常量
        card_type_credit: 'CREDITCARD',
        card_type_debit: 'DEBITCARD',
        certificateType_IDENTITY_CARD: 'IDENTITY_CARD',
        businessType_VERIFY: 'VERIFY',
        businessType_BIND_CARD: 'BIND_CARD',
        validateCode_error_code: 'USB000062',
        authRecordTypeEnum: 'RESETPWD',
        passwordBizType_MODIFY: 'MODIFY'
    };
    window.sd = static_data;
}();

+function () {
    /**
     * 全局函数
     * @type {{init: init, validate: validate, btnState: btnState, foramt: foramt, ajax: ajax, clearValue: clearValue, layer: {toast: toast, mobDate: mobDate, loading: loading, prompt: prompt, close: close}}}
     */
    window.fn = {
        init: function () {
            //初始化函数

            //测试
            initUrl = '';
            //initUrl = 'http://localhost:8004/pp-user-app/app/';
            //测试结束

            //标题返回事件
            +function () {
                function goToUrl(){
                    var backNode = this;
                    backNode.removeEventListener(sd.event, goToUrl, false);
                    function indexBack(backNode,type){//指定地址和指定情况的取消按钮
                        if(type == 'set') {//设置密码
                            fn.layer.prompt('提示', "是否取消设置支付密码", ["否", "是"], [function () {
                                fn.layer.close();
                                backNode.addEventListener(sd.event, goToUrl, false);
                            }, function () {
                                if (sessionStorage.getItem("findPwdUrl")){//如果从找回密码过来
                                    location.assign(sessionStorage.getItem("findPwdUrl"));
                                }else{
                                    location.assign(backNode.getAttribute('data-back'));
                                }
                                fn.layer.close();
                            }]);
                        }else if(type == 'modify'){//修改密码
                            fn.layer.prompt('提示', "是否放弃修改支付密码", ["否", "是"], [function () {
                                backNode.addEventListener(sd.event, goToUrl, false);
                                fn.layer.close();
                            }, function () {
                                if (sessionStorage.getItem("findPwdUrl")){
                                    location.assign(sessionStorage.getItem("findPwdUrl"));
                                }else {
                                    location.assign(backNode.getAttribute('data-back'));
                                }
                                fn.layer.close();
                            }]);
                        }
                    }
                    if (this.getAttribute('data-back')) {//指定地址的取消按钮
                        if(this.getAttribute('data-back-type')){
                            indexBack(backNode,this.getAttribute('data-back-type'))
                        }else{//默认返回地址 无弹窗直接跳转
                            location.assign(this.getAttribute('data-back'));
                        }
                    }
                    else window.history.back();//历史记录上一页
                }

                if (document.querySelector('.qu-title')) {
                    function backIcon(backNode) {//返回图标
                        backNode.addEventListener(sd.event, goToUrl, false);
                    }
                    backIcon(document.querySelectorAll('.qu-title')[0].childNodes[1]);
                }
            }();
            +function () {//用户输入 快速删除
                var inputs = document.querySelectorAll('[data-input=user]');
                var delIcon = 'icon-shanchu';
                for (var i = 0; i < inputs.length; i++) {
                    if(inputs[i].id == 'validateCode') return;
                    inputs[i].addEventListener('input', function () {//输入框变动
                        fn.inputQuickDelete(this);
                    }, false);
                }
            }();
            +function () {//条款选择框
                function btnStyle(icon,btn){//按钮样式
                    icon.classList.contains('icon-fuxuankuangyixuanze-copy') ? btn.classList.add('disabled-lock') : btn.classList.remove('disabled-lock');
                    icon.classList.toggle('icon-fuxuankuangyixuanze-copy');
                    icon.classList.toggle('icon-fuxuankuangweixuanze');
                }
                if (document.querySelector('#qu-item')) {
                    if (document.querySelector('#qu-item').getElementsByTagName('i')) {
                        document.querySelector('#qu-item').getElementsByTagName('i')[0].addEventListener(sd.event, function () {//icon绑定事件
                            btnStyle(this,document.querySelector('#next-btn'));

                        }, false);
                    }
                }
            }();
            +function () {//加载提示弹窗
                var iconClass = '.icon-worn';
                var layers = dom.querySelectorAll(iconClass);
                var title = '',text = '';
                function layerType(type){//判断提示框类别
                    if('mobilePhone' == type){
                        title = '手机号说明';
                        text = '银行预留手机号为办理该银行卡时所填写的手机号。若手机出现变更、忘记等情况，请直接联系该银行客服。';
                    }else if('bindvalidthru' == type){
                        title = '有效期说明';
                        text = '<img src="'+sd.svg_bindvalidthru+'">';
                        text += '有效期是打印在信用卡后面下方，形如MM/YY一串数字';
                    }else if('cvv2' == type){
                        title = '安全码说明';
                        text = '<img src="'+sd.svg_cvv2+'">';
                        text += '安全码是打印在信用卡背面条纹中后三位数字';
                    }else if('mobilePhone' == type){

                    }
                    fn.layer.promptTitle(title,text,"我知道了",function () {
                        fn.layer.close();
                    });
                }
                for(var i=0;i<layers.length;i++){//创建icon点击事件
                    layers[i].addEventListener(sd.event,function(){
                        layerType(this.getAttribute('data-layer'))
                    },false);
                }
            }();
            +function onlyNumber() {
                /*
                 * 输入框只允许输入数字和空格
                 * 使用方法：在HTML添加自定义属性onlynumber
                 *  <input type="text" onlynumber>
                 * */
                var inputs = document.querySelectorAll("input[onlynumber]");
                for (var i = 0, l = inputs.length; i < l; i++) {
                    inputs[i].addEventListener("input", _num.bind(inputs[i]), false);
                }
                function _num() {
                    this.value = this.value.replace(/[\D]/g, "");
                }
            }();
            +function() {
                /*
                 * 输入框只允许输入数字和Xx
                 * 使用方法：在HTML添加自定义属性onlynumberandx
                 *  <input type="text" onlynumberandx>
                 * */
                var inputs = document.querySelectorAll("input[onlynumberandx]");
                for (var i = 0, l = inputs.length; i < l; i++) {
                    inputs[i].addEventListener("input", _num.bind(inputs[i]), false);
                }
                function _num() {
                    this.value = this.value.replace(/[^\dXx]/g, "");
                }
            }();
            +function () {
                /**
                 * author: 737033917@qq.com
                 * phone: 13844021657
                 * lastModifiedDate: 2016.08.09
                 * plugName: format-input
                 * description: 输入框数字格式化，默认4位一空格
                 */
                'use strict';
                var version = '1.0.0';
                //获取格式化元素
                var inputs = document.body.querySelectorAll('input[data-format]');
                for (var i = 0, l = inputs.length; i < l; i++) {
                    inputs[i].addEventListener("input", _bindHandler, false);
                    _bindHandler.call(inputs[i], event, "auto");
                }
                function _bindHandler(event, type) {
                    var digit = Math.round(this.dataset.digit) || 4;
                    if (this.value.length <= digit) {
                        return;
                    }
                    format.call(this, event, digit, type);
                }

                function format(event, digit, type) {
                    var str = this.value.replace(/[\s\n\r]/g, "");
                    this.value = str.replace(/(\d{4})/g, '$1 ').replace(/\s$/, '')
                }
            }();
            +function(){//input赋值缓存内容
                var sessions = {
                    name: 'name',
                    credentialsNo: 'credentialsNo',
                    bankCardNum: 'bankCardNum',
                    cvv2: 'cvv2',
                    bindvalidthru: 'bindvalidthru',
                    mobilePhone: 'mobilePhone'
                };
                var input = '',value = '';
                for(var key in sessions){
                    input = dom.querySelector('input[id="'+sessions[key]+'"]');
                    value = sessionStorage.getItem(sessions[key]);
                    if(input && value && input.getAttribute('record')){
                        if(sessions[key] == 'bankCardNum'){
                            input.value = fn.format(value);
                        }else {
                            input.value = value;
                        }
                        fn.inputQuickDelete(input);
                    }
                }
            }();

        },
        inputQuickDelete: function(input){//用户输入 快速删除
            var delIcon = 'icon-shanchu';
            var _this = input, iBtn = _this.parentNode.querySelector('.'+delIcon);
            if (!iBtn) {
                _this.parentNode.insertAdjacentHTML('beforeEnd', '<i class="iconfont '+delIcon+'"></i>');
                iBtn = _this.parentNode.querySelector('.'+delIcon);
            }
            if (_this.value) {
                iBtn.addEventListener(sd.event, function () {//x icon点击事件
                    _this.value = '';
                    iBtn.remove();//删除节点
                    fn.btnState();
                    if (document.querySelector('#mobilePhone') && document.querySelector('#btn-code')) {
                        fn.btnCodeState(document.querySelector('#mobilePhone'), document.querySelector('#btn-code'));
                    }
                }, false);
            } else {
                iBtn.remove();
            }
        },
        format: function(str){//添加空格
            return str.replace(/(\d{4})/g, '$1 ').replace(/\s$/,'');
        },
        trim: function(str) {
            return str.replace(/\s/g,'');
        },
        //格式校验
        validate: function (els) {
//        验证表单合法性
            var rule = {
                name: {required: true, format: /[\u4e00-\u9fa5]/gm},
                credentialsNo: {required: true, format: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/},
                bankCardNum: {required: true, format: /^[0-9]{4}[0-9]{4}[0-9]{4}[0-9]{7}|[0-9]{4}[0-9]{4}[0-9]{7}$/},
                cvv2: {required: true, format: /^\d{3}$/},
                bindvalidthru: {required: true, format: /^[0-1][0-9]\/[0-2][0-9]$/},
                mobilePhone: {required: true, format: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/},
                validateCode: {required: true, format: /^\d{6}$/}
            };
            var message = {
                name: {
                    required: "姓名不能为空",
                    format: "姓名只能为中文"
                },
                credentialsNo: {
                    required: "身份证号不能为空",
                    format: "身份证号格式错误"
                },
                bankCardNum: {
                    required: "银行卡号不能为空",
                    format: "银行卡号格式错误"
                },
                cvv2: {
                    required: "安全码不能为空",
                    format: "安全码为三位数字"
                },
                bindvalidthru: {
                    required: "有效期不能为空",
                    format: "有效期格式不正确"
                },
                mobilePhone: {
                    required: "手机号不能为空",
                    format: "手机号格式不正确"
                },
                validateCode: {
                    required: "请输入验证码",
                    format: "验证码为六位数字"
                }

            };
            var inputs = document.querySelectorAll('[data-form]'), name;
            var type = /text|tel|password|email|number|url|data/;
            for (var i = 0, l = inputs.length; i < l; i++) {
                name = inputs[i].getAttribute('data-form');
                if (els && els.indexOf(name) == -1) {
                    continue;
                }
                if (type.test(inputs[i].type)) {
                    if (rule[name].required) {
                        if (inputs[i].value == "") {
                            fn.layer.toast(message[name].required);
                            return false;
                        }
                    }
                    if (!rule[name].format.test(fn.trim(inputs[i].value))) {
                        fn.layer.toast(message[name].format);
                        return false;
                    }
                }
            }
            return true;
        },
        btnState: function () {//按钮状态
            var flag;
            var array = dom.querySelectorAll('input[data-input=user]');
            var btn = dom.querySelector('#next-btn');
            var isBtnDisable = function (btn) {
                flag = true;
                for (var i=0;i<array.length;i++) {
                    if (array[i].value == '') flag = false;
                }
                flag ? btn.classList.remove('disabled'):btn.classList.add('disabled');
            };
            isBtnDisable(btn);
            var inputs = document.querySelectorAll('input');
            for (var i = 0; i < inputs.length; i++) {
                inputs[i].addEventListener('input', function () {
                    isBtnDisable(btn)
                }, false);
            }
        },
        btnCodeState: function(mobilePhone,msgBtn){//发送短信按钮状态
            function isDisabled(mobilePhone,msgBtn){
                if(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(mobilePhone.value)){
                    msgBtn.classList.remove('disabled');
                }else{
                    msgBtn.classList.add('disabled');
                }
            }
            isDisabled(mobilePhone,msgBtn);
            mobilePhone.addEventListener('input',function(){
                isDisabled(mobilePhone,msgBtn)
            },false);
        },
        //重发短信读秒
        validateCode: function (_obj, state) {
            if ('sems' == state) codetime = 59;//倒计时长，单位秒(按需自定义)
            else codetime = 0;
            timing(codetime);
            function timing(i) {
                if (i > 0 && codetime != 0) {
                    if (i == codetime) {
                        _obj.setAttribute('data-state', 'chill-down');
                        _obj.classList.add('again');
                        _obj.innerHTML = i + 's后可重发';
                    }
                    setTimeout(function () {
                        i--;
                        _obj.innerHTML = i + 's后可重发';
                        timing(i);
                    }, 1000);
                } else {
                    _obj.classList.remove('again');
                    _obj.innerHTML = '重新发送';
                }
            }
        },
        foramt: function () {
            //数字格式化
            for (var i in arguments) {
                arguments[i].addEventListener('input', function () {
                    this.value = this.value.replace(/\D/g, '');
                });
            }
        },
        ajax: function (url, data, success, error, options) {
            $.ajax({
                timeout: 30000,
                url: initUrl + url,
                type: 'POST',
//                headers: {"api-version": "1.0"},
                data: data == null ? {} : data,
                dataType: "JSON",
                crossDomain: true,
                beforeSend: function (request) {
                    console.log('与服务器创建连接。发送数据：');
                    console.log(data);
//                console.log('数据加密处理结果：');
                    //data.data = wallet.tools.crypto.encrypt(wallet.tools.stringify(data.data),data.encrypt_token);
//                console.log(data.data);
                    if (options) {
                        if (options.loading == 'off') return;
                    }
                    fn.layer.loading()
                },
                success: function (result, status, xhr) {
                    fn.layer.close();
                    if (console) {
                        console.log("访问接口[" + url + "]成功,结果如下:");
                        console.trace(result);
                    }
                    if (success) success(result, status, xhr);
                },
                error: function (data, type) {
                    fn.layer.close();
                    if (type == 'timeout') fn.layer.prompt('提示', "连接超时。。", "重新输入", function () {
                        fn.layer.close();
                    });
                    if (error) error();
                    console.log("访问接口[" + url + "]失败！");
                    console.log(type + " 错误,请联系管理员");
                    fn.layer.toast('访问接口失败：' + type);
                }
            })
        },
        passwordInitValidate: function(password){//连续或重复返回true
            var regex = /^(\d)\1{5}$/;
            if(regex.test(password)){
                return '相同'
            }
            return validate(password);
            function validate(text){
                for(var i=0;i<text.length;i++)
                {
                    if(Math.abs(text[0]-text[i]) != i)  {
                        return false
                    }
                }
                return '连续';
            }
        },
        //六位密码归位
        clearValue: function () {
            document.querySelector('#password-value').value = '';
            var active = document.querySelector('#password-ul').children;
            for (var i = 0; i < active.length; i++) {
                active[i].innerHTML = '';
            }
        },
        layer: {
            /**
             * 层 函数
             * @param str
             */

            //tosat提示窗
            toast: function (str) {
                dom.querySelector('body').insertAdjacentHTML('beforeEnd','<div id="toast" class="toast off"></div>');
                var toast = dom.querySelector('#toast');
                if (str == '' || str == undefined || str == 'undefined') str = '操作失败。请核对输入信息';
                toast.innerHTML = str;
                toast.style.display = 'table';
                toast.style.marginLeft = - toast.clientWidth/2+'px';
                setTimeout(function () {
                    toast.style.opacity = 0.8;
                }, 1);
                clearTimeout(window.timeTosat);
                window.timeTosat = setTimeout(function () {
                    toast.style.opacity = 0;
                    toast.remove();
                }, 3000);
            },
            mobDate: function (obj, val) {//日期选择(jquery)
                var _obj = $(obj);
                var now = new Date();
                var str = val ? val : 'mm/y';
                _obj.mobiscroll().date({
                    theme: 'mobiscroll',
                    lang: 'zh',
                    diaplay: 'bottom',
                    dateOrder: 'mmyy',
                    dateFormat: str,
                    mode: 'Scroller',
                    minWidth: 150,
                    startYear: now.getFullYear() - 10,
                    endYear: now.getFullYear() + 10,
                    headerText: function () {
                        return '日期选择';
                    },
                    onSelect:function(valueText,inst){
                        obj.value = valueText;
                        fn.btnState()
                    }
                });
                $('datetimeDate-show').on(sd.event, function () {
                    _obj.mobiscroll('show');
                    return false;
                });
            },

            //加载动画
            loading: function () {
                var str = '', body = document.querySelector('body');
                var _body = $(body);
                str += '<div id="loading">';
                str += '<div class="loading-mask"></div><div id="loading-center">';
                str += '<div id="loading-center-absolute">';
                str += '<img class="loading-img" src="'+sd.img_loading+'">';
                str += '</div></div></div>';
                _body.append(str);
            },
            prompt: function (title, text, btnText, callBack) {
                /*
                 * title 标题
                 * text 提示文字  type:string
                 * btnText 按钮文字  type:string or array
                 * callBack按钮回调函数 type:function or array
                 *  如果是多个按钮，回调函数和btnText数组一一对应
                 *
                 *  ex:
                 *  fn.prompt('提示',"连接超时。。", "重新输入",function () {
                 fn.clearValue();
                 });
                 fn.layer.prompt('提示',"密码错误", ["重新输入", "忘记密码"], [function () {
                 alert("重新输入");
                 fn.layer.close();
                 }, function () {
                 alert("忘记密码");
                 fn.layer.close();
                 }]);
                 * */
                "use strict";
                var btnHtml = Array.isArray(btnText) ? createBtnGroup() : '<button class="xcd-prompt-control one-button">' + btnText + '</button>';

                function createBtnGroup() {
//            创建按钮组
                    var str = "";
                    for (var i = 0, l = btnText.length; i < l; i++) {
                        str += '<button class="xcd-prompt-control">' + btnText[i] + '</button>';
                    }
                    return str;
                }

                function bindEvent() {
//           按钮绑定回调
                    var btn = document.querySelectorAll(".xcd-prompt-control");
                    if (typeof callBack == "function") {
                        btn[0].addEventListener("click", callBack, false);
                    } else if (Array.isArray(callBack)) {
                        for (var i = 0, l = btn.length; i < l; i++) {
                            btn[i].addEventListener(sd.event, callBack[i], false);
                        }
                    }
                }

                var html = '<div class="xcd-prompt"><div class="xcd-prompt-text"><span>' + text + '</span></div><div class="xcd-btn-group">' + btnHtml + '</div></div>';
                var mask = '<div id="mask"></div>';
                document.body.insertAdjacentHTML("beforeEnd", mask + html);
                bindEvent();
            },
            promptTitle: function (title, text, btnText, callBack) {
                /*
                 * title 标题
                 * text 提示文字  type:string
                 * btnText 按钮文字  type:string or array
                 * callBack按钮回调函数 type:function or array
                 *  如果是多个按钮，回调函数和btnText数组一一对应
                 *
                 *  ex:
                 *  fn.prompt('提示',"连接超时。。", "重新输入",function () {
                 fn.clearValue();
                 });
                 fn.layer.prompt('提示',"密码错误", ["重新输入", "忘记密码"], [function () {
                 alert("重新输入");
                 fn.layer.close();
                 }, function () {
                 alert("忘记密码");
                 fn.layer.close();
                 }]);
                 * */
                "use strict";
                var btnHtml = Array.isArray(btnText) ? createBtnGroup() : '<button class="xcd-prompt-control one-button">' + btnText + '</button>';

                function createBtnGroup() {
//            创建按钮组
                    var str = "";
                    for (var i = 0, l = btnText.length; i < l; i++) {
                        str += '<button class="xcd-prompt-control">' + btnText[i] + '</button>';
                    }
                    return str;
                }

                function bindEvent() {
//           按钮绑定回调
                    var btn = document.querySelectorAll(".xcd-prompt-control");
                    if (typeof callBack == "function") {
                        btn[0].addEventListener("click", callBack, false);
                    } else if (Array.isArray(callBack)) {
                        for (var i = 0, l = btn.length; i < l; i++) {
                            btn[i].addEventListener(sd.event, callBack[i], false);
                        }
                    }
                }
                function getHeight(id){
                    var el = dom.querySelector(id);
                    el.style.marginTop = -el.clientHeight/2 + 'px'
                }

                var html = '<div class="xcd-prompt" id="xcd-prompt"><div class="xcd-prompt-title">' + title + '</div><div class="xcd-prompt-text"><span>' + text + '</span></div><div class="xcd-btn-group">' + btnHtml + '</div></div>';
                var mask = '<div id="mask"></div>';
                document.body.insertAdjacentHTML("beforeEnd", mask + html);
                getHeight('#xcd-prompt');
                bindEvent();
            },
            //清除层
            close: function () {
                document.querySelector('.xcd-prompt') ? document.querySelector('.xcd-prompt').remove() : {};
                document.querySelector('#mask') ? document.querySelector('#mask').remove() : {};
                document.querySelector('#loading') ? document.querySelector('#loading').remove() : {};
            }
        }

    };
    fn.init();
}(window);