from django.urls import path
from . import views

urlpatterns = [
    path('extract-and-speak/', views.extract_and_speak, name='extract-and-speak'),
    path('check-tesseract/', views.check_tesseract, name='check-tesseract'),
]
