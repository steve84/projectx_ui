var m = require("mithril")

var baseUrl = "http://localhost:5000/api/"

var AlarmCondition = {
    list: [],
    numResults: 0,
    totalPages: 0,
    page: 1,
    pageSize: 15,
    orderByField: "id",
    orderByDirection: "",
    loading: false,
    queryParams: {},
    getAllAlarmConditions: () => {
        AlarmCondition.queryParams["page[number]"] = AlarmCondition.page
        AlarmCondition.queryParams["page[size]"] = AlarmCondition.pageSize
        if (!AlarmCondition.queryParams.hasOwnProperty("filter[objects]")) {
            AlarmCondition.queryParams["filter[objects]"] = {}
        }
        AlarmCondition.queryParams["sort"] = AlarmCondition.orderByDirection + AlarmCondition.orderByField
        tmpQueryParams = Object.assign({}, AlarmCondition.queryParams);
        tmpQueryParams["filter[objects]"] = JSON.stringify(AlarmCondition.queryParams["filter[objects]"])
        AlarmCondition.loading = true;
        return m.request({
            method: "GET",
            url: baseUrl + "alarm_conditions",
            params: tmpQueryParams,
            headers: {"Accept": "application/vnd.api+json"}
        }).then(res => {
            AlarmCondition.list = res.data
            AlarmCondition.numResults = res.meta.total
            AlarmCondition.page = tmpQueryParams["page[number]"]
            AlarmCondition.pageSize = tmpQueryParams["page[size]"]
            AlarmCondition.totalPages = Math.trunc(AlarmCondition.numResults / AlarmCondition.pageSize) + 1
            AlarmCondition.loading = false
        })
    }
}

module.exports = AlarmCondition