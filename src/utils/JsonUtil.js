var JsonUtil = {
    // https://24ways.org/2010/calculating-color-contrast/
    enrichResponse: resp => {
        if (!!resp && resp.included) {
            resp.data.forEach(e => {
                e.attributes.id = e.id
                Object.keys(e.relationships).forEach(rel => {
                    if (e.relationships[rel].data instanceof Array) {
                        e.attributes[rel] = []
                        e.relationships[rel].data.forEach(s => {
                            inc = resp.included.find(i => i.type === s.type && i.id === s.id)
                            if (!!inc) {
                                inc.attributes.id = inc.id
                                e.attributes[rel].push(inc.attributes)
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
                                e.attributes[rel] = inc.attributes
                            }
                        }
                    }
                })
            })
        }
        console.log(resp)
        return resp
    }
}

module.exports = JsonUtil