var m = require("mithril")

var JsonUtil = require("../../utils/JsonUtil")
var MiscUtil = require("../../utils/MiscUtil")

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
        tmpQueryParams["include"] = "base_symbol,quote_symbol"
        Pair.loading = true;
        return m.request({
            method: "GET",
            url: baseUrl + "pairs",
            params: tmpQueryParams,
            headers: {"Accept": "application/vnd.api+json"}
        }).then(res => {
            res_enriched = JsonUtil.enrichResponse(res)
            Pair.list = res_enriched.data
            Pair.numResults = res.meta.total
            Pair.page = tmpQueryParams["page[number]"]
            Pair.pageSize = tmpQueryParams["page[size]"]
            Pair.totalPages = Math.trunc(Pair.numResults / Pair.pageSize) + 1
            Pair.loading = false
        })
    },
    getPairStringById: id => {
        res_str = ""
        pair = Pair.list.find(p => p.id === id)
        if (MiscUtil.hasPropertyPath(pair, "attributes._base_symbol.id")) {
            res_str += pair.attributes._base_symbol.symbol
        }
        if (MiscUtil.hasPropertyPath(pair, "attributes._quote_symbol.id")) {
            res_str += pair.attributes._quote_symbol.symbol
        }
        return res_str
    }
}

module.exports = Pair