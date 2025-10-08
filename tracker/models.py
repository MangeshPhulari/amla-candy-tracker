from django.db import models

# models.py
class Batch(models.Model):
    date = models.DateField()
    batch_id = models.CharField(max_length=50, unique=True)
    amla_input = models.FloatField(null=True, blank=True)
    slices_weight = models.FloatField(null=True, blank=True)
    sugar_added = models.FloatField(null=True, blank=True)
    marinated_weight = models.FloatField(null=True, blank=True)
    syrup_generated = models.FloatField(null=True, blank=True)
    final_weight = models.FloatField(null=True, blank=True)
    remarks = models.TextField(default="", blank=True)

    def __str__(self):
        return self.batch_id

    def yield_percentage(self):
        if self.final_weight and self.slices_weight:
            return round((self.final_weight / self.slices_weight) * 100, 2)
        return None

