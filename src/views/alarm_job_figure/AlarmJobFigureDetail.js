var m = require("mithril")

var AlarmJobFigureForm = require("./AlarmJobFigureForm")

var AlarmJobFigureDetail = {
    view: () => [
        m("div", {class: "ui modal", id: "alarm_job_figure_detail_modal"}, [
            m("div", {class: "header"}, "Alarm figure detail"),
            m("div", {class: "content"}, m(AlarmJobFigureForm)),
            m("div", {class: "actions"}, [
                m("div", {class: "ui primary approve button"}, "Save"),
                m("div", {class: "ui cancel button"}, "Cancel")
            ])
        ])
    ]
}

module.exports = AlarmJobFigureDetail