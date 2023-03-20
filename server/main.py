"""
Created on Sun Mar 19 19:46:07 2023
@author: Basketball Chess
"""

from flask import Flask, request, make_response, render_template_string, render_template, send_from_directory
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS, cross_origin #comment this on deployment
import pandas as pd
import re

app = Flask(__name__, static_url_path='', static_folder='frontend/build')

CORS(app)
api = Api(app)

# Default route, no purpose for this really
@app.route("/", defaults={'path':''})
def serve(path):
    return {
      'resultStatus': 'SUCCESS',
      'message': "Hello Api Handler"
      }

# Search route, loads dataframe and returns matching episodes
@app.route("/search", methods=["GET", "POST"])
def search():
    if request.method == "POST":
        payload = request.get_json()
        df = pd.read_csv("openFloorEps_formatted.csv")
        
        title = payload["title"]
        summary = payload["summary"]
        startDate = payload["startDate"]
        endDate = payload["endDate"]
        
        if (startDate != ""):
            df = df[df["date"] > startDate]
        if (endDate != ""):
            df = df[df["date"] < endDate]
        
        if (title != "") and (summary != ""):
            df = df[(df["title"].str.contains(title, case=False)) |
                    (df["summary"].str.contains(summary, case=False))]
        elif (title != ""):
            df = df[df["title"].str.contains(title, case=False)]
        elif (summary != ""):
            df = df[df["summary"].str.contains(summary, case=False)]
            
        df = df.set_axis(["Index", "Title", "Summary", "Date", "Link"], axis=1)       
        htmlDf = df.to_json(orient="records")
        resp = make_response(render_template_string(htmlDf))

        resp.headers.add('Access-Control-Allow-Origin', '*')
        resp.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        resp.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return resp
    
    return render_template('./search.html')
    

if __name__ == '__main__':
    app.debug = True
    app.run()
