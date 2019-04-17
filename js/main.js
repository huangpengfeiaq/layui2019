//获取系统时间
let newDate = '';
getLangDate();

// $(function () {
//     $.ajax({
//         url: $.cookie("tempUrl") + "public/selectCountForUser?token=" + $.cookie("token"),
//         type: "GET",
//         success: function (result) {
//             $(".count1 span").text(result.data);
//         }
//     });
//     $.ajax({
//         url: $.cookie("tempUrl") + "public/selectCountForInformation?token=" + $.cookie("token"),
//         type: "GET",
//         success: function (result) {
//             $(".count2 span").text(result.data);
//         }
//     });
//     $.ajax({
//         url: $.cookie("tempUrl") + "public/selectCountForLoan?token=" + $.cookie("token"),
//         type: "GET",
//         success: function (result) {
//             $(".count3 span").text(result.data);
//         }
//     });
//     $.ajax({
//         url: $.cookie("tempUrl") + "public/selectCountForAdmin?token=" + $.cookie("token"),
//         type: "GET",
//         success: function (result) {
//             $(".count4 span").text(result.data);
//         }
//     });
//     $.ajax({
//         url: $.cookie("tempUrl") + "public/selectCountForSlideshow?token=" + $.cookie("token"),
//         type: "GET",
//         success: function (result) {
//             $(".count5 span").text(result.data);
//         }
//     });
// });

//值小于10时，在前面补0
function dateFilter(date) {
    if (date < 10) {
        return "0" + date;
    }
    return date;
}

function getLangDate() {
    const dateObj = new Date(); //表示当前系统时间的Date对象
    const year = dateObj.getFullYear(); //当前系统时间的完整年份值
    const month = dateObj.getMonth() + 1; //当前系统时间的月份值
    const date = dateObj.getDate(); //当前系统时间的月份中的日
    const day = dateObj.getDay(); //当前系统时间中的星期值
    const weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    const week = weeks[day]; //根据星期值，从数组中获取对应的星期字符串
    const hour = dateObj.getHours(); //当前系统时间的小时值
    const minute = dateObj.getMinutes(); //当前系统时间的分钟值
    const second = dateObj.getSeconds(); //当前系统时间的秒钟值
    const timeValue = "" + ((hour >= 12) ? (hour >= 18) ? "晚上" : "下午" : "上午"); //当前时间属于上午、晚上还是下午
    newDate = dateFilter(year) + "年" + dateFilter(month) + "月" + dateFilter(date) + "日 " + " " + dateFilter(hour) + ":" + dateFilter(minute) + ":" + dateFilter(second);
    document.getElementById("nowTime").innerHTML = "亲爱的" + $.cookie("truename") + "，" + timeValue + "好！ 欢迎使用两盈科技-后台管理系统。当前时间为： " + newDate + "　" + week;
    setTimeout("getLangDate()", 1000);
}

layui.use(['jquery'], function () {
    const $ = layui.jquery;
    //上次登录时间【此处应该从接口获取，实际使用中请自行更换】
    $(".loginTime").html(newDate.split("日")[0] + "日</br>" + newDate.split("日")[1]);
    //icon动画
    $(".panel a").hover(function () {
        $(this).find(".layui-anim").addClass("layui-anim-scaleSpring");
    }, function () {
        $(this).find(".layui-anim").removeClass("layui-anim-scaleSpring");
    })
    $(".panel a").click(function () {
        parent.addTab($(this));
    })
});