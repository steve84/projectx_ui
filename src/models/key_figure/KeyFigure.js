var m = require("mithril")

var baseUrl = "http://localhost:5000/api/"

var KeyFigure = {
    list: [],
    numResults: 0,
    totalPages: 0,
    page: 1,
    pageSize: 15,
    orderByField: "id",
    orderByDirection: "",
    loading: false,
    queryParams: {},
    getAllKeyFigures: () => {
        KeyFigure.queryParams["page[number]"] = KeyFigure.page
        KeyFigure.queryParams["page[size]"] = KeyFigure.pageSize
        if (!KeyFigure.queryParams.hasOwnProperty("filter[objects]")) {
            KeyFigure.queryParams["filter[objects]"] = {}
        }
        KeyFigure.queryParams["sort"] = KeyFigure.orderByDirection + KeyFigure.orderByField
        tmpQueryParams = Object.assign({}, KeyFigure.queryParams);
        tmpQueryParams["filter[objects]"] = JSON.stringify(KeyFigure.queryParams["filter[objects]"])
        KeyFigure.loading = true;
        return m.request({
            method: "GET",
            url: baseUrl + "key_figures",
            params: tmpQueryParams,
            headers: {"Accept": "application/vnd.api+json"}
        }).then(res => {
            KeyFigure.list = res.data
            KeyFigure.numResults = res.meta.total
            KeyFigure.page = tmpQueryParams["page[number]"]
            KeyFigure.pageSize = tmpQueryParams["page[size]"]
            KeyFigure.totalPages = Math.trunc(KeyFigure.numResults / KeyFigure.pageSize) + 1
            KeyFigure.loading = false
        })
    }
}

module.exports = KeyFigure