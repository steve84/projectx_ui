var m = require("mithril")

var baseUrl = "http://localhost:5000/api/"

var Exchange = {
    list: [],
    numResults: 0,
    totalPages: 0,
    page: 1,
    pageSize: 15,
    orderByField: "id",
    orderByDirection: "",
    loading: false,
    queryParams: {},
    getAllExchanges: () => {
        Exchange.queryParams["page[number]"] = Exchange.page
        Exchange.queryParams["page[size]"] = Exchange.pageSize
        if (!Exchange.queryParams.hasOwnProperty("filter[objects]")) {
            Exchange.queryParams["filter[objects]"] = {}
        }
        Exchange.queryParams["sort"] = Exchange.orderByDirection + Exchange.orderByField
        tmpQueryParams = Object.assign({}, Exchange.queryParams);
        tmpQueryParams["filter[objects]"] = JSON.stringify(Exchange.queryParams["filter[objects]"])
        Exchange.loading = true;
        return m.request({
            method: "GET",
            url: baseUrl + "exchanges",
            params: tmpQueryParams,
            /*params: {
                "include": "set,scores"
            },*/
            headers: {"Accept": "application/vnd.api+json"}
        }).then(res => {
            Exchange.list = res.data
            Exchange.numResults = res.meta.total
            Exchange.page = tmpQueryParams["page[number]"]
            Exchange.pageSize = tmpQueryParams["page[size]"]
            Exchange.totalPages = Math.trunc(Exchange.numResults / Exchange.pageSize) + 1
            Exchange.loading = false
        })
    },
    getExchangeById: id => {
        if (!!Exchange.list && Exchange.list.length > 0) {
            return Exchange.list.find(e => e.id == id)
        }
        return null
    }
}

module.exports = Exchange