import cherrypy
import os, os.path
import random
import MySQLdb as mdb
import json

import cherrypy
from jinja2 import Environment, FileSystemLoader
env = Environment(loader=FileSystemLoader(''))

conn = mdb.connect("localhost","root","lzdbpass","lucas_test")
curs = conn.cursor()


""" user : id, username, password, fname, lname, email
    deck: id, user_id, deck_name
    card: id, deck_id, front, back
"""
    
class Flashcard(object):

    @cherrypy.expose
    def index(self):
        tmpl = env.get_template('index.html')

        templateVars = {}

        userID = cherrypy.session.get('userID')

        if userID is not None:
            curs.execute("SELECT * FROM user WHERE id = %s" %userID)
            userRow = curs.fetchone()
            templateVars['toggle'] = "loggedIn"
            templateVars['fname'] = userRow[3]

        else:
            templateVars['toggle'] = "default"


        return tmpl.render(templateVars)
#       

    @cherrypy.expose
    def login(self, username, password):
        fields = [username, password]
        if not self.areFieldsFull(fields):
            return "You have a missing field. Please fill in both fields!"
        if not self.isValidCred(username, password):
            return "Your username and/or password are incorrect!"

        curs.execute("SELECT * FROM user WHERE username = '%s'" %username)
        userRow= curs.fetchone()
        userID = userRow[0]
        userHash = self.hashUserID(userID)
        cherrypy.session['userID'] = userID
        cherrypy.session['userHash'] = userHash

        return "success"

    @cherrypy.expose
    def logout(self):
        cherrypy.lib.sessions.expire()
        return "success"
        


    @cherrypy.expose
    def signup(self, username, password, password2, fname, lname, email):
        print (type(username))
        fields = [username, password, password2, fname, lname, email]
        if not self.areFieldsFull(fields):
            return "You have a missing field. Please fill in all fields!"

        if password != password2:
            return "The passwords you entered don't match!"
        curs.execute("SELECT * FROM user WHERE username = '%s'" %username)
        userRow = curs.fetchone()
        if userRow is not None:
            return "You must choose a different username!"
        
        curs.execute("""INSERT INTO user (username, password, fname, lname, email) 
                        VALUES('%s', '%s', '%s', '%s', '%s')""" 
                        %(username, password, fname, lname, email))
        conn.commit()
        self.login(username, password)
        return "success"
        


    @cherrypy.expose
    def profile(self):
        userID = cherrypy.session.get('userID')
        if userID is not None:

            tmpl = env.get_template('profile.html')
            templateVars = {}
            """
                if self.hashUserID(cherrypy.session['userID']) != cherrypy.session['userHash']:
                self.logout()
                raise cherrypy.HTTPRedirect("/")
            """

            curs.execute("SELECT * FROM user WHERE id = %s" %cherrypy.session.get('userID'))
            userRow= curs.fetchone()
            templateVars['fname'] = userRow[3]

            return tmpl.render(templateVars)
        raise cherrypy.HTTPRedirect("/")

    @cherrypy.expose
    def make_deck(self):
        userID = cherrypy.session.get('userID')
        if userID is not None:

            tmpl = env.get_template('make_deck.html')
            templateVars = {}

            curs.execute("SELECT * FROM user WHERE id = %s" %userID)
            userRow= curs.fetchone()
            templateVars['fname'] = userRow[3]

            return tmpl.render(templateVars)
        raise cherrypy.HTTPRedirect("/")

    @cherrypy.expose
    def insertDeck(self, deckTitle, frontArray, backArray):
        frontArray = json.loads(frontArray)
        backArray = json.loads(backArray)
        userID = cherrypy.session.get('userID')
        if userID is not None:
            curs.execute("""INSERT INTO deck (user_id, deck_name) 
                VALUES(%s, '%s')""" 
                %(userID, deckTitle))

            curs.execute("SELECT * FROM deck WHERE user_id = %s AND deck_name = '%s'" %(userID, deckTitle))
            deckRow = curs.fetchone()
            deckID = deckRow[0]
            for i in range(len(frontArray)):
                curs.execute("""INSERT INTO card (deck_id, front, back) 
                    VALUES(%s, '%s', '%s')""" 
                    %(deckID, frontArray[i], backArray[i]))

            conn.commit()
            return "success"


        raise cherrypy.HTTPRedirect("/")

    @cherrypy.expose
    def view_decks(self):
        tmpl = env.get_template('view_decks.html')
        templateVars = {}

        userID = cherrypy.session.get('userID')
        if userID is not None:
            deckTitles = []
            deckIDs = []
            curs.execute("SELECT * FROM deck where user_id = %s" %(userID))

            for deckRow in curs.fetchall():
                deckTitles.append(deckRow[2])
                deckIDs.append(deckRow[0])

            templateVars['deckTitles'] = deckTitles
            templateVars['deckIDs'] = deckIDs
            return tmpl.render(templateVars)
        raise cherrypy.HTTPRedirect("/")

    @cherrypy.expose
    def getCards(self, deckID):
        print("FUNCTION CALLED FUNCTION CALLED FUNCTION CALLED")
        userID = cherrypy.session.get('userID')
        if userID is not None:
            cardData = {}
            curs.execute("SELECT * FROM card where deck_id = %s" %(deckID))
            
            i = 0
            for cardRow in curs.fetchall():
                cardData['front' + str(i)] = cardRow[2]
                cardData['back' + str(i)] = cardRow[3]

                i += 1

            jsonString = json.dumps(cardData)
            return jsonString

        raise cherrypy.HTTPRedirect("/")
            







        #return open('profile.html', 'r').read()

#Helper functions below
    def hashUserID(self, userID):
        return 7 * userID + 9 * (userID - 3)

    def isValidCred(self, username, password):
        curs.execute("SELECT * FROM user WHERE username = '%s'" %username)
        userRow= curs.fetchone()
        return userRow is not None and userRow[2] == password 

    def areFieldsFull(self, fields):
        for field in fields:
            if field == "":
                return False

        return True

if __name__ == '__main__':
    conf = {
         '/': {
             'tools.sessions.on': True,
             'tools.staticdir.root': os.path.abspath(os.getcwd())
         },
         '/static': {
             'tools.staticdir.on': True,
             'tools.staticdir.dir': './assets'
         }
    }
    cherrypy.quickstart(Flashcard(), '/', conf)
