var m = require("mithril")

var baseUrl = "http://localhost:5000/api/"

var Pair = {
    list: [],
    numResults: 0,
    totalPages: 0,
    page: 1,
    pageSize: 15,
    orderByField: "id",
    orderByDirection: "",
    loading: false,
    queryParams: {},
    getAllPairs: () => {
        Pair.queryParams["page[number]"] = Pair.page
        Pair.queryParams["page[size]"] = Pair.pageSize
        if (!Pair.queryParams.hasOwnProperty("filter[objects]")) {
            Pair.queryParams["filter[objects]"] = {}
        }
        Pair.queryParams["sort"] = Pair.orderByDirection + Pair.orderByField
        tmpQueryParams = Object.assign({}, Pair.queryParams);
        tmpQueryParams["filter[objects]"] = JSON.stringify(Pair.queryParams["filter[objects]"])
        Pair.loading = true;
        return m.request({
            method: "GET",
            url: baseUrl + "pairs",
            params: tmpQueryParams,
            /*params: {
                "include": "set,scores"
            },*/
            headers: {"Accept": "application/vnd.api+json"}
        }).then(res => {
            Pair.list = res.data
            Pair.numResults = res.meta.total
            Pair.page = tmpQueryParams["page[number]"]
            Pair.pageSize = tmpQueryParams["page[size]"]
            Pair.totalPages = Math.trunc(Pair.numResults / Pair.pageSize) + 1
            Pair.loading = false
        })
    }
}

module.exports = Pair