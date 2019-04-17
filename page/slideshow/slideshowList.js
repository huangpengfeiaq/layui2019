layui.config({
    base: "../../js/"
}).use(['flow', 'form', 'layer'], function () {
    const flow = layui.flow,
        form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery;

    //流加载图片
    const imgNums = 5;  //单页显示图片数量
    flow.load({
        elem: '#Images', //流加载容器
        done: function (page, next) { //加载下一页
            $.ajax({
                url: $.cookie("tempUrl") + "slideshow/selectList?token=" + $.cookie("token"),
                type: "GET",
                success: function (res) {
                    //模拟插入
                    var imgList = [], data = res.data;
                    var maxPage = imgNums * page < data.length ? imgNums * page : data.length;
                    setTimeout(function () {
                        for (var i = imgNums * (page - 1); i < maxPage; i++) {
                            imgList.push('<li><img data-id="' + data[i].id + '" data-type="' + data[i].informationId + '" layer-src="' + data[i].picture + '" src="' + data[i].picture + '" alt="' + data[i].name + '"><div class="operate"><div class="check"><input data-id="' + data[i].id + '" type="checkbox" name="belle" lay-filter="choose" lay-skin="primary" title="' + data[i].name + '"></div><i class="layui-icon img_del">&#xe640;</i></div></li>');
                        }
                        next(imgList.join(''), page < (data.length / imgNums));
                        form.render();
                    }, 500);
                }
            });
        }
    });

    //设置图片的高度
    $(window).resize(function () {
        $("#Images li img").height($("#Images li img").width());
    });

    //添加轮播图
    $("body").on("click", "#imageAdd", function () {
        const index = layui.layer.open({
            title: "添加轮播图",
            type: 2,
            area: ["750px", "540px"],
            shadeClose: true,
            content: "slideshowAdd.html"
        });
    });

    //编辑轮播图
    $("body").on("click", "#Images img", function () {
        sessionStorage.setItem("data-id", $(this).attr("data-id")); //id
        sessionStorage.setItem("imagename", $(this).attr("alt")); //名称
        sessionStorage.setItem("type", $(this).attr("data-type")); //类型
        sessionStorage.setItem("imageurl", $(this).attr("src")); //封面图
        var index = layui.layer.open({
            title: "更新轮播图",
            type: 2,
            area: ["750px", "540px"],
            shadeClose: true,
            content: "slideshowUpd.html",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                body.find(".imagename").val(sessionStorage.getItem("imagename"));  //名称
                body.find(".informationId").val(sessionStorage.getItem("type"));  //资讯ID
                body.find("#demo1").attr("src", sessionStorage.getItem("imageurl"));  //封面图
                form.render();
            }
        })
    });

    //删除单张图片
    $("body").on("click", ".img_del", function () {
        const _this = $(this);
        layer.confirm('确定删除轮播图"' + _this.siblings().find("input").attr("title") + '"吗？', {
            icon: 3,
            title: '提示信息'
        }, function (index) {
            $.ajax({
                url: $.cookie("tempUrl") + "slideshow/deleteByPrimaryKey?token=" + $.cookie("token") + "&id=" + _this.siblings().find("input").attr("data-id"),
                type: "DELETE",
                success: function (result) {
                    layer.msg("删除成功");
                    _this.parents("li").hide(1000);
                    setTimeout(function () {
                        _this.parents("li").remove();
                    }, 950);
                }
            });
            layer.close(index);
        });
    });

    //全选
    form.on('checkbox(selectAll)', function (data) {
        const child = $("#Images li input[type='checkbox']");
        child.each(function (index, item) {
            item.checked = data.elem.checked;
        });
        form.render('checkbox');
    });

    //通过判断是否全部选中来确定全选按钮是否选中
    form.on("checkbox(choose)", function (data) {
        const child = $(data.elem).parents('#Images').find('li input[type="checkbox"]');
        const childChecked = $(data.elem).parents('#Images').find('li input[type="checkbox"]:checked');
        if (childChecked.length == child.length) {
            $(data.elem).parents('#Images').siblings("blockquote").find('input#selectAll').get(0).checked = true;
        } else {
            $(data.elem).parents('#Images').siblings("blockquote").find('input#selectAll').get(0).checked = false;
        }
        form.render('checkbox');
    });

    //批量删除
    $(".batchDel").click(function () {
        const $checkbox = $('#Images li input[type="checkbox"]');
        const $checked = $('#Images li input[type="checkbox"]:checked');
        if ($checkbox.is(":checked")) {
            layer.confirm('确定删除选中的图片？', {icon: 3, title: '提示信息'}, function (index) {
                var index = layer.msg('删除中，请稍候', {icon: 16, time: false, shade: 0.8});
                setTimeout(function () {
                    //删除数据
                    $checked.each(function () {
                        $.ajax({
                            url: $.cookie("tempUrl") + "slideshow/deleteByPrimaryKey?token=" + $.cookie("token") + "&id=" + $(this).parents("li").find("img").attr("data-id"),
                            type: "DELETE",
                            success: function (result) {
                                layer.msg("删除成功");
                            }
                        });
                        $(this).parents("li").hide(1000);
                        setTimeout(function () {
                            $(this).parents("li").remove();
                        }, 950);
                    });
                    $('#Images li input[type="checkbox"],#selectAll').prop("checked", false);
                    form.render();
                    layer.close(index);
                    layer.msg("删除成功");
                }, 500);
            })
        } else {
            layer.msg("请选择需要删除的图片");
        }
    })

});