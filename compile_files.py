#!/usr/bin/python2.4

import httplib, urllib, sys

# Define the parameters for the POST request and encode them in
# a URL-safe format.

params = urllib.urlencode([
    # Multiple code_url parameters:
    ('code_url', 'http://pedaplus.com/games/flashnotes/test/js/utils.js'),
	('code_url', 'http://pedaplus.com/games/flashnotes/test/js/fn_ajax.js'),
	('code_url', 'http://pedaplus.com/games/flashnotes/test/js/jquery_handlers.js'),
	('code_url', 'http://pedaplus.com/games/flashnotes/test/js/controllers/gamecontroller.js'),
	('code_url', 'http://pedaplus.com/games/flashnotes/test/js/controllers/notationcontroller.js'),
	('code_url', 'http://pedaplus.com/games/flashnotes/test/js/models/notationmodel.js'),
	('code_url', 'http://pedaplus.com/games/flashnotes/test/js/models/statusmodel.js'),
	('code_url', 'http://pedaplus.com/games/flashnotes/test/js/views/box.js'),
	('code_url', 'http://pedaplus.com/games/flashnotes/test/js/views/clef.js'),
	('code_url', 'http://pedaplus.com/games/flashnotes/test/js/views/notationview.js'),
	('code_url', 'http://pedaplus.com/games/flashnotes/test/js/views/note.js'),
	('code_url', 'http://pedaplus.com/games/flashnotes/test/js/views/staff.js'),
	('code_url', 'http://pedaplus.com/games/flashnotes/test/js/views/statusview.js'),	
    ('compilation_level', 'SIMPLE_OPTIMIZATIONS'),
    ('output_format', 'text'),
    ('output_info', 'compiled_code'),	
  ])

# Always use the following value for the Content-type header.
headers = { "Content-type": "application/x-www-form-urlencoded" }
conn = httplib.HTTPConnection('closure-compiler.appspot.com')
conn.request('POST', '/compile', params, headers)
response = conn.getresponse()
data = response.read()
print data
conn.close