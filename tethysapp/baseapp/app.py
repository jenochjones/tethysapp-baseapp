from tethys_sdk.base import TethysAppBase, url_map_maker


class Baseapp(TethysAppBase):
    """
    Tethys app class for BASIC APP.
    """

    name = 'BASIC APP'
    index = 'baseapp:home'
    icon = 'baseapp/images/icon.gif'
    package = 'baseapp'
    root_url = 'baseapp'
    color = '#d35400'
    description = ''
    tags = ''
    enable_feedback = False
    feedback_emails = []

    def url_maps(self):
        """
        Add controllers
        """
        UrlMap = url_map_maker(self.root_url)

        url_maps = (
            UrlMap(
                name='home',
                url='baseapp',
                controller='baseapp.controllers.home'
            ),

            UrlMap(
                name='timeSeriesPoint',
                url='controllers/get_point_values/',
                controller='baseapp.controllers.getTimeSeriesPoint'
            ),

            UrlMap(
                name='timeSeriesBox',
                url='controllers/get_box_values/',
                controller='baseapp.controllers.getTimeSeriesBox'
            ),
        
        
        )

        return url_maps