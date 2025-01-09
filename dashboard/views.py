from django.shortcuts import render
from django.shortcuts import redirect
from django.http import HttpResponse
from home.models import User, Product, Order  # Import models
from django.contrib import messages  # Import messages framework
import random

def Dashboard(request):

     # Fetch all users from the home_user table
    users = User.objects.all()
    products = Product.objects.all()
    orders = Order.objects.all()

    return render(request, 'landing.html', {'users': users, 'products':products, 'orders':orders})

def clean_and_populate(request):
    # Step 1: Delete all users and products
    User.objects.all().delete()
    Product.objects.all().delete()
    Order.objects.all().delete()

    # Step 2: Create 6 test users
    users = []
    for i in range(1, 7):
        user = User.objects.create(
            username=f"testuser{i}",
            email=f"testuser{i}@shop.aa",
            password=f"pass{i}"
        )
        users.append(user)

    # Step 3: Create 30 test products (10 per user for the first 3 users)
    for i, user in enumerate(users[:3], start=1):  # Only first 3 users
        for j in range(1, 11):  # Create 10 products per user
            Product.objects.create(
                name=f"testuser{i} product{j}",
                description=f"testuser{i} product{j} description",
                price=round(random.uniform(2.00, 10.00), 2),
                quantity=1,
                user_id=user.id
            )

    messages.success(
        request, "All previous data is cleaned and new users and products created."
    )
    # Redirect back to the landing page
    return redirect('/') 

def cleandata(request):
    User.objects.all().delete()
    Product.objects.all().delete()
    Order.objects.all().delete()

    messages.success(
        request, "All previous data deleted."
    )
    # Redirect back to the landing page
    return redirect('/') 

def populatedb(request):
    users = []
    
    number = random.randint(50, 100)
    user = User.objects.create(
        username=f"testuser{number}",
        email=f"testuser{number}@shop.aa",
        password=f"pass{number}"
    )
    users.append(user)

    # Step 3: Create 30 test products (10 per user for the first 3 users)
    # for i, user in enumerate(users[:3], start=1):  # Only first 3 users
    for j in range(1, 3):  # Create 10 products per user
        Product.objects.create(
            name=f"testuser{number} product{j}",
            description=f"testuser{number} product{j} description",
            price=round(random.uniform(2.00, 10.00), 2),
            quantity=1,
            user_id=user.id
        )

    messages.success(
        request, "New user with 2 products created."
    )
    # Redirect back to the landing page
    return redirect('/') 