var m = require("mithril")

var Price = require("../../models/price/Price")
var Exchange = require("../../models/exchange/Exchange")

var Table = require("../common/Table")


var state = {
    cols: [
        {"name": "Close time", "property": "close_time"},
        {"name": "Open", "property": "open_value"},
        {"name": "High", "property": "high_value"},
        {"name": "Low", "property": "low_value"},
        {"name": "Close", "property": "close_value"},
        {"name": "Volume", "property": "volume_value"},
        {"name": "Exchange", "property": "exchange_id", "fn": row => {
            if (!!row && !!row.exchange_id) {
                exchange = Exchange.getExchangeById(row.exchange_id)
                if (!!exchange && !!exchange.attributes) {
                    return exchange.attributes.exchange_name
                }
            }
            return undefined
        }},
        {"name": "Interval", "property": "interval"}
    ]
}

var PriceList =  {
    oninit: Price.getAllPrices,
    view: () => [
        m(Table, {
            "pageable": true,
            "isLoading": () => Price.loading,
            "getList": () => Price.list,
            "cols": state.cols,
            "fn": Price.getAllPrices,
            "getNumResults": () => Price.numResults,
            "setPage": (page) => Price.page = page,
            "getPage": () => Price.page,
            "getTotalPages": () => Price.totalPages,
            "getOrderByField": () => Price.orderByField,
            "setOrderByField": (field) => Price.orderByField = field,
            "getOrderByDirection": () => Price.orderByDirection,
            "setOrderByDirection": (direction) => Price.orderByDirection = direction
        })
    ]
}

module.exports = PriceList