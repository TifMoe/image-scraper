const formatJSON = (obj, pretty) => JSON.stringify(obj, null, pretty ? 2 : 0)

const JSONResponse = (obj, status = 200, pretty = true) => {  
    let response = formatJSON(obj, pretty);
    let headers = {
        headers: {
            "content-type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        },
        status: status
    };

    return new Response(response, headers);
}

const JSONErrorResponse = (msg, status = 500, pretty = true) => {   
    let obj = {
        "error": msg
    } 
    return JSONResponse(obj, status, pretty);
}

export { JSONResponse, JSONErrorResponse }