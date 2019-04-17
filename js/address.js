layui.define(["form", "jquery"], function (exports) {
    var form = layui.form,
        $ = layui.jquery,
        Address = {
            init: function (a, b, c) {
                //a,b,c  省市区
                var proHtml = '', citys, areas, that = this;
                $.get("../../json/address.json", function (data) {
                    for (var i = 0; i < data.length; i++) {
                        proHtml += '<option value="' + data[i].code + '">' + data[i].name + '</option>';
                        if (data[i].code === a) {
                            citys = data[i].childs;
                        }
                    }
                    $("select[name=province]").append(proHtml).val(a);
                    //加载市
                    var cityHtml = '<option value="">请选择市</option>';
                    if (citys) {
                        for (var i = 0; i < citys.length; i++) {
                            cityHtml += '<option value="' + citys[i].code + '">' + citys[i].name + '</option>';
                            if (citys[i].code === b) {
                                areas = citys[i].childs;
                            }
                        }
                    }
                    $("select[name=city]").html(cityHtml).removeAttr("disabled").val(b);
                    //加载区
                    var areaHtml = '<option value="">请选择县/区</option>';
                    if (areas) {
                        for (var i = 0; i < areas.length; i++) {
                            areaHtml += '<option value="' + areas[i].code + '">' + areas[i].name + '</option>';
                        }
                    }
                    $("select[name=area]").html(areaHtml).removeAttr("disabled").val(c);
                    form.render();
                    form.on('select(province)', function (proData) {
                        $("select[name=area]").html('<option value="">请选择县/区</option>');
                        var value = proData.value;
                        if (value > 0) {
                            console.log($(this));
                            that.citys(data[$(this).index() - 1].childs);

                        } else {
                            $("select[name=city]").attr("disabled", "disabled");
                        }
                    });
                });
            },
            provinces: function () {
                //加载省数据
                var proHtml = '', that = this;
                $.get("../../json/address.json", function (data) {
                    for (var i = 0; i < data.length; i++) {
                        proHtml += '<option value="' + data[i].code + '">' + data[i].name + '</option>';
                    }
                    //初始化省数据
                    $("select[name=province]").append(proHtml);
                    form.render();
                    form.on('select(province)', function (proData) {
                        $("select[name=area]").html('<option value="">请选择县/区</option>');
                        var value = proData.value;
                        if (value > 0) {
                            console.log($(this));
                            that.citys(data[$(this).index() - 1].childs);

                        } else {
                            $("select[name=city]").attr("disabled", "disabled");
                        }
                    });
                })
            },
            //加载市数据
            citys: function (citys) {
                var cityHtml = '<option value="">请选择市</option>', that = this;
                for (var i = 0; i < citys.length; i++) {
                    cityHtml += '<option value="' + citys[i].code + '">' + citys[i].name + '</option>';
                }
                $("select[name=city]").html(cityHtml).removeAttr("disabled");
                form.render();
                form.on('select(city)', function (cityData) {
                    var value = cityData.value;
                    if (value > 0) {
                        that.areas(citys[$(this).index() - 1].childs);
                    } else {
                        $("select[name=area]").attr("disabled", "disabled");
                    }
                });
            },
            //加载县/区数据
            areas: function (areas) {
                var areaHtml = '<option value="">请选择县/区</option>';
                for (var i = 0; i < areas.length; i++) {
                    areaHtml += '<option value="' + areas[i].code + '">' + areas[i].name + '</option>';
                }
                $("select[name=area]").html(areaHtml).removeAttr("disabled");
                form.render();
            }
        };
    exports("address", Address);
})