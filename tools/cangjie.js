/**
 * Created by chao.qin.CJ on 16/8/17.
 */
window.dom = document;
window.body = document.body;

+function () {//静态参数
    var static_data = {
        //js常量
        event_click: 'click', //事件
        true: 'true'
    };
    window.sd = static_data;
}();


var Cj = Object.create(null, {
    init: {//初始化调用函数
        value: +function () {

        }()
    },
    onlyNumber: {//输入框只允许输入数字和空格
        value: function () {
            /*
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
        }
    },
    inputFormat: {//输入框数字格式化
        value: function () {
            /**
             * author: 737033917@qq.com
             * phone: 13844021657
             * lastModifiedDate: 2016.08.09
             * plugName: inputFormat
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

            function format(event, digit, type) {//添加空格
                var str = this.value.replace(/[\s\n\r]/g, "");
                this.value = str.replace(/(\d{4})/g, '$1 ').replace(/\s$/, '')
            }

            function trim(str) {//删除空格
                return str.replace(/\s/g, '');
            }
        }
    },
    validate: {//格式校验
        value: function (els) {
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
        }
    },
    passwordValidate: {//密码校验
        value: function (password) {
            var regex = /^(\d)\1{5}$/;
            if (regex.test(password)) {
                return '相同'
            }
            return validate(password);
            function validate(text) {
                for (var i = 0; i < text.length; i++) {
                    if (Math.abs(text[0] - text[i]) != i) {
                        return false
                    }
                }
                return '连续';
            }
        }
    },
    serialize: {//表单序列化
        value: function (form) {
            /**
             * author:737033917@qq.com
             * phone:13844021657
             * lastModifiedDate:2016.7.28
             * plugName:serialize
             * description:表单序列化成一个字符串
             */
            'use strict';
            var version = '1.0.0';

            var str = "";
            var reg = /text|tel|password|hidden|number|time|date|month/;
            var form = typeof form == "string" ? document.querySelector("#" + form) : form;
            var inputs = form.elements;
            for (var i = 0, l = inputs.length; i < l; i++) {
                if (reg.test(inputs[i].type) && inputs[i].name != "") {
                    if (Boolean(str)) {
                        str += "&" + inputs[i].name + "=" + inputs[i].value;
                    } else {
                        str += inputs[i].name + "=" + inputs[i].value;
                    }
                }
            }
            return str;
        }
    }

});

+function (exports) {//处理ajax请求
    'use strict';
    var version = '1.0.0';

    function ajax(options) {
        var _options = {
            async: true,
            method: "GET",
            url: location.href,
            data: "",
            username: "",
            password: "",
            timeout: 5000,
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
        }
        if (typeof options == "object") {
            for (var key in options) {
                _options[key] = options[key];
            }
        }
        _options.formData = typeof _options.formData == "string" ? _options.formData = document.querySelector("#" + _options.formData) : _options.formData;
        var xhr = new XMLHttpRequest();
        var formData = typeof _options.formData ? new FormData(_options.formData) : _options.formData;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                    typeof _options.success == "function" ? _options.success(xhr.responseText, xhr.status, xhr) : false;
                } else {
                    typeof _options.error == "function" ? _options.error(xhr.status, xhr) : false;
                }
            }

        }
        xhr.timeout = _options.timeout;
        xhr.ontimeout = _options.timeoutCallback || null;
        var dataStr = "";

        +function _generator() {//数据转换成字符串发送给服务器
            var step = 0;
            for (var key in _options.data) {
                if (step) {
                    dataStr += "&" + key + "=" + _options.data[key];
                } else {
                    step++;
                    dataStr += key + "=" + _options.data[key];
                }
            }
            if (_options.formData) {
                for (var attr in _options.data) {
                    formData.appendChild(attr, _options.data[attr]);
                }
            }
        }();
        if (_options.method == "GET") {
            dataStr != "" ? xhr.open(_options.method, _options.url + "?" + dataStr, _options.async) : xhr.open(_options.method, _options.url, _options.async);
            xhr.setRequestHeader("Content-Type", _options.contentType);
            xhr.send();
        } else {
            xhr.open(_options.method, _options.url, _options.async);
            xhr.setRequestHeader("Content-Type", _options.contentType);
            if (_options.formData) {
                xhr.send(formData);
                return;
            }
            xhr.send(_options.data);
        }
    }

    exports.fn.ajax = ajax;
}();