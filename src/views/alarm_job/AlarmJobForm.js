var m = require("mithril")

var MiscUtil = require("../../utils/MiscUtil")

var AlarmJob = require("../../models/alarm_job/AlarmJob")


var AlarmJobForm =  {
    oninit: vnode => {
        vnode.state.modal_id = vnode.attrs.modal_id
        vnode.state.alarm_job = !!vnode.attrs.alarm_job ? vnode.attrs.alarm_job : {
            attributes: {
                is_active: true,
                job_name: "",
                job_remark: ""
            },
            type: "alarm_jobs"
        }
    },
    onupdate: vnode => $("div[name='is_active']").checkbox(vnode.state.alarm_job && vnode.state.alarm_job.attributes && vnode.state.alarm_job.attributes.is_active ? "check" : "uncheck"),
    view: vnode => m("div", {class: "ui modal", id: vnode.state.modal_id}, [
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
        ]): null),
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

module.exports = AlarmJobForm