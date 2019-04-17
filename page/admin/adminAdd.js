layui.use(['form', 'layer'], function () {
    const form = layui.form,
        layer = layui.layer;

    //添加验证规则
    form.verify({
        password: function (value, item) {
            if (value.length < 6) {
                return "密码长度不能小于6位";
            } else if (value.length > 13) {
                return "密码长度不能大于13位";
            }
        },
        rePassword: function (value, item) {
            if (!new RegExp($("#password").val()).test(value)) {
                return "两次输入密码不一致，请重新输入！";
            }
        }
    });

    //提交
    form.on("submit(submit)", function (data) {
        const field = data.field;
        //弹出loading
        const index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        $.ajax({
            url: $.cookie("tempUrl") + "admin/insertSelective?token=" + $.cookie("token"),
            type: "POST",
            datatype: "application/json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                "account": field.account,
                "password": field.password,
                "phone": field.phone,
                "name": field.trueName
            }),
            success: function (result) {
                top.layer.close(index);
                if (result.httpStatus === 200) {
                    top.layer.msg("管理员添加成功！");
                    layer.closeAll("iframe");
                    //刷新父页面
                    parent.location.reload();
                } else {
                    layer.alert(result.exception, {icon: 7, anim: 6});
                }
            }
        });
        return false;
    });
});