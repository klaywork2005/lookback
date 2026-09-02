from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.


def home(request):
    return render(request, 'App.tsx')

def movie(request):
    return HttpResponse(request, 'App.tsx')