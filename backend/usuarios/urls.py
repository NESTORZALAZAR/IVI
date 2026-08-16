from django.urls import path
from . import views

app_name = 'usuarios'

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('signup/', views.signup_view, name='signup'),
    path('check-username/', views.check_username_view, name='check_username'),
    path('check-email/', views.check_email_view, name='check_email'),
    path('resultados/', views.resultados_view, name='resultados'),
    path('doctor/', views.doctor_view, name='doctor'),
    path('admin/users/', views.admin_users_view, name='admin_users'),
    path('admin/results/', views.admin_results_view, name='admin_results'),
    path('admin/lector/', views.admin_lector_view, name='admin_lector'),
    path('admin/users/<int:user_id>/', views.admin_user_detail_view, name='admin_user_detail'),
]
