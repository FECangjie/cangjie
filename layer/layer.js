/**
 * Created by chao.qin.CJ on 16/7/29.
 */
window.dom = document;

+function () {
    //静态参数
    var static_data = {

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