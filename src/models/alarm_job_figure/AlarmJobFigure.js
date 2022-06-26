var m = require("mithril")

var JsonUtil = require("../../utils/JsonUtil")
var MiscUtil = require("../../utils/MiscUtil")

var baseUrl = "http://localhost:5000/api/"

var AlarmJobFigure = {
    attributes: ['alarm_condition_arguments', 'interval', 'method_arguments', 'alarm_job_id'],
    list: [],
    numResults: 0,
    totalPages: 0,
    page: 1,
    pageSize: 15,
    orderByField: "id",
    orderByDirection: "",
    loading: false,
    queryParams: {},
    actualAlarmJobFigure: {}, 
    getAlarmJobFiguresByAlarmId: alarm_job_id => {
        AlarmJobFigure.queryParams["page[number]"] = AlarmJobFigure.page
        AlarmJobFigure.queryParams["page[size]"] = AlarmJobFigure.pageSize
        AlarmJobFigure.queryParams["filter[objects]"] = [{"name": "alarm_job_id", "op": "eq", "val": alarm_job_id}]
        if (!AlarmJobFigure.queryParams.hasOwnProperty("filter[objects]")) {
            AlarmJobFigure.queryParams["filter[objects]"] = {}
        }
        AlarmJobFigure.queryParams["sort"] = AlarmJobFigure.orderByDirection + AlarmJobFigure.orderByField
        tmpQueryParams = Object.assign({}, AlarmJobFigure.queryParams)
        tmpQueryParams["filter[objects]"] = JSON.stringify(AlarmJobFigure.queryParams["filter[objects]"])
        tmpQueryParams["include"] = "pair,exchange,key_figure,ta_method,alarm_condition"
        AlarmJobFigure.loading = true;
        return m.request({
            method: "GET",
            url: baseUrl + "alarm_job_figures",
            params: tmpQueryParams,
            headers: {"Accept": "application/vnd.api+json"}
        }).then(res => {
            res_enriched = JsonUtil.enrichResponse(res)
            AlarmJobFigure.list = res_enriched.data
            AlarmJobFigure.numResults = res.meta.total
            AlarmJobFigure.page = tmpQueryParams["page[number]"]
            AlarmJobFigure.pageSize = tmpQueryParams["page[size]"]
            AlarmJobFigure.totalPages = Math.trunc(AlarmJobFigure.numResults / AlarmJobFigure.pageSize) + 1
            AlarmJobFigure.loading = false
        })
    },
    getAlarmJobFigureById: id => {
      return m.request({
        method: "GET",
        url: baseUrl + "alarm_job_figures/" + id,
        params: {
          "include": "pair,exchange,key_figure,ta_method,alarm_condition"
        },
        headers: {
          "Accept": "application/vnd.api+json",
        }
      })
    },
    createOrUpdateFigure: figure => {
      copiedFigure = MiscUtil.deepCopy(figure)
      JsonUtil.keepPropertiesOnObject(copiedFigure.attributes, AlarmJobFigure.attributes)
      JsonUtil.removeInvalidRelationships(copiedFigure.relationships)
      if (!copiedFigure.id) {
        delete copiedFigure.id
      }
      return m.request({
        method: !!figure.id ? "PATCH" : "POST",
        url: baseUrl + "alarm_job_figures" + (!!figure.id ? "/" + figure.id : ""),
        params: {
          "include": "pair,exchange,key_figure,ta_method,alarm_condition"
        },
        headers: {
          "Accept": "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json"
        },
        body: {"data": copiedFigure}
      }).then(res => {
        if (MiscUtil.hasPropertyPath(res, "data.attributes")) {
          var res_enriched = JsonUtil.enrichResponse(res)
          AlarmJobFigure.list.push(res_enriched.data)
          AlarmJobFigure.numResults += 1
        } else {
          AlarmJobFigure.getAlarmJobFigureById(figure.id).then(res_figure => {
            var figure_enriched = JsonUtil.enrichResponse(res_figure)
            var index = AlarmJobFigure.list.findIndex(e => e.id === figure_enriched.data.id)
            AlarmJobFigure.list[index] = figure_enriched.data
          })
        }
      })
    },
    deleteFigure: id => {
      return m.request({
        method: "DELETE",
        url: baseUrl + "alarm_job_figures/" + id,
        headers: {
          "Accept": "application/vnd.api+json",
        }
      }).then(() => {
        var pre_num_entries = AlarmJobFigure.list.length
        AlarmJobFigure.list = AlarmJobFigure.list.filter(e => e.id !== id)
        AlarmJobFigure.numResults -= (pre_num_entries - AlarmJobFigure.list.length)
      })
    },
    setActualAlarmJobFigure: alarm_job_figure => {
        AlarmJobFigure.actualAlarmJobFigure = alarm_job_figure
        Object.keys(AlarmJobFigure.actualAlarmJobFigure.relationships).forEach(key => {
            if (!AlarmJobFigure.actualAlarmJobFigure.relationships[key].data) {
                AlarmJobFigure.actualAlarmJobFigure.relationships[key].data = {id: "", type: ""}
                if (key === "alarm_condition") {
                    AlarmJobFigure.actualAlarmJobFigure.relationships[key].data["type"] = "alarm_conditions"
                }
                if (key === "exchange") {
                    AlarmJobFigure.actualAlarmJobFigure.relationships[key].data["type"] = "exchanges"
                }
                if (key === "ta_method") {
                    AlarmJobFigure.actualAlarmJobFigure.relationships[key].data["type"] = "ta_methods"
                }
                if (key === "key_figure") {
                    AlarmJobFigure.actualAlarmJobFigure.relationships[key].data["type"] = "key_figures"
                }
                if (key === "pair") {
                    AlarmJobFigure.actualAlarmJobFigure.relationships[key].data["type"] = "pairs"
                }
            }
        })
    },
    setDefaultAlarmJobFigure: () => {
        AlarmJobFigure.actualAlarmJobFigure = {
          "attributes": {
            "alarm_condition_arguments": {},
            "interval": 900,
            "method_arguments": {},
            "alarm_job_id": null,
            "_alarm_condition": {},
            "_ta_method": {},
          },
          "id": "",
          "relationships": {
            "alarm_condition": {
              "data": {
                "id": "",
                "type": "alarm_conditions"
              }
            },
            "exchange": {
              "data": {
                "id": "",
                "type": "exchanges"
              }
            },
            "key_figure": {
              "data": {
                "id": "",
                "type": "key_figures"
              }
            },
            "pair": {
              "data": {
                "id": "",
                "type": "pairs"
              }
            },
            "ta_method": {
              "data": {
                "id": "",
                "type": "ta_methods"
              }
            }
          },
          "type": "alarm_job_figures"
        }
    }
}

module.exports = AlarmJobFigure