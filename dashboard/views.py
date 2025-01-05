from django.shortcuts import render
from django.http import HttpResponse

def Dashboard(request):

    return render(request, "landing.html")

def About(request):

    return render(request, "about.html")

# Create your views here.
