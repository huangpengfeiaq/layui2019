layui.use(['layer'], function () {
    const layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery;

    setTimeout(function () {
        $.ajax({
            url: $.cookie("tempUrl") + "user/selectInfoByPrimaryKey?token=" + $.cookie("token") + "&id=" + $(".id").val(),
            type: "GET",
            success: function (result) {
                if (result.code === 0) {
                    if (!result.data.idFront && !result.data.idBack) {
                        layer.msg("此用户身份证未上传");
                    } else {
                        $(".id_front").attr("src", result.data.idFront);  //身份证
                        $(".id_back").attr("src", result.data.idBack);  //身份证
                    }
                } else {
                    layer.msg(result.exception, {icon: 7, anim: 6});
                }
            }
        });
    }, 500);
});