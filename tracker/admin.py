# admin.py
from django.contrib import admin
from .models import Batch

@admin.register(Batch)
class BatchAdmin(admin.ModelAdmin):
    list_display = [
        'date', 'batch_id', 'amla_input', 'slices_weight', 'sugar_added',
        'marinated_weight', 'syrup_generated', 'final_weight', 'yield_percentage'
    ]
