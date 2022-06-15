var m = require("mithril")

var AlarmJobFigure = require("../../models/alarm_job_figure/AlarmJobFigure")
var MiscUtil = require("../../utils/MiscUtil")

var AlarmJobFigureForm = require("./AlarmJobFigureForm")

var AlarmJobFigureDetail = {
    view: () => [
        m("div", {class: "ui modal", id: "alarm_job_figure_detail_modal"}, [
            m("div", {class: "header"}, "Alarm figure detail"),
            m("div", {class: "content"}, m(AlarmJobFigureForm, {data: MiscUtil.deepCopy(AlarmJobFigure.actualAlarmJobFigure), key: AlarmJobFigure.actualAlarmJobFigure.id})),
            m("div", {class: "actions"}, [
                m("div", {class: "ui primary approve button"}, "Save"),
                m("div", {class: "ui cancel button"}, "Cancel")
            ])
        ])
    ]
}

module.exports = AlarmJobFigureDetail