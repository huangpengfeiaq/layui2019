layui.use(['form', 'layer', 'table'], function () {
    const form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;

    //列表
    const tableIns = table.render({
        elem: '#list',
        url: $.cookie("tempUrl") + 'sysParameter/selectList',
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
        cols: [[
            {field: 'id', title: 'ID', width: 90, align: 'center'},
            {field: 'key', title: '键', minWidth: 100, align: "center"},
            {field: 'value', title: '值', align: 'center'},
            {field: 'note', title: '说明', align: 'center'},
            {title: '操作', minWidth: 145, templet: '#userListBar', fixed: "right", align: "center"}
        ]]
    });

    //监听行工具事件
    table.on('tool(test)', function (obj) {
        const layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'edit') {
            const index = layui.layer.open({
                title: "编辑参数",
                type: 2,
                area: ["500px", "350px"],
                content: "parameterUpd.html",
                shadeClose: true,
                success: function (layero, index) {
                    const body = layui.layer.getChildFrame('body', index);
                    body.find("input[name=id]").val(data.id);
                    body.find("input[name=key]").val(data.key);
                    body.find("input[name=value]").val(data.value);
                    body.find("input[name=note]").val(data.note);
                    form.render();
                }
            });
        }
    });
});
