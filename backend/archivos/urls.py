from django.urls import path
from . import views

urlpatterns = [
    path('procesar/', views.procesar_archivo, name='procesar_archivo'),
]
