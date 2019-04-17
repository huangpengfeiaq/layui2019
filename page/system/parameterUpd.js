layui.use(['form', 'layer'], function () {
    const form = layui.form,
        layer = layui.layer;

    //添加验证规则
    form.verify({
        value: function (value) {
            if (value > 0.5 || value < 0.0001) {
                return "比例范围为0.0001-0.2之间";
            }
        }
    });

    //提交
    form.on("submit(submit)", function (data) {
        const field = data.field;
        //弹出loading
        const index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        $.ajax({
            url: $.cookie("tempUrl") + "sysParameter/updateByPrimaryKeySelective?token=" + $.cookie("token"),
            type: "PUT",
            datatype: "application/json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                "id": field.id,
                "key": null,
                "value": field.value,
                "note": field.note
            }),
            success: function (result) {
                top.layer.close(index);
                if (result.httpStatus == 200) {
                    top.layer.msg("参数修改成功！");
                    layer.closeAll("iframe");
                    //刷新父页面
                    parent.location.reload();
                } else {
                    layer.alert("修改失败，未知错误，请联系开发者解决", {icon: 7, anim: 6});
                }
            }
        });
        return false;
    });
});