import os
import sqlite3
import json
DB = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'db.sqlite3'))
conn = sqlite3.connect(DB)
cur = conn.cursor()
# Profile table links to auth_user via user_id; find latest user with role='doctor'
cur.execute("SELECT u.id, u.username, u.email FROM auth_user u JOIN usuarios_profile p ON p.user_id = u.id WHERE p.role='doctor' ORDER BY u.id DESC LIMIT 1")
row = cur.fetchone()
if row:
    print(json.dumps({'id': row[0], 'username': row[1], 'email': row[2]}))
else:
    print(json.dumps({'error': 'no doctor found'}))
conn.close()
