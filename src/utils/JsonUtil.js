var JsonUtil = {
    enrichResponse: resp => {
        if (!!resp && resp.included) {
            resp.data.forEach(e => {
                e.attributes.id = e.id
                Object.keys(e.relationships).forEach(rel => {
                    if (e.relationships[rel].data instanceof Array) {
                        e.attributes["_" + rel] = []
                        e.relationships[rel].data.forEach(s => {
                            inc = resp.included.find(i => i.type === s.type && i.id === s.id)
                            if (!!inc) {
                                inc.attributes.id = inc.id
                                e.attributes["_" + rel].push(inc.attributes)
                            }
                        })
                    } else {
                        e.attributes[rel] = {}
                        if (!!e.relationships[rel] && !!e.relationships[rel].data) {
                            inc = resp.included.find(i => i.type === e.relationships[rel].data.type && i.id === e.relationships[rel].data.id)
                            if (!!inc) {
                                if (!inc.attributes) {
                                    inc.attributes = {}
                                }
                                inc.attributes.id = inc.id
                                e.attributes["_" + rel] = inc.attributes
                            }
                        }
                    }
                })
            })
        }
        console.log(resp)
        return resp
    },
    removePropertiesFromObject: (obj, prefix, depth, max_depth) =>  {
        if (depth > max_depth || !obj) {
            return
        }
        Object.keys(obj).forEach(key => {
            if (key.startsWith(prefix)) {
                delete obj[key]
            } else if (typeof obj[key] === 'object') {
                JsonUtil.removePropertiesFromObject(obj[key], prefix, depth + 1, max_depth)
            }
        })
    }
}

module.exports = JsonUtil