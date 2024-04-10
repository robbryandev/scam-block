from flask import Flask, Response, request

app = Flask(__name__)


@app.get("/")
def hello_world():
    print("new hello request")
    xml = 'api test'
    return Response(xml, mimetype='text/xml')


@app.post("/check")
def check_url():
    print("new check request")

    content_type = request.headers.get('Content-Type')
    if (content_type != 'application/json'):
        print("found Content-Type as: " + content_type)
        return Response('Content-Type not supported!, Expected application/json', mimetype="text/xml", status=415)

    json = request.json
    if json["site"]:
        site = json["site"]
        print("received site: " + site)
        return Response("backend got site: " + site, mimetype="text/xml", status=200)

    return Response("site: string is a required parameter", mimetype="text/xml", status=400)
