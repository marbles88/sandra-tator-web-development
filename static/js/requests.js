async function requestFromServer({
    url,
    method = "GET",
    func,
    headers,
    body,
    params
}) {
    if (!url) {
        console.error('Error: No URL provided, no request sent');
        return;
    }
    if ((method.toUpperCase() == "GET" || method.toUpperCase() == "HEAD") && body != undefined) {
        console.error('Cannot have body in GET or HEAD request, no request sent');
        return;
    }
    if (body) headers = {...headers,
        "Content-Type": "application/json",
        "Accept": "application/json"
    };
    if (params) {
        url += '?'
        Object.keys(params).forEach(param => {
            url += encodeURI(`${param}=${params[param]}&`);
        });
        url = url.slice(0, url.length - 1);
    }
    console.log(`${method} Request: ${url}`);
    let options = {
            method: method.toUpperCase(),
            body: JSON.stringify(body),
            headers: headers,
        }
        // // console.log(options.body);
    return fetch(url, options).then(res => {
        try {
            return res.json();
        } catch (err) {
            return res.text();
        }
    }).then(data => {
        if (data.msg) createNotification(data.msg);
        if (func) func(data);
        return data;
    });
}