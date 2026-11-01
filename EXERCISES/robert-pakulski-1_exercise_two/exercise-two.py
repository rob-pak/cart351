from flask import Flask,render_template,request,redirect,url_for
import requests
app = Flask(__name__)


# the default route
@app.route("/")
def index():
      return render_template("index.html")

#*************************************************
#Task-1: GET REQUEST
@app.route("/t1")
def t1():
    return render_template("t1.html",have_results=False)
#*************************************************
@app.route("/getSearchCriteria")
def getSearchCriteria():
    #fill me in :
    #replace the empty space to be url encoded
    imgFromNasa = request.args["query"]
    imgFromNasa = imgFromNasa.replace(' ', '%20')

    # api request, limit to first image
    url = f"https://images-api.nasa.gov/search?q={imgFromNasa}&media_type=image&page_size=1"
    response = requests.get(url)
    data = response.json()
    
    images = data["collection"]["items"]
    # default value
    description = ""

    # validation
    if images:
        description = images[0]["data"][0]["description"]
        imgFromNasa = images[0]["links"][0]["href"]
    
    return render_template("t1.html",
                              have_results = True,
                              description=description,
                              imgPath = imgFromNasa
                           )
    pass

#*************************************************
# #Task-2: GET REQUEST
@app.route("/t2")
def t2():
    return render_template("t2.html", have_results = False)
#*************************************************
@app.route("/getSearchCriteria_adv")
def getSearchCriteria_adv():
 #fill me in :
    imgFromNasa = request.args["query"]
    imgFromNasa = imgFromNasa.replace(' ', '%20')
    url = f"https://images-api.nasa.gov/search?q={imgFromNasa}&media_type=image"
    response = requests.get(url)
    data = response.json()
    
    # default values
    images = data["collection"]["items"]
    encodedImageLinks = []
    description = ""
    
    # validation
    if images:
        for image in images:
            encodedImageLinks.append(image["links"][0]["href"])

    return render_template("t2.html", have_results = True, images=encodedImageLinks)
    pass
#*************************************************

#run
app.run(debug=True)