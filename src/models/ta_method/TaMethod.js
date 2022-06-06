var m = require("mithril")

var baseUrl = "http://localhost:5000/api/"

var TaMethod = {
    list: [],
    numResults: 0,
    totalPages: 0,
    page: 1,
    pageSize: 15,
    orderByField: "id",
    orderByDirection: "",
    loading: false,
    queryParams: {},
    getAllTaMethods: () => {
        TaMethod.queryParams["page[number]"] = TaMethod.page
        TaMethod.queryParams["page[size]"] = TaMethod.pageSize
        if (!TaMethod.queryParams.hasOwnProperty("filter[objects]")) {
            TaMethod.queryParams["filter[objects]"] = {}
        }
        TaMethod.queryParams["sort"] = TaMethod.orderByDirection + TaMethod.orderByField
        tmpQueryParams = Object.assign({}, TaMethod.queryParams);
        tmpQueryParams["filter[objects]"] = JSON.stringify(TaMethod.queryParams["filter[objects]"])
        TaMethod.loading = true;
        return m.request({
            method: "GET",
            url: baseUrl + "ta_methods",
            params: tmpQueryParams,
            headers: {"Accept": "application/vnd.api+json"}
        }).then(res => {
            TaMethod.list = res.data
            TaMethod.numResults = res.meta.total
            TaMethod.page = tmpQueryParams["page[number]"]
            TaMethod.pageSize = tmpQueryParams["page[size]"]
            TaMethod.totalPages = Math.trunc(TaMethod.numResults / TaMethod.pageSize) + 1
            TaMethod.loading = false
        })
    }
}

module.exports = TaMethod