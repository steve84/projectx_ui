var m = require("mithril")

var AlarmJobFigure = require("../../models/alarm_job_figure/AlarmJobFigure")

var Table = require("../common/Table")


var state = {
    cols: [
        {"name": "Interval", "property": "interval", "sortable": false},
        {"name": "Figure", "property": "key_figure.figure_name", "sortable": false, "fn": row => !!row.key_figure ? row.key_figure.figure_name : ""},
        {"name": "Exchange", "property": "exchange.exchange_name", "sortable": false, "fn": row => !!row.exchange ? row.exchange.exchange_name : ""},
        /*{"name": "Pair", "property": "pair"},*/
        {"name": "Method", "property": "ta_method.method_name", "sortable": false, "fn": row => !!row.ta_method ? row.ta_method.method_name : ""},
        {"name": "Method arguments", "property": "method_arguments", "sortable": false, "fn": row => {
            return !!row.method_arguments ? m("div", {class: "ui definition table"}, m("tbody", Object.keys(row.method_arguments).map(arg => m("tr", [
                m("td", {class: "two wide column"},  arg), 
                m("td", row.method_arguments[arg])
            ])))) : m("span")
        }},
        {"name": "Alarm condition", "property": "alarm_condition.condition_name", "sortable": false, "fn": row => !!row.alarm_condition ? row.alarm_condition.condition_name : ""},
        {"name": "Alarm condition arguments", "property": "alarm_condition_arguments", "sortable": false, "fn": row => {
            return !!row.alarm_condition_arguments ? m("div", {class: "ui definition table"}, m("tbody", Object.keys(row.alarm_condition_arguments).map(arg => m("tr", [
                m("td", {class: "two wide column"},  arg), 
                m("td", row.alarm_condition_arguments[arg])
            ])))) : m("span")
        }},
        {"name": "Details", "sortable": false, "element": row => m("div", m(m.route.Link, {
            selector: "button",
            class: "mini ui secondary button",
            href: '/alarm_job/' + row.id,
            options: {
                state: {backlink: m.route.get()}
            }
        }, "Edit"))},
    ]
}

var AlarmJobFigureList =  {
    view: () => [
        m(Table, {
            "pageable": false,
            "isLoading": () => AlarmJobFigure.loading,
            "getList": () => AlarmJobFigure.list,
            "cols": state.cols,
            "getNumResults": () => AlarmJobFigure.numResults,
            "getOrderByField": () => AlarmJobFigure.orderByField,
            "getOrderByDirection": () => AlarmJobFigure.orderByDirection,
        })
    ]
}

module.exports = AlarmJobFigureList