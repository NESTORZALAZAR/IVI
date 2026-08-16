import sqlite3, json
conn=sqlite3.connect('backend/db.sqlite3')
c=conn.cursor()
c.execute("select id,username,email from auth_user where username='testuser1'")
r=c.fetchone()
open('backend/scripts/query_user_db.out','w', encoding='utf-8').write(json.dumps(r))
print('wrote')
