from django.shortcuts import render
from django.http import JsonResponse
from tethys_sdk.permissions import login_required
from tethys_sdk.gizmos import Button, SelectInput, RangeSlider
# Import xarray: I added the following packages to my tethys environment:
# conda install -c conda-forge pyhdf nco cdo rasterio xarray gdal
#
import xarray as xr

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
    
    shapevariable = SelectInput(
        display_text='Select UCSB GeoServer Features',
        name='shapevariable',
        multiple=False,
        original=True,
        options=(
                 ('World Countries', 'global_admin0'),
                 ('World Admin 1','global_admin1'),
                 ('World Admin 2','global_admin2'),
                 ('Africa Countries', 'africa_admin0'),
                 ('Africa Admin 1','africa_admin1'),
                 ('Africa Admin 2','africa_admin2'),
                 ('Global Catchment Level 2/Fews 3','global_catch2_fews3'),
                 ('Global Catchment Level 2/Fews 4','global_catch2_fews4'),
                 ('Africa Catchment Level 2/Fews', 'africa_catch2_fews')),
    )


    context = {
        'variables': variables,
        'shapevariable':shapevariable,
        'save_button': save_button,
        'edit_button': edit_button,
        'remove_button': remove_button,
        'previous_button': previous_button,
        'next_button': next_button,
    }

    return render(request, 'baseapp/home.html', context)


def getTimeSeriesPoint(request):
    '''
    This function takes in the request for a timeseries of data at a specific point (i.e. marker)
    and returns a Json of x,y values that can be used for plotting. 
    '''
    lat = request.GET['lat'].strip('"')
    lon = request.GET['lon'].strip('"')
    varName = request.GET['layer'].strip('"') # We need the variable to extract from the data file.
    tdsUrl = request.GET['dataUrl'].strip('"')

    # Use xarray to pull out the data. This means we also need to get the OpenDAP URL
    # Open the dataset at tdsUrl
    ds=xr.open_dataset(tdsUrl)
    lat=float(lat)
    lon=float(lon)
    timeSeries=ds[varName].sel(latitude=lat,longitude=lon,method='nearest')
    # timeSeries is an xarray dataArray object.
    # The values are a numpy array! It can't be serialized as needed for the JSON Response. 
    # Convert the values to a list
    yvals=timeSeries.values.tolist()
    # The TDS data has times that need to be converted into an array of strings.
    xvals=timeSeries['time'].dt.strftime('%Y-%m-%dT%H:%M:%S').values.tolist() 
    #print(xvals)
    #print(yvals)   
    return JsonResponse({'x': xvals, 'y': yvals})


def getTimeSeriesBox(request):
    '''
    This function takes in the request for a timeseries of data within a boundign box
    and returns a Json of x,y values that can be used for plotting.

    Currently, this just returns the unweighted mean of valid (i.e. non-missing data)

    '''
    minlat = float(request.GET['min_lat'].strip('"'))
    maxlat = float(request.GET['max_lat'].strip('"'))
    minlon = float(request.GET['min_lon'].strip('"'))
    maxlon = float(request.GET['max_lon'].strip('"'))
    varName = request.GET['layer'].strip('"') # We need the variable to extract from the data file.
    tdsUrl = request.GET['dataUrl'].strip('"')
    # Use xarray to pull out the data. This means we also need to get the OpenDAP URL
    # Open the dataset at tdsUrl
    ds=xr.open_dataset(tdsUrl)
    # N.B. The CHIRPS Latitudes are stored descending ... thus the slice must also be descending or it will not properly subset the index.
    timeSeries=ds[varName].sel(latitude=slice(maxlat,minlat),longitude=slice(minlon,maxlon)).mean(dim=['latitude','longitude'])
    # timeSeries is an xarray dataArray object.
    # The values are a numpy array! It can't be serialized as needed for the JSON Response. 
    # Convert the values to a list
    yvals=timeSeries.values.tolist()
    # The TDS data has times that need to be converted into an array of strings.
    xvals=timeSeries['time'].dt.strftime('%Y-%m-%dT%H:%M:%S').values.tolist() 
    #print(xvals)
    #print(yvals)   
    return JsonResponse({'x': xvals, 'y': yvals})


            