from flask import Flask, Response

app = Flask(__name__)


@app.get("/")
def hello_world():
    print("new hello request")
    xml = 'api test'
    return Response(xml, mimetype='text/xml')
