var m = require("mithril")

var AlarmJob = require("../../models/alarm_job/AlarmJob")
var AlarmJobFigure = require("../../models/alarm_job_figure/AlarmJobFigure")

var AlarmJobFigureList = require("../../views/alarm_job_figure/AlarmJobFigureList")


var PropertyList = {
    view: function(vnode) {
        if (vnode.attrs.data) {
            return m("tbody", vnode.attrs.cols.map(col => m("tr", [
                m("td", {class: "two wide column"},  col.name), 
                m("td", col.fn ? col.fn(vnode.attrs.data) : col.property.split('.').reduce((o, k) => o.hasOwnProperty(k) ? o[k] : "", vnode.attrs.data))
            ])))
        }
    }
}

var AlarmJobDetail =  {
    oninit: (vnode) => {
        vnode.state.backlink = vnode.attrs.backlink
        vnode.state.cols = [
            {"name": "Active", "property": "is_active", "fn": row => row["is_active"] ? "Ja" : "Nein"},
            {"name": "Name", "property": "job_name"},
            {"name": "Remarks", "property": "job_remark"},
            {"name": "Last check", "property": "last_check", "fn": row => row["last_check"] ? new Date(row["last_check"]).toLocaleString() : ""},
            {"name": "Newest figure ts", "property": "key_figure_ts", "fn": row => row["last_check"] ? new Date(row["last_check"]).toLocaleString() : ""},
        ]
        AlarmJob.getAlarmJobById(vnode.attrs.key)
        AlarmJobFigure.getAlarmJobFiguresByAlarmId(vnode.attrs.key)},
    view: (vnode) => m("div", {class: "ui grid"}, [
        m("div", {class: "sixteen wide column"}, m("div", {class: "ui card", style: "width: 100%; margin-top: 15px"}, m("div", {class: "ui definition table"}, m(PropertyList, {"cols": vnode.state.cols, "data": AlarmJob.actualAlarmJob})))),
        m("div", {class: "sixteen wide column"}, AlarmJobFigure.list && AlarmJobFigure.list.length > 0 ? m(AlarmJobFigureList) : m("div")),
        m(m.route.Link, {selector: "button", class: "mini ui primary button", href: vnode.state.backlink}, "Zurück")
    ])
}

module.exports = AlarmJobDetail