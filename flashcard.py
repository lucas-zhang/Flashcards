import cherrypy
import os, os.path
import random
import MySQLdb as mdb

conn = mdb.connect("localhost","root","lzdbpass","lucas_test")
curs = conn.cursor()

""" user : id, username, password, fname, lname, email
    deck: id, user_id, deck_name
    card: id, deck_id, front, back
"""
    
class Flashcard(object):

    @cherrypy.expose
    def index(self):
        primes = [2, 3, 5, 7, 11, 13, 17]
        return open('index.html', 'r').read()

    @cherrypy.expose
    def login(self, username, password):
        if self.isValidCred(username, password):
            return "success"
        else:
          return "failure"

    @cherrypy.expose
    def signup(self, username, password, password2, fname, lname, email):

            if password != password2:
                return "The passwords you entered don't match!"
            curs.execute("SELECT * FROM user WHERE username = %s", username)
            userRow = curs.fetchone()
            if userRow is not None:
                return "You must choose a different username!"
            
            curs.execute("""INSERT INTO user (username, password, fname, lname, email) 
                            VALUES('%s', '%s', '%s', '%s', '%s')""" 
                            %(username, password, fname, lname, email))
            conn.commit()
            return "success"

    def isValidCred(self, username, password):
            curs.execute("SELECT * FROM user WHERE username = '%s'" %username)
            userRow= curs.fetchone()
            return userRow is not None and userRow[4] == password 

    @cherrypy.expose
    def profile(self, userID=None):
        return """<html><body>THIS IS THE PROFILE PAGE</body></html>"""
        """ 
        If userId = None: return the default profile page or ask for a signup
        Return the dynamic html page with the query to a database given a userID

        """


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
