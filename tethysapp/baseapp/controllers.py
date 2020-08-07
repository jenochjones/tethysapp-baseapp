from django.shortcuts import render
from django.http import JsonResponse
from tethys_sdk.permissions import login_required
from tethys_sdk.gizmos import Button, SelectInput, RangeSlider
import geomatics
import pandas as pd
import os

@login_required()
def home(request):
    """
    Controller for the app home page.
    """
    save_button = Button(
        display_text='Save',
        name='save-button',
        icon='glyphicon glyphicon-floppy-disk',
        style='success',
        attributes={
            'data-toggle':'tooltip',
            'data-placement':'top',
            'title':'Save'
        }
    )

    edit_button = Button(
        display_text='Edit',
        name='edit-button',
        icon='glyphicon glyphicon-edit',
        style='warning',
        attributes={
            'data-toggle':'tooltip',
            'data-placement':'top',
            'title':'Edit'
        }
    )

    remove_button = Button(
        display_text='Remove',
        name='remove-button',
        icon='glyphicon glyphicon-remove',
        style='danger',
        attributes={
            'data-toggle':'tooltip',
            'data-placement':'top',
            'title':'Remove'
        }
    )

    previous_button = Button(
        display_text='Previous',
        name='previous-button',
        attributes={
            'data-toggle':'tooltip',
            'data-placement':'top',
            'title':'Previous'
        }
    )

    next_button = Button(
        display_text='Next',
        name='next-button',
        attributes={
            'data-toggle':'tooltip',
            'data-placement':'top',
            'title':'Next'
        }
    )

    # Create a SelectInput button for the variables.
    # Add this input to the context as well.
    variables = SelectInput(
        display_text='Select CHIRPS-GEFS Variable',
        name='variables',
        multiple=False,
        original=True,
        options=(('Precipitation Amount', 'precipitation_amount'),
                 ('Precipitation Anomaly','precipitation_anomaly')),
    )



    context = {
        'variables': variables,
        'save_button': save_button,
        'edit_button': edit_button,
        'remove_button': remove_button,
        'previous_button': previous_button,
        'next_button': next_button,
    }

    return render(request, 'baseapp/home.html', context)


def getTimeSeriesPoint(request):
    lat = request.GET['lat'].strip('"')
    lon = request.GET['lon'].strip('"')

    file = os.path.join(os.path.dirname(__file__), 'workspaces', 'app_workspace', '2020-01-26_2020-02-25historical.nc')
    print(file)
    var = 'precipitation'
    series = geomatics.timeseries.point([file], var, (float(lat), float(lon)), ('lon', 'lat'), 'time')
    data = pd.DataFrame.to_json(series)
    time = 'datetime'
    value = 'values'

    return JsonResponse({'data': data, 'time': time, 'value': value})

