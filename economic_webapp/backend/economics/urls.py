from django.urls import path
from .views import economics_country_camparison





urlpatterns = [
    path("compare/", economics_country_camparison)
]




