from rest_framework import viewsets
from .models import Batch
from .serializers import BatchSerializer
from django.shortcuts import render

class BatchViewSet(viewsets.ModelViewSet):
    queryset = Batch.objects.all().order_by('-date')
    serializer_class = BatchSerializer

# frontend
def index(request):
    return render(request, "tracker/index.html")
