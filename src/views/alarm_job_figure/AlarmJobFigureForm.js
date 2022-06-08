var m = require("mithril")

var MiscUtil = require("../../utils/MiscUtil")

var Exchange = require("../../models/exchange/Exchange")
var KeyFigure = require("../../models/key_figure/KeyFigure")
var TaMethod = require("../../models/ta_method/TaMethod")
var AlarmCondition = require("../../models/alarm_condition/AlarmCondition")
var AlarmJobFigure = require("../../models/alarm_job_figure/AlarmJobFigure")



var AlarmJobFigureForm =  {
    view: () => m("div", {class: "ui form", id: "alarm_job_figure_detail_form"}, [
        m("div", {class: "field"}, [
            m("label", "Figure"),
            KeyFigure.list.length > 0 ? m("select", {class: "ui fluid dropdown", value: AlarmJobFigure.actualAlarmJobFigure.relationships.key_figure.data.id}, KeyFigure.list.map(e => m("option", {value: e.id}, e.attributes.figure_name))) : m("span")
        ]),
        m("div", {class: "field"}, [
            m("label", "Exchange"),
            m("select", {class: "ui fluid dropdown", value: AlarmJobFigure.actualAlarmJobFigure.relationships.exchange.data.id}, Exchange.list.map(e => m("option", {value: e.id}, e.attributes.exchange_name)))
        ]),
        m("div", {class: "field"}, [
            m("label", "Method"),
            m("select", {
                class: "ui fluid dropdown",
                value: AlarmJobFigure.actualAlarmJobFigure.relationships.ta_method.data.id,
                onchange: e => {
                    AlarmJobFigureForm.taMethodSchema = {}
                    method = TaMethod.list.find(m => m.id === e.target.value)
                    if (!!method && !!method.attributes && !!method.attributes.method_arguments_schema) {
                        AlarmJobFigureForm.taMethodSchema = method.attributes.method_arguments_schema
                    }
                }
            }, TaMethod.list.map(e => m("option", {value: e.id}, e.attributes.method_name)))
        ]),
        Object.keys(AlarmJobFigureForm.taMethodSchema).length > 0 ? m(
            "div",
            {class: "fields"},
            Object.keys(AlarmJobFigureForm.taMethodSchema.properties).map(prop => {
                property = AlarmJobFigureForm.taMethodSchema.properties[prop]
                return m("div", {class: "field"}, [
                    m("label", property.description),
                    m("input", {type: ["number", "integer"].indexOf(property.type) > -1 ? "number" : "text"})
                ])
            })) : m("span"),
        m("div", {class: "field"}, [
            m("label", "Alarm Condition"),
            m("select", {
                class: "ui fluid dropdown",
                value: AlarmJobFigure.actualAlarmJobFigure.relationships.alarm_condition.data.id,
                onchange: e => {
                    AlarmJobFigureForm.alarmConditionSchema = {}
                    condition = AlarmCondition.list.find(m => m.id === e.target.value)
                    if (!!condition && !!condition.attributes && !!condition.attributes.condition_input_schema) {
                        AlarmJobFigureForm.alarmConditionSchema = condition.attributes.condition_input_schema
                    }
                }
            }, AlarmCondition.list.map(e => m("option", {value: e.id}, e.attributes.condition_name)))
        ]),
        Object.keys(AlarmJobFigureForm.alarmConditionSchema).length > 0 ? m(
            "div",
            {class: "fields"},
            Object.keys(AlarmJobFigureForm.alarmConditionSchema.properties).map(prop => {
                property = AlarmJobFigureForm.alarmConditionSchema.properties[prop]
                return m("div", {class: "field"}, [
                    m("label", property.description),
                    m("input", {
                        type: ["number", "integer"].indexOf(property.type) > -1 ? "number" : "text",
                        min: Object.keys(property).indexOf('minimum') > -1 ? property.minimum : null
                    })
                ])
            })) : m("span"),
    ]),
    taMethodSchema: {},
    alarmConditionSchema: {}
}

module.exports = AlarmJobFigureForm