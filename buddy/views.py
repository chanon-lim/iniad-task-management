from django.shortcuts import render

# Create your views here.

def buddy(request):
    return render(request, 'buddy/buddy.html')