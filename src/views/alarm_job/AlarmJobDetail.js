var m = require("mithril")

var MiscUtil = require("../../utils/MiscUtil")

var AlarmJob = require("../../models/alarm_job/AlarmJob")
var AlarmJobFigure = require("../../models/alarm_job_figure/AlarmJobFigure")
var AlarmJobLog = require("../../models/alarm_job_log/AlarmJobLog")

var AlarmJobForm = require("./AlarmJobForm")
var AlarmJobFigureList = require("../../views/alarm_job_figure/AlarmJobFigureList")

var Table = require("../../views/common/Table")

var PropertyList = {
    oninit: vnode => {
        vnode.state.cols = vnode.attrs.cols
        vnode.state.data = vnode.attrs.data
    },
    view: vnode => {
        if (MiscUtil.hasPropertyPath(vnode, "state.data.is_active")) {
            return m("tbody", vnode.state.cols.map(col => m("tr", [
                m("td", {class: "two wide column"},  col.name), 
                m("td", col.fn ? col.fn(vnode.state.data) : col.property.split('.').reduce((o, k) => o.hasOwnProperty(k) ? o[k] : "", vnode.state.data))
            ])))
        }
    }
}

var LogTable = {
    view: vnode => m(Table, {
        "pageable": true,
        "sortable": false,
        "isLoading": () => AlarmJobLog.loading,
        "getList": () => AlarmJobLog.list,
        "cols": vnode.attrs.log_cols,
        "fn": AlarmJobLog.getLogsById,
        "getNumResults": () => AlarmJobLog.numResults,
        "setPage": page => AlarmJobLog.page = page,
        "getPage": () => AlarmJobLog.page,
        "getTotalPages": () => AlarmJobLog.totalPages,
        "getOrderByField": () => AlarmJobLog.orderByField,
        "setOrderByField": field => AlarmJobLog.orderByField = field,
        "getOrderByDirection": () => AlarmJobLog.orderByDirection,
        "setOrderByDirection": direction => AlarmJobLog.orderByDirection = direction
    }),
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
        AlarmJobFigure.getAlarmJobFiguresByAlarmId(vnode.attrs.key)
        AlarmJobLog.getLogsById(vnode.attrs.key)
    },
    view: (vnode) => m("div", {class: "ui grid"}, [
        m("div", {class: "sixteen wide column"}, m("div", {class: "ui card", style: "width: 100%; margin-top: 15px"}, [
            m("div", {class: "ui definition table"},  MiscUtil.hasPropertyPath(AlarmJob, "actualAlarmJob.attributes") ? m(PropertyList, {"cols": vnode.state.cols, "data": AlarmJob.actualAlarmJob.attributes}) : null),
            m("div", {}, [
                m("button", {
                    class: "mini ui secondary button",
                    onclick: e => {
                        $("#alarm_job_detail_modal").modal("show")
                    }
                }, "Edit"),
                m("button", {
                    class: "mini ui secondary button",
                    onclick: e => AlarmJob.deleteJob(vnode.attrs.key).then(() => {
                        var pre_num_entries = AlarmJob.list.length
                        AlarmJob.list = AlarmJob.list.filter(e => e.id !== vnode.attrs.key)
                        AlarmJob.numResults -= (pre_num_entries - AlarmJobFigure.list.length)
                        m.route.set("/alarm_jobs")
                      })
                }, "Delete")
            ])
        ])),
        m("div", {class: "sixteen wide column"},[
            m("button", {
                class: "mini ui primary button",
                onclick: e => {
                    AlarmJobFigure.setDefaultAlarmJobFigure()
                    $("#alarm_job_figure_detail_modal").modal("show")
                }
            }, "Add new figure"),
            m(AlarmJobFigureList, {alarm_job_id: vnode.attrs.key}),
            MiscUtil.hasPropertyPath(AlarmJob, "actualAlarmJob.attributes.is_active") ? m(AlarmJobForm, {alarm_job: AlarmJob.actualAlarmJob, modal_id: "alarm_job_detail_modal"}) : null,
            m(LogTable, {
                log_cols: [
                    {"name": "Id", "property": "id", sortable: false},
                    {"name": "Creation timestamp", "property": "create_ts", sortable: false, "fn": row => row["create_ts"] ? new Date(row["create_ts"]).toLocaleString() : ""},
                    {"name": "Chart", "property": "chart", sortable: false, "fn": row => m("img", {class: "ui fluid image", src: "data:" + row["datatype"] + ";base64, " + row["chart"]})}
                ]
            })
        ]),
        m(m.route.Link, {selector: "button", class: "mini ui primary button", href: vnode.state.backlink}, "Back")
    ])
}

module.exports = AlarmJobDetail