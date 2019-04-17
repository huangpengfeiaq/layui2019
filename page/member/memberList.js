layui.use(['form', 'layer', 'table'], function () {
    const form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;

    //列表
    const tableIns = table.render({
        elem: '#list',
        url: $.cookie("tempUrl") + 'user/selectList',
        where: {token: $.cookie("token")},
        method: "GET",
        request: {
            pageName: 'pageNum' //页码的参数名称，默认：page
            , limitName: 'pageSize' //每页数据量的参数名，默认：limit
        },
        response: {
            statusName: 'code' //数据状态的字段名称，默认：code
            , statusCode: 0 //成功的状态码，默认：0
            , msgName: 'httpStatus' //状态信息的字段名称，默认：msg
            , countName: 'totalElements' //数据总数的字段名称，默认：count
            , dataName: 'content' //数据列表的字段名称，默认：data
        },
        cellMinWidth: 95,
        page: true,
        height: "full-25",
        limits: [5, 10, 15, 20, 25],
        limit: 15,
        id: "dataTable",
        toolbar: '#toolbarDemo',
        defaultToolbar: [],
        cols: [[
            {field: 'id', title: 'ID', width: 90, align: 'center'},
            {
                field: 'username', title: '姓名', minWidth: 150, align: "center", templet: function (d) {
                    return '<a lay-event="look" style="cursor:pointer;">' + d.username + '</a>';
                }
            },
            {field: 'phone', title: '手机号', minWidth: 150, align: 'center'},
            {
                field: 'idNumber', title: '身份证号', minWidth: 180, align: "center", templet: function (d) {
                    if (d.idNumber) {
                        return '<a lay-event="idcard" style="cursor:pointer;color: #01AAED">' + d.idNumber + '</a>';
                    } else {
                        return '未填写'
                    }
                }
            },
            {
                field: 'earn', title: '累计总收益', minWidth: 110, align: "center", templet: function (d) {
                    return "￥" + d.earn
                }
            },
            {
                field: 'balance', title: '可提现余额', minWidth: 110, align: "center", templet: function (d) {
                    return "￥" + d.balance
                }
            },
            {
                field: 'createDate', title: '注册时间', minWidth: 200, align: "center", templet: function (d) {
                    return d.createDate;
                }
            },
            {
                field: 'status', title: '状态', width: 100, align: 'center', templet: function (d) {
                    switch (d.status) {
                        case 0:
                            return '<input type="checkbox" lay-filter="status" lay-skin="switch" value=' + d.id + ' lay-text="启用|禁用" >';
                        case 1:
                            return '<input type="checkbox" lay-filter="status" lay-skin="switch" value=' + d.id + ' lay-text="启用|禁用" checked>';
                        // case 2:
                        // case 3:
                        // case 4:
                        default:
                            return '<input type="checkbox" lay-filter="status" lay-skin="switch" value=' + d.id + ' lay-text="启用|禁用" checked disabled>';
                    }
                }
            },
            {title: '操作', minWidth: 145, templet: '#userListBar', fixed: "right", align: "center"}
        ]]
    });

    //头工具栏事件
    table.on('toolbar(test)', function (obj) {
        const checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'search_btn':
                table.reload("dataTable", {
                    url: $.cookie("tempUrl") + 'user/selectListBySearch',
                    where: {
                        search: $(".searchVal").val(),
                        token: $.cookie("token")
                    }
                });
                break;
            case 'flash_btn':
                window.location.reload();
                break;
        }
    });

    // 修改状态开关
    form.on('switch(status)', function (data) {
        // console.log(data.elem.checked); //开关是否开启，true或者false
        // console.log(data.value); //开关value值，也可以通过data.elem.value得到
        $.ajax({
            url: $.cookie("tempUrl") + "user/updateByStatus?token=" + $.cookie("token"),
            type: "PUT",
            datatype: "application/json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                "id": data.value,
                "status": data.elem.checked ? "1" : "0"
            }),
            success: function (result) {
                if (result.httpStatus === 200) {
                    layer.msg("状态修改成功");
                } else {
                    layer.alert(result.exception, {icon: 7, anim: 6});
                }
            }
        });
    });

    //列表操作
    table.on('tool(test)', function (obj) {
        const layEvent = obj.event,
            data = obj.data;
        let index;
        switch (layEvent) {
            case 'look'://查看详情
                index = layui.layer.open({
                    title: "用户详情",
                    type: 2,
                    maxmin: true, //开启最大化最小化按钮
                    area: ["700px", "500px"],
                    content: "memberInfo.html",
                    shadeClose: true,
                    success: function (layero, index) {
                        var body = layui.layer.getChildFrame('body', index);
                        body.find(".id").val(data.id);
                        form.render();
                        setTimeout(function () {
                            layui.layer.tips('点击此处最大化', '.layui-layer-max', {
                                tips: 3
                            });
                        }, 100)
                    }
                });
                break;
            case 'idcard'://查看idcard
                index = layui.layer.open({
                    title: "身份证照",
                    type: 2,
                    maxmin: true, //开启最大化最小化按钮
                    area: ["650px", "500px"],
                    content: "idcard.html",
                    shadeClose: true,
                    success: function (layero, index) {
                        var body = layui.layer.getChildFrame('body', index);
                        body.find(".id").val(data.id);
                        form.render();
                    }
                });
                break;
            case 'del'://删除
                layer.confirm('确定删除此用户？', {icon: 3, title: '提示信息'}, function (index) {
                    $.ajax({
                        url: $.cookie("tempUrl") + "user/deleteByPrimaryKey?token=" + $.cookie("token") + "&id=" + data.id,
                        type: "DELETE",
                        success: function (result) {
                            layer.msg("删除成功");
                            // window.location.href = "memberList.html";
                        }
                    });
                    obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    // tableIns.reload();
                    layer.close(index);
                });
                break;
        }
    });
});
