var m = require("mithril")

var MiscUtil = require("../../utils/MiscUtil")

var AlarmJobFigure = require("../../models/alarm_job_figure/AlarmJobFigure")
var Pair = require("../../models/pair/Pair")

var Table = require("../common/Table")
var AlarmJobFigureDetail = require("./AlarmJobFigureDetail")


var state = {
    cols: [
        {"name": "Interval", "property": "interval", "sortable": false},
        {"name": "Pair", "property": "pair", "sortable": false, "fn": row => MiscUtil.hasPropertyPath(row, "_pair.id") ? Pair.getPairStringById(row._pair.id) : ""},
        {"name": "Figure", "property": "key_figure.figure_name", "sortable": false, "fn": row => !!row._key_figure ? row._key_figure.figure_name : ""},
        {"name": "Exchange", "property": "exchange.exchange_name", "sortable": false, "fn": row => !!row._exchange ? row._exchange.exchange_name : ""},
        {"name": "Method", "property": "ta_method.method_name", "sortable": false, "fn": row => !!row._ta_method ? row._ta_method.method_name : ""},
        {"name": "Method arguments", "property": "method_arguments", "sortable": false, "fn": row => {
            return MiscUtil.hasPropertyPath(row, "method_arguments") && Object.keys(row.method_arguments).length > 0 ? m("div", {class: "ui definition table"}, m("tbody", Object.keys(row.method_arguments).map(arg => m("tr", [
                m("td", {class: "two wide column"},  arg), 
                m("td", row.method_arguments[arg])
            ])))) : m("span")
        }},
        {"name": "Alarm condition", "property": "alarm_condition.condition_name", "sortable": false, "fn": row => !!row._alarm_condition ? row._alarm_condition.condition_name : ""},
        {"name": "Alarm condition arguments", "property": "alarm_condition_arguments", "sortable": false, "fn": row => {
            return !!row.alarm_condition_arguments ? m("div", {class: "ui definition table"}, m("tbody", Object.keys(row.alarm_condition_arguments).map(arg => m("tr", [
                m("td", {class: "two wide column"},  arg), 
                m("td", row.alarm_condition_arguments[arg])
            ])))) : m("span")
        }},
        {"name": "Details", "sortable": false, "element": row => m("div", [
            m("button", {
                class: "mini ui secondary button",
                onclick: e => {
                    AlarmJobFigure.setActualAlarmJobFigure(AlarmJobFigure.list.find(fig => fig.id === row.id))
                    $("#alarm_job_figure_detail_modal").modal("show")
                }
            }, "Edit"),
            m("button", {
                class: "mini ui secondary button",
                onclick: e => {
                    AlarmJobFigure.deleteFigure(row.id)
                }
            }, "Delete")
        ])},
    ]
}

var AlarmJobFigureList =  {
    oninit: vnode => {
        vnode.state.alarm_job_id = vnode.attrs.alarm_job_id
    },
    view: vnode => [
        m(Table, {
            "pageable": false,
            "isLoading": () => AlarmJobFigure.loading,
            "getList": () => AlarmJobFigure.list,
            "cols": state.cols,
            "getNumResults": () => AlarmJobFigure.numResults,
            "getOrderByField": () => AlarmJobFigure.orderByField,
            "getOrderByDirection": () => AlarmJobFigure.orderByDirection
        }),
        m(AlarmJobFigureDetail, {data: AlarmJobFigure.actualAlarmJobFigure, alarm_job_id: vnode.state.alarm_job_id, saveFn: AlarmJobFigure.createOrUpdateFigure})
    ]
}

module.exports = AlarmJobFigureList