layui.use(['form', 'layer', 'table'], function () {
    const form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;

    //验证权限
    $.ajax({
        url: $.cookie("tempUrl") + "admin/selectBySession?token=" + $.cookie("token"),
        type: "GET",
        success: function (result) {
            if (result.data.status !== 8) {
                window.location.href = "../405.html";
            }
        }
    });

    //列表
    const tableIns = table.render({
        elem: '#list',
        url: $.cookie("tempUrl") + 'admin/selectList',
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
                field: 'account', title: '用户名', minWidth: 200, align: "center", templet: function (d) {
                    return '<a lay-event="edit" style="cursor:pointer;">' + d.account + '</a>';
                }
            },
            {field: 'name', title: '真实姓名', minWidth: 100, align: "center"},
            {field: 'phone', title: '手机号', align: 'center'},
            {
                field: 'createDate', title: '创建时间', minWidth: 200, align: "center", templet: function (d) {
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
                    url: $.cookie("tempUrl") + 'admin/selectListByPhone',
                    where: {
                        phone: $(".searchVal").val(),
                        token: $.cookie("token")
                    }
                });
                break;
            case 'flash_btn':
                window.location.reload();
                break;
            case 'add_btn':
                const index = layui.layer.open({
                    title: "新增管理员",
                    type: 2,
                    area: ["500px", "450px"],
                    content: "adminAdd.html",
                    shadeClose: true
                });
                break;
        }
    });

    //监听行工具事件
    table.on('tool(test)', function (obj) {
        const layEvent = obj.event,
            data = obj.data;
        switch (layEvent) {
            case 'edit'://编辑
                const index = layui.layer.open({
                    title: "编辑管理员",
                    type: 2,
                    area: ["500px", "350px"],
                    content: "adminUpd.html",
                    shadeClose: true,
                    success: function (layero, index) {
                        const body = layui.layer.getChildFrame('body', index);
                        body.find("input[name=id]").val(data.id);
                        body.find("input[name=account]").val(data.account);
                        body.find("input[name=trueName]").val(data.name);
                        body.find("input[name=phone]").val(data.phone);
                        form.render();
                    }
                });
                break;
            case 'del'://删除
                layer.confirm('确定删除此管理员？', {icon: 3, title: '提示信息'}, function (index) {
                    $.ajax({
                        url: $.cookie("tempUrl") + "admin/deleteByPrimaryKey?token=" + $.cookie("token") + "&id=" + data.id,
                        type: "DELETE",
                        success: function (result) {
                            layer.msg("删除成功");
                            // window.location.href = "adminList.html";
                        }
                    });
                    obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    // tableIns.reload();
                    layer.close(index);
                });
                break;
        }
    });

    // 修改状态开关
    form.on('switch(status)', function (data) {
        // console.log(data.elem.checked); //开关是否开启，true或者false
        // console.log(data.value); //开关value值，也可以通过data.elem.value得到
        $.ajax({
            url: $.cookie("tempUrl") + "admin/updateByStatus?token=" + $.cookie("token"),
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
});
