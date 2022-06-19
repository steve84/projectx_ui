var m = require("mithril")

var AlarmJobFigure = require("../../models/alarm_job_figure/AlarmJobFigure")
var MiscUtil = require("../../utils/MiscUtil")

var AlarmJobFigureForm = require("./AlarmJobFigureForm")

var AlarmJobFigureDetail = {
    oninit: vnode => {
        if (MiscUtil.hasPropertyPath(vnode, "attrs.saveFn")) {
            vnode.state.saveFn = vnode.attrs.saveFn
        }
        if (MiscUtil.hasPropertyPath(vnode, "attrs.alarm_job_id")) {
            vnode.state.alarm_job_id = vnode.attrs.alarm_job_id
        }
    },
    view: vnode => [
        m("div", {class: "ui modal", id: "alarm_job_figure_detail_modal"}, [
            m("div", {class: "header"}, "Alarm figure detail"),
            MiscUtil.hasPropertyPath(AlarmJobFigure.actualAlarmJobFigure, "attributes") ? m("div", {class: "content"}, m(AlarmJobFigureForm, {data: AlarmJobFigure.actualAlarmJobFigure, key: AlarmJobFigure.actualAlarmJobFigure.id})) : m("span"),
            m("div", {class: "actions"}, [
                m("div", {
                    class: "ui primary approve button",
                    onclick: () => {
                        if (MiscUtil.hasPropertyPath(AlarmJobFigure.actualAlarmJobFigure, "attributes.alarm_job_id")) {
                            AlarmJobFigure.actualAlarmJobFigure.attributes.alarm_job_id = vnode.state.alarm_job_id
                        }
                        vnode.state.saveFn(AlarmJobFigure.actualAlarmJobFigure)
                    }
                }, "Save"),
                m("div", {class: "ui cancel button"}, "Cancel")
            ])
        ])
    ]
}

module.exports = AlarmJobFigureDetail