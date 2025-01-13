from django.contrib import admin
from django.urls import path


from home.views import *
from dashboard.views import *

urlpatterns = [
    # Landing page routes
    path('', Dashboard, name="Dashboard"),
    path('clean-and-populate/', clean_and_populate, name='clean_and_populate'),
    path('populate-data/', populatedb, name='populate'),
    path('clean-data/', cleandata, name='clean_data'),
    path('admin/', admin.site.urls),

    # Product APIs 
    path('api/products', ProductListView.as_view(), name='product-list'),
    path('api/products/<int:product_id>/', SingleProductView.as_view(), name='single_product'),
    path('api/products/seller', UserProductAPIView.as_view(), name='user-products'),
    path('api/products/create', ProductCreateView.as_view(), name='product-create'),
    path('api/products/edit', ProductEditView.as_view(), name='product-edit'),
    path('api/products/search/', ProductSearchView.as_view(), name='product-search'),

    # User APIs 
    path('api/users', UserListView.as_view(), name='user-list'),
    path('api/register', UserRegistrationAPIView.as_view(), name='register'),
    path('api/login', UserLoginAPIView.as_view(), name='login'),
    path('api/change-password', ChangePasswordAPIView.as_view(), name='change_password'),

    # Cart APIs 
    path('api/cart', UserCartAPIView.as_view(), name='user-cart'),
    path('api/cart/create', CartCreateView.as_view(), name='add-to-cart'),
    path('api/cart/edit', EditCartItemAPIView.as_view(), name='edit_cart_item'),
    path('api/cart/delete', DeleteCartItemAPIView.as_view(), name='delete_cart_item'),

    # Order APIs
    path('api/orders', UserOrderAPIView.as_view(), name='user-order'),
    path('api/orders/create', OrderCreateView.as_view(), name='add-order'),
]
