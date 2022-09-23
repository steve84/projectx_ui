var m = require("mithril")

var AlarmJob = require("../../models/alarm_job/AlarmJob")

var Table = require("../common/Table")

var AlarmJobForm = require("./AlarmJobForm")


var state = {
    cols: [
        {"name": "Active", "property": "is_active", "fn": row => row["is_active"] ? "Ja" : "Nein"},
        {"name": "Name", "property": "job_name"},
        {"name": "Remarks", "property": "job_remark"},
        {"name": "Last check", "property": "last_check", "fn": row => row["last_check"] ? new Date(row["last_check"]).toLocaleDateString() : ""},
        {"name": "Newest figure ts", "property": "key_figure_ts", "fn": row => row["last_check"] ? new Date(row["last_check"]).toLocaleDateString() : ""},
        {"name": "Details", "sortable": false, "element": row => m("div", m(m.route.Link, {
            selector: "button",
            class: "mini ui secondary button",
            href: '/alarm_job/' + row.id,
            options: {
                state: {backlink: m.route.get()}
            }
        }, "Details"))},
    ]
}

var AlarmJobList =  {
    oninit: AlarmJob.getAllAlarms,
    view: () => [
        m("div", {class: "ui grid"}, [
            m("div", {class: "sixteen wide column", style: "margin-top: 15px; padding-bottom: 0px"}, [
                m("button", {
                    class: "mini ui primary button",
                    onclick: e => $("#alarm_job_new_modal").modal("show")
                }, "Add job")
            ]),
            m(AlarmJobForm, {modal_id: "alarm_job_new_modal"}),
            m("div", {class: "sixteen wide column"}, [
                m(Table, {
                    "pageable": true,
                    "isLoading": () => AlarmJob.loading,
                    "getList": () => AlarmJob.list,
                    "cols": state.cols,
                    "fn": AlarmJob.getAllAlarmJobs,
                    "getNumResults": () => AlarmJob.numResults,
                    "setPage": page => AlarmJob.page = page,
                    "getPage": () => AlarmJob.page,
                    "getTotalPages": () => AlarmJob.totalPages,
                    "getOrderByField": () => AlarmJob.orderByField,
                    "setOrderByField": field => AlarmJob.orderByField = field,
                    "getOrderByDirection": () => AlarmJob.orderByDirection,
                    "setOrderByDirection": direction => AlarmJob.orderByDirection = direction
                })
            ])
        ])
    ]
}

module.exports = AlarmJobList