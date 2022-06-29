var m = require("mithril")

var MiscUtil = require("../../utils/MiscUtil")

var AlarmJob = require("../../models/alarm_job/AlarmJob")
var AlarmJobFigure = require("../../models/alarm_job_figure/AlarmJobFigure")
var AlarmJobLog = require("../../models/alarm_job_log/AlarmJobLog")

var Table = require("../../views/common/Table")
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

var PropertyEdit = {
    oninit: vnode => {
        vnode.state.alarm_job = MiscUtil.deepCopy(vnode.attrs.alarm_job)
    },
    oncreate: vnode =>  $("div[name='is_active']").checkbox(vnode.state.alarm_job.attributes.is_active ? "check" : "uncheck"),
    view: vnode => m("div", {class: "ui modal", id: "alarm_job_detail_modal"}, [
            m("div", {class: "header"}, "Alarm detail"),
            m("div", {class: "content"},  MiscUtil.hasPropertyPath(vnode.state, "alarm_job.attributes.is_active") ? m("div", {class: "ui form", id: "alarm_job_detail_form"}, [
                m("div", {class: "field"}, [
                    m("label", "Is Active"),
                    m("div", {
                        class: "ui checkbox",
                        name: "is_active"
                    }, [
                        m("input", {
                            class: "hidden",
                            type: "checkbox"
                        }),
                        m("label", "")
                    ])
                ]),
                m("div", {class: "field"}, [
                    m("label", "Name"),
                    m("input", {
                        type: "text",
                        value: vnode.state.alarm_job.attributes.job_name,
                        name: "job_name",
                        onchange: e => vnode.state.alarm_job.attributes.job_name = e.target.value
                    })
                ]),
                m("div", {class: "field"}, [
                    m("label", "Remarks"),
                    m("input", {
                        type: "text",
                        value: vnode.state.alarm_job.attributes.job_remark,
                        name: "job_remark",
                        onchange: e => vnode.state.alarm_job.attributes.job_remark = e.target.value
                    })
                ])
            ]): m("span")),
            m("div", {class: "actions"}, [
                m("div", {
                    class: "ui primary approve button",
                    onclick: () => {
                        vnode.state.alarm_job.attributes.is_active = $("div[name='is_active']").checkbox("is checked")
                        AlarmJob.createOrUpdateJob(vnode.state.alarm_job)
                    }
                }, "Save"),
                m("div", {class: "ui cancel button"}, "Cancel")
            ])
        ])
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
            m("div", {class: "ui definition table"}, m(PropertyList, {"cols": vnode.state.cols, "data": AlarmJob.actualAlarmJob.attributes})),
            m("div", {}, [
                m("button", {
                    class: "mini ui secondary button",
                    onclick: e => {
                        $("#alarm_job_detail_modal").modal("show")
                    }
                }, "Edit"),
                m("button", {
                    class: "mini ui secondary button",
                    onclick: e => AlarmJob.deleteJob(vnode.attrs.key)
                }, "Delete")
            ])
        ])),
        m("div", {class: "sixteen wide column"}, AlarmJobFigure.list && AlarmJobFigure.list.length > 0 ? [
            m("button", {
                class: "mini ui primary button",
                onclick: e => {
                    AlarmJobFigure.setDefaultAlarmJobFigure()
                    $("#alarm_job_figure_detail_modal").modal("show")
                }
            }, "Add new figure"),
            m(AlarmJobFigureList, {alarm_job_id: vnode.attrs.key}),
            m(PropertyEdit, {alarm_job: AlarmJob.actualAlarmJob}),
            m(LogTable, {
                log_cols: [
                    {"name": "Id", "property": "id", sortable: false},
                    {"name": "Creation timestamp", "property": "create_ts", sortable: false, "fn": row => row["create_ts"] ? new Date(row["create_ts"]).toLocaleString() : ""},
                    {"name": "Chart", "property": "chart", sortable: false, "fn": row => m("img", {class: "ui fluid image", src: "data:" + row["datatype"] + ";base64, " + row["chart"]})}
                ]
            })
        ] : m("div")),
        m(m.route.Link, {selector: "button", class: "mini ui primary button", href: vnode.state.backlink}, "Back")
    ])
}

module.exports = AlarmJobDetail