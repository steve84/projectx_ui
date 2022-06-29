var m = require("mithril")

var JsonUtil = require("../../utils/JsonUtil")
var MiscUtil = require("../../utils/MiscUtil")

var baseUrl = "http://localhost:5000/api/"

var AlarmJobLog = {
    attributes: [],
    list: [],
    numResults: 0,
    totalPages: 0,
    page: 1,
    pageSize: 15,
    orderByField: "id",
    orderByDirection: "",
    loading: false,
    queryParams: {},
    actualAlarmJobLog: {},
    getLogsById: id => {
        AlarmJobLog.queryParams["page[number]"] = AlarmJobLog.page
        AlarmJobLog.queryParams["page[size]"] = AlarmJobLog.pageSize
        if (!AlarmJobLog.queryParams.hasOwnProperty("filter[objects]")) {
            AlarmJobLog.queryParams["filter[objects]"] = {}
        }
        AlarmJobLog.queryParams["sort"] = AlarmJobLog.orderByDirection + AlarmJobLog.orderByField
        tmpQueryParams = Object.assign({}, AlarmJobLog.queryParams)
        tmpQueryParams["filter[objects]"] = JSON.stringify(AlarmJobLog.queryParams["filter[objects]"])
        AlarmJobLog.loading = true;
        return m.request({
            method: "GET",
            url: baseUrl + ("alarm_jobs/" + id + "/alarm_job_logs"),
            params: tmpQueryParams,
            headers: {"Accept": "application/vnd.api+json"}
        }).then(res => {
            AlarmJobLog.list = res.data
            AlarmJobLog.numResults = res.meta.total
            AlarmJobLog.page = tmpQueryParams["page[number]"]
            AlarmJobLog.pageSize = tmpQueryParams["page[size]"]
            AlarmJobLog.totalPages = Math.trunc(AlarmJobLog.numResults / AlarmJobLog.pageSize) + 1
            AlarmJobLog.loading = false
        })
    }
}

module.exports = AlarmJobLog