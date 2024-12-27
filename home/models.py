from django.db import models

# Create your models here.

class Student(models.Model):
    #id = models.AutoField()
    name = models.CharField(max_length=155)
    age = models.IntegerField()
    email = models.EmailField()
    address = models.TextField()
    file = models.FileField()
    admin = models.BooleanField(default=0)

class Product(models.Model):
    name = models.CharField(max_length=255)