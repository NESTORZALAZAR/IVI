from django.urls import path
from . import views

urlpatterns = [
    path('procesar/', views.procesar_archivo, name='procesar_archivo'),
    path('describe-ia/', views.describe_imagen_ia, name='describe_imagen_ia'),
]
