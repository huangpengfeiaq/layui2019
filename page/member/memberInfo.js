layui.use(['layer'], function () {
    const layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery;

    setTimeout(function () {
        $.ajax({
            url: $.cookie("tempUrl") + "user/selectInfoByPrimaryKey?token=" + $.cookie("token") + "&id=" + $(".id").val(),
            type: "GET",
            success: function (result) {
                if (result.code === 0) {
                    // console.log(result.data);
                    $(".id").val(result.data.id);
                    $(".username").val(result.data.username);
                    $(".phone").val(result.data.phone);
                    $(".idNumber").val(result.data.idNumber == null ? "未填写" : result.data.idNumber);
                    $(".userId").val(result.data.userId == null ? "无" : result.data.userId);
                    $(".inviteNumber").val(result.data.inviteNumber + "人");
                    $(".earn").val("￥" + result.data.earn);
                    $(".balance").val("￥" + result.data.balance);
                    $(".status").val(result.data.status === 3 ? "是" : "否");
                    let profession;
                    switch (result.data.profession) {
                        case 1:
                            profession = '上班族';
                            break;
                        case 2:
                            profession = '个体户';
                            break;
                        case 3:
                            profession = '企业主';
                            break;
                        case 4:
                            profession = '无固定职业';
                            break;
                    }
                    $(".profession").val(profession);
                    $(".accumulationFund").val(result.data.accumulationFund === 1 ? "有" : "无");
                    $(".socialSecurity").val(result.data.socialSecurity === 1 ? "有" : "无");
                    $(".commercialInsurance").val(result.data.commercialInsurance === 1 ? "有" : "无");
                    $(".credit").val(result.data.credit === 1 ? "有" : "无");
                    $(".bind").val(result.data.bind);
                    $(".loanOfficerFile").val(result.data.loanOfficerFile);
                    $(".createDate").val(result.data.createDate);
                    $(".id_front").attr("src", result.data.idFront);  //身份证
                    $(".id_back").attr("src", result.data.idBack);  //身份证
                } else {
                    layer.msg(result.exception, {icon: 7, anim: 6});
                }
            }
        });
    }, 500);
});