"""Example WSGI file for PythonAnywhere.

Copy this file into the WSGI file shown in PythonAnywhere's Web tab and replace
PA_USERNAME with the account username.
"""

import os
import sys

project_folder = "/home/PA_USERNAME/IVI/backend"
if project_folder not in sys.path:
    sys.path.insert(0, project_folder)

from dotenv import load_dotenv

load_dotenv(os.path.join(project_folder, ".env"))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

from django.core.wsgi import get_wsgi_application

application = get_wsgi_application()
