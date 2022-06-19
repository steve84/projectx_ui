var m = require("mithril")

var MiscUtil = require("../../utils/MiscUtil")

var Exchange = require("../../models/exchange/Exchange")
var Pair = require("../../models/pair/Pair")
var KeyFigure = require("../../models/key_figure/KeyFigure")
var TaMethod = require("../../models/ta_method/TaMethod")
var AlarmCondition = require("../../models/alarm_condition/AlarmCondition")



var AlarmJobFigureForm =  {
    oninit: vnode => {
        vnode.state.val = vnode.attrs.data
    },
    view: vnode => m("div", {class: "ui form", id: "alarm_job_figure_detail_form"}, [
        m("div", {class: "field"}, [
            m("label", "Figure"),
            m("select", {
                class: "ui fluid dropdown",
                value: vnode.state.val.relationships.key_figure.data.id,
                onchange: e => vnode.state.val.relationships.key_figure.data.id = e.target.value
            }, KeyFigure.list.map(e => m("option", {value: e.id}, e.attributes.figure_name)))
        ]),
        m("div", {class: "field"}, [
            m("label", "Exchange"),
            m("select", {
                class: "ui fluid dropdown",
                value: vnode.state.val.relationships.exchange.data.id,
                onchange: e => vnode.state.val.relationships.exchange.data.id = e.target.value
            }, Exchange.list.map(e => m("option", {value: e.id}, e.attributes.exchange_name)))
        ]),
        m("div", {class: "field"}, [
            m("label", "Pair"),
            m("select", {
                class: "ui fluid dropdown",
                value: vnode.state.val.relationships.pair.data.id,
                onchange: e => vnode.state.val.relationships.pair.data.id = e.target.value
            }, Pair.list.map(e => m("option", {value: e.id}, Pair.getPairStringById(e.id))))
        ]),
        m("div", {class: "field"}, [
            m("label", "Method"),
            m("select", {
                class: "ui fluid dropdown",
                value: vnode.state.val.relationships.ta_method.data.id,
                onchange: e => {
                    vnode.state.val.relationships.ta_method.data.id = e.target.value
                    vnode.state.val.attributes.method_arguments = {}
                    method = TaMethod.list.find(m => m.id === e.target.value)
                    if (MiscUtil.hasPropertyPath(method, "attributes.method_arguments_schema.properties")) {
                        vnode.state.val.attributes._ta_method.method_arguments_schema = method.attributes.method_arguments_schema
                        Object.keys(method.attributes.method_arguments_schema.properties).forEach(prop => {
                            property = method.attributes.method_arguments_schema.properties[prop]
                            vnode.state.val.attributes.method_arguments[prop] = ["number", "integer"].indexOf(property.type) > -1 ? 0 : ""
                        })
                    } else {
                        vnode.state.val.attributes._ta_method.method_arguments_schema = {}
                    }
                }
            }, TaMethod.list.map(e => m("option", {value: e.id}, e.attributes.method_name)))
        ]),
        MiscUtil.hasPropertyPath(vnode.state.val, "attributes._ta_method.method_arguments_schema.properties", ".") ? m(
            "div",
            {class: "fields"},
            Object.keys(vnode.state.val.attributes._ta_method.method_arguments_schema.properties).map(prop => {
                property = vnode.state.val.attributes._ta_method.method_arguments_schema.properties[prop]
                return m("div", {class: "field"}, [
                    m("label", property.description),
                    m("input", {
                        type: ["number", "integer"].indexOf(property.type) > -1 ? "number" : "text",
                        value: vnode.state.val.attributes.method_arguments[prop],
                        name: prop,
                        onchange: e => vnode.state.val.attributes.method_arguments[prop] = e.target.value
                    })
                ])
            })) : m("span"),
        m("div", {class: "field"}, [
            m("label", "Alarm Condition"),
            m("select", {
                class: "ui fluid dropdown",
                value: vnode.state.val.relationships.alarm_condition.data.id,
                onchange: e => {
                    vnode.state.val.relationships.alarm_condition.data.id = e.target.value
                    vnode.state.val.attributes.alarm_condition_arguments = {}
                    condition = AlarmCondition.list.find(m => m.id === e.target.value)
                    if (MiscUtil.hasPropertyPath(condition, "attributes.condition_input_schema.properties")) {
                        vnode.state.val.attributes._alarm_condition.condition_input_schema = condition.attributes.condition_input_schema
                        Object.keys(condition.attributes.condition_input_schema.properties).forEach(prop => {
                            property = condition.attributes.condition_input_schema.properties[prop]
                            vnode.state.val.attributes.alarm_condition_arguments[prop] = ["number", "integer"].indexOf(property.type) > -1 ? 0 : ""
                        })
                    } else {
                        vnode.state.val.attributes._alarm_condition.condition_input_schema = {}
                    }
                }
            }, AlarmCondition.list.map(e => m("option", {value: e.id}, e.attributes.condition_name)))
        ]),
        MiscUtil.hasPropertyPath(vnode.state.val, "attributes._alarm_condition.condition_input_schema.properties") ? m(
            "div",
            {class: "fields"},
            Object.keys(vnode.state.val.attributes._alarm_condition.condition_input_schema.properties).map(prop => {
                property = vnode.state.val.attributes._alarm_condition.condition_input_schema.properties[prop]
                return m("div", {class: "field"}, [
                    m("label", property.description),
                    m("input", {
                        type: ["number", "integer"].indexOf(property.type) > -1 ? "number" : "text",
                        value: vnode.state.val.attributes.alarm_condition_arguments[prop],
                        min: Object.keys(property).indexOf('minimum') > -1 ? property.minimum : null,
                        name: prop,
                        onchange: e => vnode.state.val.attributes.alarm_condition_arguments[prop] = e.target.value
                    })
                ])
            })) : m("span"),
    ]),
    val: {}
}

module.exports = AlarmJobFigureForm