from django.db import models

# Create your models here.

#CRUD operation 

class Student(models.Model):
    #id = models.AutoField()
    name = models.CharField(max_length=155)
    age = models.IntegerField()
    email = models.EmailField()
    address = models.TextField()
    file = models.FileField()
    admin = models.BooleanField(default=1)

class Product(models.Model):
    name = models.CharField(max_length=255)

class Car(models.Model):
    car_name = models.CharField(max_length=500)
    speed = models.IntegerField(default=50)

    def __str__(self) -> str:
        return self.car_name 
