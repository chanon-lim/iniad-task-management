from django import template
from django.shortcuts import render
from django.template import context, loader
from django.http import HttpResponse, JsonResponse
import datetime
from .models import Event

# Create your views here.

def index(request):
    if request.method == "POST":
        # Now this branch will not work!!
        print("This conditional branch in index fired!")
        title = request.POST['title']
        date = request.POST['date'].split('/')
        time = request.POST['time'].split(':')
        year = int(date[0])
        month = int(date[1])
        day = int(date[2])
        hour = int(time[0])
        min = int(time[1])
        deadline = datetime.datetime(year, month, day, hour, min)
        new_event_data = Event(title=title, deadline=deadline)
        new_event_data.save()

    event_list = Event.objects.order_by('-deadline')
    template = loader.get_template('tasks/index.html')
    context = {
        'event_list': event_list,
    }
    return HttpResponse(template.render(context, request))

def ajax_post(request):
    if request.is_ajax and request.method == "POST":
        print('Ok, received AJAX request')
        print(request.POST)
        title = request.POST['title']
        date = request.POST['date'].split('/')
        time = request.POST['time'].split(':')
        year = int(date[0])
        month = int(date[1])
        day = int(date[2])
        hour = int(time[0])
        min = int(time[1])
        deadline = datetime.datetime(year, month, day, hour, min)
        new_event_data = Event(title=title, deadline=deadline)
        new_event_data.save()
    event_list = Event.objects.order_by('-deadline')
    context = {
        "name": "ajax response",
        "date": "today"
    }
    return JsonResponse(context)