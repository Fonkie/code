define("/assets/lib/Form", ["$"], function (require, exports, module) {
    var $ = require("$");

    var Form = {
    
        showTip: function (ele, type, txt) {

            if (ele.hasClass("simpleTip")) {
                this.simpleTip(ele, type, txt);
                return;
            }

            var panel = ele.closest(".control-group");
            if (panel.size() > 0) {
                this.formTip(panel, type, txt);
                return;
            }

        },
        
        formTip: function (panel, type, txt) {
            var temPanel = panel.removeClass("error"),
                temTip = temPanel.find(".help-inline");
            switch (type) {
                case "err":
                    temPanel.addClass("error");
                    if (txt != "") {
                        temTip.html(txt);
                    }
                    break;
                case "tip":
                    txt = temTip.attr("data-info");
                    if (typeof(txt) != "undefined") {
                        temTip.html(txt);
                    }
                    break;
            }
        },
        
        simpleTip: function (ele, type, txt) {
            var temTip = ele;
            switch (type) {
                case "err":
                    if (txt != "") {
                        temTip.html(txt).css("color", "#b94a48");
                    }
                    break;
                case "ok":
                    temTip.html(txt).css("color", "#468847");
                    break;
                case "tip":
                    temTip.html("");
                    break;
            }
            temTip.show();
            setTimeout(function () {
                temTip.hide();
            }, 5000);
        },
        
        _getFormItem: function (panel) {
            var ret, checks, eles = panel.find("[name]");
            checks = eles.filter(":checked");//过滤radio，checkbox被选中的项
            eles = eles.not("[type=radio],[type=checkbox]");//剔除radio，checkbox项
            ret = eles.add(checks);//加入被选中的项
            return ret;
        },
        
        getParam: function (panel) {
            var me = this, flag = 1, p = {}, eles = me._getFormItem(panel);

            eles.each(function () {
                var ele = $(this);
                var txt = ele.val();
                txt = $.trim(txt);
                if (!txt) {
                    txt = ele.attr("data-defVal");
                    if (!txt && ele.attr("data-require") == 1) {
                        flag = 0;
                        me.showTip(ele, "err", "不能为空");
                    }
                }
                //多个表单域name相同时，用数组存储value值，如：p["desc"]=["a","b","c"]
                if (p[ele.attr("name")]) {
                    if ($.isArray(p[ele.attr("name")])) {
                        p[ele.attr("name")].push(txt);
                    } else {
                        p[ele.attr("name")] = [p[ele.attr("name")], txt];
                    }
                } else {
                    p[ele.attr("name")] = txt;
                }
            });
            return {data: p, flag: flag};
        },
        
        resetTip: function (panel) {
            var me = this;
            panel.find("[name]").each(function () {
                me.showTip($(this), "tip", "");
            });
        },
        
        resetVal: function (panel) {
            panel.find("[name]").not("[type=radio],[type=checkbox]").val("");
        },
        
        reset: function (panel) {
            this.resetTip(panel);
            this.resetVal(panel);
        },
        
        focus: function (panel) {
            var me = this;
            panel.find("[name]").filter("[type=text]").focus(function () {
                me.showTip($(this), "tip", "");
            });
        },
        
        setVal: function (panel, data) {
            if (!data) return;
            panel.find("[name]").each(function () {
                var ele = $(this), txt = data[$(this).attr("name")];
                //当为单选框时，需要特殊处理
                if (ele.attr["type"] == "radio" && ele.val() == txt) {
                    ele.prop("checked", true);
                    return;
                }
                if (ele.is("select")) {
                    ele.attr("data-curVal", txt);
                }
                ele.val(txt);
            });
        },
        
        setSelVal: function (ele, val, f) {
            ele.val(val);
            ele.find("option").prop("disabled", true);
            if (f) {
                ele.find("option[value=" + val + "]").prop("disabled", false);
            }
        },
        
        /**
         * 生成select的option项
         * @param data {array} 数据源源，格式：
         * 1、数字数组：[10,60,300],
         * 2、字符串数组：['max','min','avg']
         * 3、对象数组：[{value:0,text:"未启用"},{value:1,text:"启用"}]
         * @param valField {string} 代表option项值的字段名，默认值：value
         * @param txtField {string/array} 代表option项显示值的字段名，默认值：text
         * @param selVal {string}  被选中的值
         * @param bSaveRow {int}  是否保存记录行数据
         * @returns {string}  生成的html串
         */
        buildOptions: function (data, valField, txtField, selVal, bSaveRow) {
            var str = "<option value=''> </option>", val, txt, info;
            if (!$.isEmptyObject(data)) {
                for (var key in data) {
                    if ($.type(data[key]) == "string" || $.type(data[key]) == "number") {
                        info = txt = val = data[key];
                    } else {
                        if (!valField) {
                            valField = "value";
                        }
                        if (!txtField) {
                            txtField = "text";
                        }
                        val = data[key][valField];

                        if ($.isArray(txtField)) {
                            var temVal, arr = [];
                            for (var j in txtField) {
                                temVal = data[key][txtField[j]];
                                if (temVal) {
                                    arr.push(temVal);
                                }
                            }
                            txt = arr.join(" |  ");
                        } else {
                            txt = data[key][txtField];
                        }
                        if (bSaveRow && bSaveRow == 1) {
                            info = " data-info='" + JSON.stringify(data[key]) + "' ";
                        } else {
                            info = "";
                        }

                    }
                    str += "<option " + info + " title='" + txt + "' value='" + val + "'  " + (val == selVal ? "selected" : "") + ">" + txt + "</option>";
                }
            }
            return str;
        }
    };

    module.exports = Form;
});
