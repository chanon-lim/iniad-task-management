from django.db import models

# Create your models here.

class Event(models.Model):
    title = models.CharField(max_length=200)
    content = models.CharField(max_length=200)
    deadline = models.DateTimeField('Deadline')

    def __str__(self) -> str:
        return self.title
