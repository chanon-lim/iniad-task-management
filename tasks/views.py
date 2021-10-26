from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
# Request Handler: request -> response

def index(request):
    return render(request, 'index.html')