var m = require("mithril")

var baseUrl = "http://localhost:5000/api/"

var Symbol = {
    list: [],
    numResults: 0,
    totalPages: 0,
    page: 1,
    pageSize: 15,
    orderByField: "id",
    orderByDirection: "",
    loading: false,
    queryParams: {},
    getAllSymbols: () => {
        Symbol.queryParams["page[number]"] = Symbol.page
        Symbol.queryParams["page[size]"] = Symbol.pageSize
        if (!Symbol.queryParams.hasOwnProperty("filter[objects]")) {
            Symbol.queryParams["filter[objects]"] = {}
        }
        Symbol.queryParams["sort"] = Symbol.orderByDirection + Symbol.orderByField
        tmpQueryParams = Object.assign({}, Symbol.queryParams);
        tmpQueryParams["filter[objects]"] = JSON.stringify(Symbol.queryParams["filter[objects]"])
        Symbol.loading = true;
        return m.request({
            method: "GET",
            url: baseUrl + "symbols",
            params: tmpQueryParams,
            /*params: {
                "include": "set,scores"
            },*/
            headers: {"Accept": "application/vnd.api+json"}
        }).then(res => {
            Symbol.list = res.data
            Symbol.numResults = res.meta.total
            Symbol.page = tmpQueryParams["page[number]"]
            Symbol.pageSize = tmpQueryParams["page[size]"]
            Symbol.totalPages = Math.trunc(Symbol.numResults / Symbol.pageSize) + 1
            Symbol.loading = false
        })
    },
    getSymbolById: id => {
        if (!!Symbol.list && Symbol.list.length > 0) {
            return Symbol.list.find(e => e.id == id)
        }
        return null
    }
}

module.exports = Symbol