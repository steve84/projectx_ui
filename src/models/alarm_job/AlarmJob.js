var m = require("mithril")

var JsonUtil = require("../../utils/JsonUtil")

var baseUrl = "http://localhost:5000/api/"

var AlarmJob = {
    list: [],
    numResults: 0,
    totalPages: 0,
    page: 1,
    pageSize: 15,
    orderByField: "id",
    orderByDirection: "",
    loading: false,
    queryParams: {},
    actualAlarmJob: {},
    getAllAlarms: () => {
        AlarmJob.queryParams["page[number]"] = AlarmJob.page
        AlarmJob.queryParams["page[size]"] = AlarmJob.pageSize
        if (!AlarmJob.queryParams.hasOwnProperty("filter[objects]")) {
            AlarmJob.queryParams["filter[objects]"] = {}
        }
        AlarmJob.queryParams["sort"] = AlarmJob.orderByDirection + AlarmJob.orderByField
        tmpQueryParams = Object.assign({}, AlarmJob.queryParams)
        tmpQueryParams["filter[objects]"] = JSON.stringify(AlarmJob.queryParams["filter[objects]"])
        tmpQueryParams["include"] = "alarm_job_figures"
        AlarmJob.loading = true;
        return m.request({
            method: "GET",
            url: baseUrl + "alarm_jobs",
            params: tmpQueryParams,
            headers: {"Accept": "application/vnd.api+json"}
        }).then(res => {
            res_enriched = JsonUtil.enrichResponse(res)
            AlarmJob.list = res_enriched.data
            AlarmJob.numResults = res.meta.total
            AlarmJob.page = tmpQueryParams["page[number]"]
            AlarmJob.pageSize = tmpQueryParams["page[size]"]
            AlarmJob.totalPages = Math.trunc(AlarmJob.numResults / AlarmJob.pageSize) + 1
            AlarmJob.loading = false
        })
    },
    getAlarmJobById: id => {
        AlarmJob.actualAlarmJob = {}
        if (!!AlarmJob.list && AlarmJob.list.length > 0) {
            alarmJob = AlarmJob.list.find(e => e.id == id)
            AlarmJob.actualAlarmJob = !!alarmJob ? alarmJob.attributes : {}
        } else {
            AlarmJob.loading = true
            AlarmJob.actualAlarmJob = {}
            m.request({
                method: "GET",
                url: baseUrl + "alarm_jobs/" + id,
                headers: {"Accept": "application/vnd.api+json"}
            }).then(res => AlarmJob.actualAlarmJob = res.data.attributes)
        }
    }
}

module.exports = AlarmJob