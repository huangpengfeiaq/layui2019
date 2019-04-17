var form, $, areaData;
layui.config({
    base: "../../js/"
});
layui.use(['form', 'layer'], function () {
    const form = layui.form,
        $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    $(function () {
        $.ajax({
            url: $.cookie("tempUrl") + "admin/selectBySession?token=" + $.cookie("token"),
            type: "GET",
            success: function (result) {
                $(".id").attr("value", result.data.id);
                $(".phone").attr("value", result.data.phone);
                $(".truename").attr("value", result.data.name);
                if (result.data.status === 8) {
                    $(".level").attr("value", "超级管理员");
                } else {
                    $(".level").attr("value", "普通管理员");
                }
            }
        });
    });

    //提交个人资料
    form.on("submit(changeUser)", function (data) {
        const index = layer.msg('提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        $.ajax({
            url: $.cookie("tempUrl") + "admin/updateByPhone?token=" + $.cookie("token") + "&phone=" + $(".phone").val(),
            type: "put",
            success: function (result) {
                if (result.httpStatus === 200) {
                    layer.msg("更新成功,请重新登陆...");
                    setTimeout(function () {
                        top.layer.close(index);
                        layer.closeAll("iframe");
                        //跳转至登陆界面
                        $.cookie('token', "", {path: '/'});
                        parent.location.href = "../../login.html";
                    }, 500);
                } else {
                    layer.alert(result.exception, {icon: 7, anim: 6});
                }
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    })
});