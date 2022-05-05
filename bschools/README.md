The map shows traffic accidents recorded in Oslo, Norway, for the year 2013.

The [Leaflet Markercluster](https://github.com/Leaflet/Leaflet.markercluster) plugin is wonderful. Since the markerclusters are divIcons you can put whatever you want inside them using the iconCreateFunction. I wanted my clusters to reveal more information than just the marker count and figured a pie chart would do the job. So I told the iconCreateFunction to do some [D3](http://d3js.org/) magic and this is the result.

The example is a bit more complicated than necessary due to how my dataset is structured. But if you take a look at the defineClusterIcon() function you'll see that I use d3.nest() to build a dataset for the pie chart based on a given property from all the cluster's children. Then I pass this dataset over to the bakeThePie() function together with instructions on how to style the chart. The function returns svg markup which in turn is placed inside the divIcon.

Feel free to suggest improvements.