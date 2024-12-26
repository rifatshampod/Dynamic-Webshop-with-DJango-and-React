from django.shortcuts import render

from django.http import HttpResponse

def Home(request):
    products = [
        {'name': 'University Key Ring', 'price': 26},
        {'name': 'Univesity banner', 'price': 22},
        {'name': 'Turku Key Ring', 'price': 16},
        {'name': 'Map', 'price': 21},
    ]

    text = "lorem ipsam dalor satis"

    return render(request, "index.html", context={'products':products, 'text':text})


def success_page(request):
    print("*"*10)
    return HttpResponse("<h1>Hey, this is a success page.</h1>")
