var m = require("mithril")

var Exchange = require('./models/exchange/Exchange')
var Pair = require('./models/pair/Pair')
var Symbol = require('./models/symbol/Symbol')

var PriceList = require("./views/price/PriceList")
var AlarmJobList = require("./views/alarm_job/AlarmJobList")
var AlarmJobDetail = require("./views/alarm_job/AlarmJobDetail")

var appState = {
    activeRoute: window.location.hash.split('/').pop()
}

Exchange.getAllExchanges()
Pair.getAllPairs()
Symbol.getAllSymbols()

m.render(document.body, [
    m("nav", m("div", {class: "ui menu"}, [
        m(m.route.Link, {class: (appState && appState.activeRoute == 'prices' ? "active " : "") + "item", href: '/prices', onclick: e => {
            $('a.active.item').first().removeClass('active')
            $(e.srcElement).addClass('active')
            appState.activeRoute = 'prices'
        }}, "Prices"),
        m(m.route.Link, {class: (appState && appState.activeRoute == 'alarm_jobs' ? "active " : "") + "item", href: '/alarm_jobs', onclick: e => {
            $('a.active.item').first().removeClass('active')
            $(e.srcElement).addClass('active')
            appState.activeRoute = 'alarm_jobs'
        }}, "Alarm Jobs")
    ])),
    m("main", m("div", {class: "ui container"}))
])


var mainTag = document.body.vnodes.find(n => n.tag === "main")
var mainContainerTag = mainTag ? mainTag.children[0] : undefined

if (mainContainerTag) {
    m.route(mainContainerTag.dom, "/prices", {
        "/prices": PriceList,
        "/alarm_jobs": AlarmJobList,
        "/alarm_job/:key": AlarmJobDetail,
    })
}