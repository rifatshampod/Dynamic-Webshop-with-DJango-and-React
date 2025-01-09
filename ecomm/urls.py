"""
URL configuration for ecomm project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path


from home.views import *
from dashboard.views import *

urlpatterns = [
    path('', Dashboard, name="Dashboard"),
    path('clean-and-populate/', clean_and_populate, name='clean_and_populate'),
    path('populate-data/', populatedb, name='populate'),
    path('clean-data/', cleandata, name='clean_data'),
    path('admin/', admin.site.urls),

    path('api/products/', ProductListView.as_view(), name='product-list'),
    path('api/user/<int:user_id>/products/', UserProductsView.as_view(), name='user-products'),
    path('api/products/create/', ProductCreateView.as_view(), name='product-create'),
    path('api/users/<int:user_id>/products/<int:product_id>/edit/', ProductEditView.as_view(), name='product-edit'),
]
