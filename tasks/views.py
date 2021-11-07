from django import template
from django.shortcuts import render
from django.template import context, loader
from django.http import HttpResponse, JsonResponse
from django.core import serializers
import datetime
from django.forms.models import model_to_dict
from .models import Event
from django.utils.translation import gettext as _


# Create your views here.
def trans_test(request):
    from iniad_practice2_g6 import settings
    return HttpResponse(settings.LOCALE_PATHS)
    output = _("Forum")
    return HttpResponse(output)

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
    # only query event later than current time
    event_list = Event.objects.filter(deadline__gt=datetime.datetime.now())
    for event in event_list:
        print('Filter event:', event)
    # event_list = Event.objects.order_by('-deadline')
    template = loader.get_template('tasks/index.html')
    test_data = {'hello': 'world'}
    # for event in event_list:
    #     print(event) # Event 2
    #     print(type(event)) # <class 'tasks.models.Event'>
    data_json = serializers.serialize('json', event_list)
    # print(data_json)
    # print(type(data_json)) # str, get the string in javascript
    ############################
    # print('instance.__dict__')
    # for event in event_list:
    #     print(event.__dict__) 
    #     data_json = event.__dict__ # error in javascript Object of type ModelState is not JSON serializable
    ###############################
    # for event in event_list:
    #     print("model_to_dict")
    #     print(model_to_dict(event))
    ###############################
    # for event in event_list:
    #     print("serializers")
    #     print(serializers.serialize('json', event)) # error, event cannot serialize
    ##############################
    # print(data_json)
    context = {
        'event_list': event_list,
        'test_data': test_data,
        'data_json': data_json
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
    context = serializers.serialize('json', event_list)
    return JsonResponse(context, safe=False)