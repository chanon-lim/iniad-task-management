from django.urls import path
from . import views


# URLConf
app_name = 'buddy'
urlpatterns = [
    path('', views.buddy, name="buddy")
]