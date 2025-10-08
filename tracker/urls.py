from django.shortcuts import render
from django.urls import path, include

from rest_framework.routers import DefaultRouter
from .views import BatchViewSet

router = DefaultRouter()
router.register(r'batches', BatchViewSet, basename='batch')

urlpatterns = [
    path('api/', include(router.urls)),
    path('', include('django.contrib.staticfiles.urls')),  # for static
    path('', lambda request: render(request, "tracker/index.html")),
]
