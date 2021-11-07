from django.urls import path
from . import views


# URLConf
app_name = 'tasks'
urlpatterns = [
    path('', views.index, name="index"),
    path('ajax/', views.ajax_post, name='ajax'),
    path('test', views.trans_test)
]