layui.use(['form', 'layer'], function () {
    const form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery;

    $(".truename").attr("value", $.cookie("truename"));

    //添加验证规则
    form.verify({
        newPwd: function (value, item) {
            if (value.length < 6) {
                return "密码长度不能小于6位";
            } else if (value.length > 13) {
                return "密码长度不能大于13位";
            }
        },
        confirmPwd: function (value, item) {
            if (!new RegExp($("#newPwd").val()).test(value)) {
                return "两次输入密码不一致，请重新输入！";
            }
        }
    });

    //修改密码
    form.on("submit(changePwd)", function (data) {
        const index = layer.msg('提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        setTimeout(function () {
            $.ajax({
                url: $.cookie("tempUrl") + "admin/updateByPassword?token=" + $.cookie("token"),
                type: "PUT",
                datatype: "application/json",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify({
                    newPassword: $("#newPwd").val(),
                    oldPassword: $("#oldPwd").val()
                }),
                success: function (result) {
                    if (result.httpStatus === 200) {
                        layer.msg("修改成功,请重新登陆...");
                        setTimeout(function () {
                            $.ajax({
                                url: $.cookie("tempUrl") + "admin/logout?token=" + $.cookie("token"),
                                type: "POST",
                                success: function (result) {
                                    if (result.code === 0) {
                                        top.layer.close(index);
                                        layer.closeAll("iframe");
                                        //跳转至登陆界面
                                        $.cookie('token', "", {path: '/'});
                                        top.location.replace("../../login.html");
                                    }
                                }
                            });
                        }, 500);
                    } else {
                        layer.alert(result.exception, {icon: 7, anim: 6});
                    }
                }
            });
        }, 500);
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    //控制表格编辑时文本的位置【跟随渲染时的位置】
    $("body").on("click", ".layui-table-body.layui-table-main tbody tr td", function () {
        $(this).find(".layui-table-edit").addClass("layui-" + $(this).attr("align"));
    });

});