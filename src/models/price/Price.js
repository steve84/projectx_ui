var m = require("mithril")

var baseUrl = "http://localhost:5000/api/"

var Price = {
    list: [],
    numResults: 0,
    totalPages: 0,
    page: 1,
    pageSize: 15,
    orderByField: "close_time",
    orderByDirection: "-",
    loading: false,
    queryParams: {},
    getAllPrices: () => {
        Price.queryParams["page[number]"] = Price.page
        Price.queryParams["page[size]"] = Price.pageSize
        if (!Price.queryParams.hasOwnProperty("filter[objects]")) {
            Price.queryParams["filter[objects]"] = {}
        }
        Price.queryParams["sort"] = Price.orderByDirection + Price.orderByField
        tmpQueryParams = Object.assign({}, Price.queryParams);
        tmpQueryParams["filter[objects]"] = JSON.stringify(Price.queryParams["filter[objects]"])
        Price.loading = true;
        return m.request({
            method: "GET",
            url: baseUrl + "prices",
            params: tmpQueryParams,
            /*params: {
                "include": "set,scores"
            },*/
            headers: {"Accept": "application/vnd.api+json"}
        }).then(res => {
            Price.list = res.data
            Price.list.filter(p => !!p.relationships.exchange && !!p.relationships.exchange.data).forEach(p => p.attributes.exchange_id = p.relationships.exchange.data.id)
            Price.numResults = res.meta.total
            Price.page = tmpQueryParams["page[number]"]
            Price.pageSize = tmpQueryParams["page[size]"]
            Price.totalPages = Math.trunc(Price.numResults / Price.pageSize) + 1
            Price.loading = false
        })
    }
}

module.exports = Price